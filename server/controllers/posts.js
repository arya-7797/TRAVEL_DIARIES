import Post from "../models/Post.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import NotificationModel from "../models/Notification.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { _page, _limit } = req.query;
    console.log("paaa ", req.query);
    const pageNumber = parseInt(_page);
    const limitNumber = parseInt(_limit);
    const skip = (pageNumber - 1) * limitNumber;
    const totalPosts = await Post.countDocuments({ unlisted: false });
    const totalPages = Math.ceil(totalPosts / limitNumber);
    console.log("pn ", pageNumber, " > ", totalPages);
    console.log("skip ", skip);
    if (pageNumber > totalPages) {
      console.log("797979");
      return res.status(310).json([]);
    }
    const posts = await Post.find({ unlisted: false })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName picturePath",
        },
        options: { sort: { createdAt: -1 } },
      })
      .skip(skip)
      .limit(limitNumber);
    res.status(200).json({ posts, totalPages });
  } catch (err) {
    console.log("get feed eee", err);
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }).exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    if (post.userId !== userId && !isLiked) {
      const user = await User.findById(userId);
      const username = `${user.firstName} ${user.lastName}`;

      const notification = new NotificationModel({
        type: "like",
        postId: Object(post._id),
        notificationFor: Object(post.userId),
        notificationBy: Object(userId),
        notificationMessage: `${username} liked your post`,
      });
      await notification.save();
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    console.log("err => ", err);
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  console.log("reqq ", req.body);
  try {
    const { postId, userId, description, picturePath } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("pp ", picturePath);
    if (picturePath) {
      post.picturePath = picturePath;
    }
    post.description = description;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).exec();

    res.status(200).json(posts);
  } catch (error) {
    console.log("eee ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  console.log("ggghgh", deletePost);
  try {
    const { userId } = req.body;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(405).json({ message: "Post not found" });
    }
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("deletePost error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reportReason, userId } = req.body;
    const existingReport = await Report.findOne({
      post: postId,
      reportedBy: userId,
    });

    if (existingReport) {
      return res
        .status(304)
        .json({ msg: "You have already reported this post" });
    }

    const newReport = new Report({
      post: postId,
      reportedBy: userId,
      reportReason,
    });

    const savedPost = await newReport.save();
    res.status(200).json({ msg: "Reported the post" });
  } catch (error) {
    console.log("errr", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("jhdsfjas", postId);
    const { comment, userId } = req.body;
    console.log("jhbds", comment);
    const post = await Post.findById(postId);
    console.log("sdfs", post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.unshift({
      comment,
      author: userId,
      isDelete: false,
    });

    if (post.author != userId) {
       const user= await User.findById(userId);
       const username=`${user.firstName} ${user.lastName}`

      const notification = new NotificationModel({
        type: "comments",
        postId: post._id,
        notificationFor: post.userId,
        notificationBy: userId,
        notificationMessage: `${username} commented on your post`,
      });
      await notification.save();
    }
    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName  picturePath",
        },
        options: { sort: { createdAt: -1 } },
      })
      .exec();
    console.log(populatedPost);
    res.status(201).json(populatedPost);
  } catch (error) {
    console.log("createComment error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (post.comments[commentIndex].author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName  picturePath",
        },
        options: { sort: { createdAt: -1 } },
      })
      .exec();
    res
      .status(200)
      .json({ message: "Comment deleted successfully", post: populatedPost });
  } catch (error) {
    console.log("deleteComment error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

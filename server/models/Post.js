
import mongoose from "mongoose";


const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    unlisted: {
      type: Boolean,
      required: false,
      default: false
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [
      {
        comment: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        isDelete: Boolean,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    reports: {
      type: Number,
      default: 0
  },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

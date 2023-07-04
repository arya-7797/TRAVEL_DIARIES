import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Admin } from "../models/Admin.js";
import Report from "../models/Report.js";
import Loginvalidate from "../utils/validate.js";
import Post from "../models/Post.js";



export const adminLogin = async (req, res) => {
  try {
    var { error } = Loginvalidate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    var admin = await Admin.findOne({ email: req.body.email });
    console.log(admin);
    if (!admin)
      return res.status(401).send({ message: "Invalid Email or Password" });

    var validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    delete admin.password;
    res.status(200).json({ token, user: admin });
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    if (!user)
      return res.status(500).json({ message: "didnt got users from database" });

    console.log("user r ", user.length);
    res.status(200).json({ message: "Success", user });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const blockUsers = async (req, res) => {
  console.log("blockUser");
  try {
    let id = req.params.id;

    const user = await User.findByIdAndUpdate(
      { _id: Object(id) },
      { $set: { Block: true } }
    );

    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const unblockUsers = async (req, res) => {
  let id = req.params.id;
  try {
    console.log("unblock");
    const user = await User.findByIdAndUpdate(
      { _id: Object(id) },
      { $set: { Block: false } }
    );

    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 },
          reasons: { $push: "$reportReason" },
          reportedBy: { $push: "$reportedBy" },
        },
      },

      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: "$post",
      },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedByUsers",
        },
      },
    ]);
    console.log("repo ", reports);
    res.status(200).json(reports);
  } catch (err) {
    res.status(500);
  }
};

export const unlistPost = async (req, res) => {
  console.log("ulist", unlistPost);
  const id = req.params.postId;
  try {
    const post = await Post.findByIdAndUpdate(
      { _id: Object(id) },
      { $set: { unlisted: true } }
    );
    const report = await Report.findOneAndUpdate(
      { post: Object(id) },
      { $set: { status: "unlisted" } }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  getAllPosts,
  createPost,
  deletePost,
  reportPost,
  createComment,
  deleteComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();
router.post("/post/:userId", verifyToken, createPost);
router.get("/", getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/posts", getAllPosts);
router.delete("/:postId", verifyToken, deletePost);
router.patch("/:id/like", verifyToken, likePost);
router.post("/report/:postId", verifyToken, reportPost);
router.post("/:postId/comment", verifyToken, createComment);
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);

export default router;

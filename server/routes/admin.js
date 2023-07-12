import express from "express";
import {adminLogin,unlistPost ,getAllUsers,blockUsers,unblockUsers,getAllReports} from "../controllers/admin.js" ;
import {verifyToken} from "../middleware/auth.js";
const router =express.Router();

router.post('/login',adminLogin)
router.get('/getAllUsers', verifyToken,getAllUsers)
router.patch("/block/:id", verifyToken,blockUsers);
router.patch("/unblock/:id", verifyToken,unblockUsers);
router.get('/getAllReports', verifyToken,getAllReports);
router.patch(`/post/:postId`, verifyToken,unlistPost)
export default router;
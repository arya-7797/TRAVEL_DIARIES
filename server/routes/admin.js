import express from "express";
import {adminLogin,unlistPost ,getAllUsers,blockUsers,unblockUsers,getAllReports} from "../controllers/admin.js" ;
import {verifyToken} from "../middleware/auth.js";
const router =express.Router();

router.post('/login',adminLogin)
router.get('/getAllUsers',getAllUsers)
router.patch("/block/:id",blockUsers);
router.patch("/unblock/:id",unblockUsers);
router.get('/getAllReports',getAllReports);
router.patch(`/post/:postId`,unlistPost)
export default router;
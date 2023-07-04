import express from "express";
import{ markNotificationAsRead,getNotifications} from "../controllers/notification.js"
const router = express.Router();

router.get('/getnotifications/:id',getNotifications);
router.patch('/make-seen/:id',markNotificationAsRead)

export default router;
import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true,
  }, 
 
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  notificationFor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notificationBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  notificationMessage: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const NotificationModel = mongoose.model('notifications', NotificationSchema);

export default NotificationModel;

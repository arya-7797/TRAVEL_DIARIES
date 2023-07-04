import mongoose from "mongoose";
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reportReason: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "reported",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("reports", ReportSchema);

export default Report;

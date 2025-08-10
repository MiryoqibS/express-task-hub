import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    }
});

export default mongoose.model("Comment", commentSchema);
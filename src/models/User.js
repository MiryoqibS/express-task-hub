import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    friendRequest: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    sendRequests: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }]
});

export default mongoose.model("User", userSchema);
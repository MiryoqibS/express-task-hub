import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
}));

app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);
app.use(commentRoutes);

export default app;
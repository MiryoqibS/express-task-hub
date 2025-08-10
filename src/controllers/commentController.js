import { commentServices } from "../services/commentServices.js";

// Получение комментариев
export const getComments = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const comments = await commentServices.findCommentsByTask(taskId);
        return res.status(200).json([...comments]);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Добавление комментария
export const addComment = async (req, res) => {
    try {
        const { taskId, comment } = req.body;

        await commentServices.createComment({
            author: req.user._id,
            taskId,
            comment,
        });
        return res.status(201).json({ message: "Комментарий добавлен" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

// Получение ответов комментария
export const getCommentReplies = async (req, res) => {
    try {
        const replies = await commentServices.findCommentReplies(req.params.id);
        return res.status(200).json(replies);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Добавления ответа комментарию
export const replyToComment = async (req, res) => {
    try {
        const parentCommentId = req.params.id;
        const { comment, taskId, replyTo } = req.body;

        const newComment = await commentServices.createComment({
            author: req.user._id,
            comment,
            taskId,
            replyTo
        });

        await commentServices.replyToComment(parentCommentId, newComment._id);
        return res.status(201).json({ message: "Ваш ответ добавлен", reply: newComment });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};
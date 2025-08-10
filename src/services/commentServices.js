import Comment from "../models/Comment.js";

class CommentServices {
    // Создание комментария
    async createComment(data) {
        try {
            const { author, comment, taskId } = data;

            if (!author) throw new Error("Автор комментария не был найден");
            if (!comment) throw new Error("Текст комментария не был найден");
            if (!taskId) throw new Error("Задача для комментария не была найдена");

            return await Comment.create(data);
        } catch (error) {
            throw new Error(`Ошибка при создании комментария: ${error.message}`);
        };
    }

    // Удаление комментария
    async deleteComment(id) {
        try {
            return await Comment.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Ошибка при удаление комментария: ${error.message}`);
        };
    }

    // Редактирования комментария
    async updateComment(id, comment) {
        try {
            if (!comment) throw new Error("Текст комментария не был найден");

            return await Comment.findByIdAndUpdate(id, { comment }, { new: true });
        } catch (error) {
            throw new Error(`Ошибка при обновлении комментария: ${error.message}`);
        };
    }

    // Поиск комментариев задачи
    async findCommentsByTask(taskId) {
        try {
            return await Comment.find({ taskId })
                .populate("author", "name")
                .populate("replies")
                .sort({ createdAt: 1 });
        } catch (error) {
            throw new Error(`Ошибка при получении комментариев задачи: ${error.message}`);
        };
    }

    // Ответь комментарию
    async replyToComment(parentCommentId, replyId) {
        try {
            return await Comment.findByIdAndUpdate(
                parentCommentId,
                { $push: { replies: replyId } },
                { new: true },
            ).populate("replies");
        } catch (error) {
            throw new Error(`Ошибка при обработке ответа на комментарий: ${error.message}`);
        };
    }

    // Поиск ответов задачи
    async findCommentReplies(parentCommentId) {
        try {
            const comment = await Comment.findById(parentCommentId)
                .populate({
                    path: "replies",
                    populate: [
                        {
                            path: "author",
                            select: "name",
                        },
                        {
                            path: "replyTo",
                            populate: {
                                path: "author",
                                select: "name",
                            }
                        },
                    ]
                });
            return comment.replies;
        } catch (error) {
            throw new Error(`Ошибка при обработке ответа на комментарий: ${error.message}`);
        };
    }
};

export const commentServices = new CommentServices();
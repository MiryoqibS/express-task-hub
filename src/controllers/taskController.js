import { taskServices } from "../services/taskServices.js";

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await taskServices.createTask({ title, description, userId: req.user._id });
        return res.status(201).json({ message: "Задача создана", task });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await taskServices.findTasks(req.user._id);
        return res.status(200).json({ message: "Задачи пользователя найдены", tasks });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

export const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskServices.findTask(taskId);
        return res.status(200).json({ message: "Задача найдена", task });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

export const updateTask = async (req, res) => {
    try {
        const { id, title, description } = req.body;

        const updated = await taskServices.updateTask(id, {
            title,
            description,
            userId: req.user._id,
        });

        return res.status(200).json({ message: "Задача обновлена", task: updated });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskServices.deleteTask(taskId);

        if (!task) {
            return res.status(404).json({ message: "Задача не найдена" });
        };

        return res.status(200).json({ message: "Задача удалена" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};


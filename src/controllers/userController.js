import { sessionServices } from "../services/sessionServices.js";
import { taskServices } from "../services/taskServices.js";
import { userServices } from "../services/userServices.js";
import bcrypt from "bcrypt";

// === Система аккаунтов ===
// Регистрация
export const register = async (req, res) => {
    try {
        const { name, email, password, passwordRepeat } = req.body;

        if (passwordRepeat !== password) {
            return res.status(400).json({ message: "Пароли не совпадают" });
        };

        const candidate = await userServices.findUserByEmail(email);

        if (candidate) {
            return res.status(409).json({ message: "Пользователь с такой электронной почтой уже существует" });
        };

        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        const user = userServices.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "Пользователь был создан", user });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" })
    };
};

// Авторизация
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userServices.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Такой пользователь не был найден" });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Неверный пароль" });
        };

        const session = await sessionServices.createSession(user._id);

        res.cookie("sessionId", session._id, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24,
        });

        console.log("session in login:", session);

        return res.status(200).json({ message: "Пользователь был найден", user });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" })
    };
};

// Получение информации об пользователе
export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const user = await userServices.findUserById(id);

            if (!user) {
                return res.status(401).json({ message: "Пользователь не был найден" });
            };

            const userTasks = await taskServices.findTasks(id);

            const { password, ...safeUser } = user._doc;
            safeUser.tasks = userTasks;

            return res.status(200).json({ message: "Пользователь был найден", user: safeUser });
        } else {
            const { password, ...safeUser } = req.user._doc;

            return res.status(200).json({ message: "Пользователь был найден", user: safeUser });
        };
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Выход из аккаунта
export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "Не авторизован" });
        };

        await sessionServices.deleteSession(sessionId);

        res.clearCookie("sessionId", {
            httpOnly: true,
            samesite: "lax",
            secure: false,
        });

        return res.status(200).json({ message: "Пользователь вышел" });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};


// === Система друзей ==
// Получение списка друзей пользователя
export const getUserFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const friends = await userServices.getFriends(userId);
        return res.status(200).json({ friends });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Удаление друга из списка
export const removeUserFriend = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const friendId = req.params.id;

        try {
            await userServices.removeFriend(currentUserId, friendId);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };

        return res.status(200).json({ message: "Ваш друг был удалён из списка" });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" })
    }
};

// Отправка запросов в друзья 
export const sendFriendRequest = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user._id;

        try {
            await userServices.sendFriendsRequest(receiverId, senderId);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };

        return res.status(200).json({ message: "Отправлен запрос в друзя" });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Принятие запроса
export const acceptFriendRequest = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const requesterId = req.params.id;

        try {
            await userServices.acceptFriendRequest(currentUserId, requesterId);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };

        return res.status(200).json({ message: "Пользователь добавлен в друзья" });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Отклонение запроса
export const rejectFriendRequest = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const requesterId = req.params.id;

        try {
            await userServices.rejectFriendRequest(currentUserId, requesterId);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };

        return res.status(200).json({ message: "Заявка в друзья была отклонена" })
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Получение списка запросов в друзья пользователя
export const getUserRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await userServices.getRequests(userId);
        return res.status(200).json({ requests });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};
import { sessionServices } from "../services/sessionServices.js";
import { userServices } from "../services/userServices.js";
import bcrypt from "bcrypt";

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
            maxAge: 1000 * 60 * 60 * 24,
        });

        return res.status(200).json({ message: "Пользователь был найден", user });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" })
    };
};

export const getProfile = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "Не авторизован" });
        };

        const session = await sessionServices.findSession(sessionId);

        if (!session || session.expiresAt < Date.now()) {
            return res.status(401).json({ message: "Сессия не действительна" });
        };

        const user = await userServices.findUserById(session.userId);

        if (!user) {
            return res.status(401).json({ message: "Пользователь не был найден" });
        };

        const { password, ...safeUser } = user._doc;

        return res.status(200).json({ message: "Пользователь был найден", user: safeUser });
    } catch (error) {
        console.log(`Ошибка сервера: ${error}`);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

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
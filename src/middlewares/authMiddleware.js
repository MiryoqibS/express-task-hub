import { sessionServices } from "../services/sessionServices.js";
import { userServices } from "../services/userServices.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "Не авторизован " });
        };

        const session = await sessionServices.findSession(sessionId);

        if (!session || session.expiresAt < Date.now()) {
            return res.status(401).json({ message: "Сессия не действительна" })
        };

        const user = await userServices.findUserById(session.userId);

        if (!user) {
            return res.status(401).json({ message: "Не авторизован " });
        };

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};
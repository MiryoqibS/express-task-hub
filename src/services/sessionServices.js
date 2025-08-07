import Session from "../models/Session.js";

class SessionServices {
    // Создание сессии
    async createSession(userId) {
        try {
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 часа

            return await Session.create({
                userId,
                expiresAt,
            });
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Поиск сессии
    async findSession(id) {
        try {
            return await Session.findById(id);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Удаление сессии
    async deleteSession(id) {
        try {
            await Session.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }
}

export const sessionServices = new SessionServices();
import User from "../models/User.js";

class UserServices {
    // Создание пользователя
    async createUser(data) {
        try {
            return await User.create(data);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Поиск пользователя по id
    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Поиск пользователя по email
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Удаление пользователя
    async deleteUser(id) {
        try {
            await User.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Обновление пользователя
    async updateUser(id, data) {
        try {
            await User.findByIdAndUpdate(id, data);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }
}

export const userServices = new UserServices();
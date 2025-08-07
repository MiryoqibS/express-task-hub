import Task from "../models/Task.js";

class TaskServices {
    async createTask(data) {
        try {
            return await Task.create(data);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    async findTask(id) {
        try {
            return await Task.findById(id);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    async deleteTask(id) {
        try {
            return await Task.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    async updateTask(id, data) {
        try {
            await Task.findByIdAndUpdate(id, data);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    async findTasks(userId) {
        try {
            return await Task.find({ userId });
        } catch (error) {
            console.log(error);
            throw error;
        };
    }
};

export const taskServices = new TaskServices();
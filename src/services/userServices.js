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

    // Отправить запрос в друзья
    async sendFriendsRequest(receiverId, senderId) {
        try {
            if (receiverId.toString() === senderId.toString()) {
                throw new Error("Нельзя добавить себя в друзья")
            };

            const [receiver, sender] = await Promise.all([
                User.findById(receiverId),
                User.findById(senderId),
            ]);

            if (!receiver) throw new Error("Пользователь не был найден");

            const alreadyRequested =
                receiver.friendRequest.includes(senderId) ||
                receiver.friends.includes(senderId);

            if (alreadyRequested) {
                throw new Error("Запрос уже отправлен или вы уже в друзях");
            };

            receiver.friendRequest.push(senderId);
            sender.sendRequests.push(receiverId);

            await Promise.all([
                receiver.save(),
                sender.save(),
            ]);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Принят запрос в друзья
    async acceptFriendRequest(currentUserId, requesterId) {
        try {
            const [currentUser, requester] = await Promise.all([
                User.findById(currentUserId),
                User.findById(requesterId),
            ]);

            if (!currentUser || !requester) {
                throw new Error("Один из пользователей не был найден");
            };

            if (!currentUser.friendRequest.includes(requesterId)) {
                throw new Error("Нет такой заявки");
            };

            currentUser.friends.push(requesterId);
            requester.friends.push(currentUserId);

            currentUser.friendRequest = currentUser.friendRequest.filter(id => {
                return id.toString() !== requesterId.toString();
            });

            requester.sendRequests = requester.sendRequests.filter(id => {
                return id.toString() !== currentUserId.toString();
            });

            await Promise.all([
                currentUser.save(),
                requester.save(),
            ]);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Отклонение запроса в друзья
    async rejectFriendRequest(currentUserId, requesterId) {
        try {
            const [currentUser, requester] = await Promise.all([
                User.findById(currentUserId),
                User.findById(requesterId),
            ]);

            if (!currentUser || !requester) {
                throw new Error("Один из пользователей не был найден");
            };

            currentUser.friendRequest = currentUser.friendRequest.filter(id => {
                return id.toString() !== requesterId.toString();
            });

            requester.sendRequests = requester.sendRequests.filter(id => {
                return id.toString() !== currentUserId.toString();
            });

            await Promise.all([
                currentUser.save(),
                requester.save(),
            ]);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Получение списка друзей пользователя
    async getFriends(userId) {
        try {
            const user = await User.findById(userId).populate("friends", "-password");
            return user.friends;
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Получение входящих запросов
    async getRequests(userId) {
        try {
            const user = await User.findById(userId).populate("friendRequest");
            return user.friendRequest;
        } catch (error) {
            console.log(error);
            throw error;
        };
    }

    // Удаление друга из списка
    async removeFriend(userId, friendId) {
        try {
            const [user, friend] = await Promise.all([
                User.findById(userId),
                User.findById(friendId),
            ]);

            if (!user || !friend) {
                throw new Error("Один из пользователей не был найден");
            };

            user.friends = user.friends.filter(id => id.toString() !== friendId.toString());
            friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

            await Promise.all([
                user.save(),
                friend.save(),
            ]);
        } catch (error) {
            console.log(error);
            throw error;
        };
    }
}

export const userServices = new UserServices();
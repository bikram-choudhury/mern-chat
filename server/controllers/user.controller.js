const USER = require('../schema/users');
const Utils = require('../utils');

module.exports = {
    getUsers: function (query) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const users = USER.find(query, { name: 1, meetingId: 1 });
                    resolve(users);
                } catch (error) {
                    reject(error);
                }
            })();
        })
    },
    removeUserFromMetting: function (meetingId, participantId) {
        return new Promise((resolve, reject) => {
            USER.findOneAndRemove({ meetingId, _id: ObjectId(participantId) }, (err, removedUser) => {
                if (err) reject(err);
                resolve(removedUser);
            });
        });
    },
    createUser: function (data) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const user = new USER({
                        name: data.name,
                        meetingId: data.meetingId,
                        currentStatus: data.currentStatus
                    });
                    const userObj = await user.save();
                    resolve(userObj.toObject());
                } catch (error) {
                    reject(error);
                }
            })();
        })
    },
    getLoggedInTokens: function (user) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const accessToken = Utils.Auth.createToken(user);
                    resolve({
                        accessToken,
                        tokenType: Utils.Auth.tokenType,
                        refreshToken: ''
                    });
                } catch (error) {
                    reject(error);
                }
            })();
        })
    }
};
const USER = require('../schema/users');

module.exports = {
    removeUserFromMetting: function (meetingId, participantId) {
        return new Promise((resolve, reject) => {
            USER.findOneAndRemove({ meetingId, _id: ObjectId(participantId) }, (err, removedUser) => {
                if (err) reject(err);
                resolve(removedUser);
            });
        });
    }
};
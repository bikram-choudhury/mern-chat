const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const Meeting = require('../schema/meeting');

module.exports = {
    getMeetingDetailsById: function (meetingId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const meeting = await Meeting.findById(ObjectId(meetingId), { name: 1, hostId: 1 });
                    resolve(meeting);
                } catch (error) {
                    reject(error);
                }
            })();
        })
    },
    createMeeting: function (data) {
        return new Promise((resolve, reject) => {
            (async () => {
                const detailsToSave = {};
                if (data.meetingName) {
                    detailsToSave['name'] = data.meetingName;
                }

                const meeting = new Meeting(detailsToSave);
                try {
                    const meetingObj = await meeting.save();
                    resolve(meetingObj.toObject())
                } catch (error) {
                    reject(error);
                }
            })();
        })
    },
    updateMeeting: function (data, meetingId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const updatedDoc = Meeting.findByIdAndUpdate(ObjectId(meetingId), data, { new: true });
                    resolve((await updatedDoc).toObject());
                } catch (error) {
                    reject(error);
                }
            })();
        })
    },
    removeMeeting: function (meetingId) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const removedDoc = await Meeting.findByIdAndRemove(ObjectId(meetingId));
                    resolve(removedDoc);
                } catch (error) {
                    reject(error);
                }
            })();
        })
    }
};
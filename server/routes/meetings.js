const express = require('express');
const router = express.Router();
const parallel = require('async/parallel');
const meetingController = require('../controllers/meeting.controller');
const userController = require('../controllers/user.controller');
const settings = require('../../client/src/settings');
const { START } = settings;

const createPersonalRoom = async (request, response, next) => {
    const details = request.body;
    try {
        const meeting = await meetingController.createMeeting(details);
        request.meetingId = meeting._id.toString();
        next();
    } catch (errorAtMeetingCreation) {
        response.status(500).send(errorAtMeetingCreation);
    }
};

const createUser = async (request, response, next) => {
    const body = request.body;
    const meetingId = request.meetingId;
    const detailsToSave = {
        name: body.userName,
        currentStatus: body.currentStatus,
        meetingId
    };
    try {
        const newUser = await userController.createUser(detailsToSave);
        request.participant = newUser;
        next();
    } catch (error) {
        response.status(500).send(error);
    }
};

const updateMeetingWithHostId = async (request, response, next) => {
    const meetingId = request.meetingId;
    const hostId = request.participant._id.toString();
    try {
        await meetingController.updateMeeting({ hostId }, meetingId);
        next();
    } catch (error) {
        response.status(500).send(error);
    }
}

const sendMeetingInfoWithToken = (request, response) => {
    const meetingId = request.meetingId;
    const participant = request.participant;
    parallel([
        (callback) => {
            (async () => {
                try {
                    const tokens = await userController.getLoggedInTokens(participant);
                    callback(null, tokens);
                } catch (error) {
                    callback(error);
                }
            })();
        },
        (callback) => {
            (async () => {
                try {
                    const meetingInfo = await meetingController.getMeetingDetailsById(meetingId);
                    callback(null, meetingInfo);
                } catch (error) {
                    callback(error);
                }
            })();
        },
        (callback) => {
            (async () => {
                try {
                    const participants = await userController.getUsers({ meetingId });
                    callback(null, participants);
                } catch (error) {
                    callback(error);
                }
            })();
        }
    ], (error, results) => {
        if (error) {
            response.status(500).send(error);
        } else {
            const [tokens, meetingInfo, participants] = results;
            response.json({
                tokens, meetingInfo, participants
            });
        }
    })
}

router.post(
    `/${START}`,
    createPersonalRoom,
    createUser,
    updateMeetingWithHostId,
    sendMeetingInfoWithToken
);

module.exports = router;
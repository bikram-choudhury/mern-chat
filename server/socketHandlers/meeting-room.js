const utils = require('../utils');

const meetings = new Map();

const setMeetingName = (name) => {
    const meetingId = utils.generateRandomString();
    if (meetings.has(meetingId))
        return { error: `A meeting with ${meetingId} has already been started.` };
    meetings.set(meetingId, name);
    return { meetingId };
};

const getMeetingName = (id) => {
    return meetings.get(id);
};

module.exports = { setMeetingName, getMeetingName };
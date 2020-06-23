
const participants = [];

const addParticipant = (participant) => {
    const { name, meetingId } = participant;
    const isParticipantExist = participants.find(
        user => user.name.toLowerCase() === name.toLowerCase() && user.meetingId === meetingId
    );
    if (isParticipantExist) return { error: `${name} already logged in.` };

    participants.push(participant);
    const allParticipants = getAllParticipant(meetingId);
    return { participants: allParticipants };
};

const removeParticipant = (id) => {
    const index = participants.findIndex(user => user.id === id);
    if (index === -1) return { error: 'participant doesn\'t exist' };

    return participants.splice(index, 1)[0];
};

const getAllParticipant = (meetingId) => {
    return participants.filter(user => user.meetingId === meetingId);
};

module.exports = { addParticipant, removeParticipant, getAllParticipant };
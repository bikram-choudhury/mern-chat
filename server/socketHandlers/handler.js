const participantManager = require('./participants');
const participants = require('./participants');

function Handlers(clientSocket) {
    const socket = clientSocket;

    function endMeetingForAll(sio, participant) {
        const allParticipants = participantManager.getAllParticipant(participant.meetingId);
        if (allParticipants.length) {
            allParticipants.forEach(user => {
                const client = sio.of('/').in(user.meetingId).connected[user.id];
                client.leave(user.meetingId);
                client.disconnect(true);
            });
        }
    }
    function sendMessageToAll(participant) {
        socket.broadcast.to(participant.meetingId).emit('message', {
            participantId: socket.id,
            message: {
                id: Math.random().toString(),
                msg: `${participant.name} has left`,
                recipientId: participant.meetingId,
                msgType: 'notification'
            }
        });
        socket.leave(participant.meetingId);
        socket.disconnect(true);
    }
    function createMsgToSend(msgToSend) {
        const msgId = Math.random().toString();
        const message = {
            ...msgToSend,
            id: msgId,
            msgType: 'replies'
        };
        delete message.meetingId;
        return message;
    }
    const sendMessage = (msgToSend, callback) => {
        const message = createMsgToSend(msgToSend);
        socket.to(msgToSend.recipientId).emit('message', { message });
        
        callback(null, { msgId: message.id });
    };
    const disconnect = (sio) => {
        console.log('client disconnect...', socket.id);
        const participant = participantManager.removeParticipant(socket.id);

        if (participant) {
            if (participant.host) {
                endMeetingForAll(sio, participant);
            } else {
                sendMessageToAll(participant);
            }
        }
    };

    return { disconnect, sendMessage };
};
module.exports = Handlers;
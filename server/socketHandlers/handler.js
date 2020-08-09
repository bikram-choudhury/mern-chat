const path = require('path');
const fs = require('fs');
const { v4: uuidV4 } = require('uuid');

const participantManager = require('./participants');

function Handlers(clientSocket) {
    const socket = clientSocket;

    function removeMeetingContent(meetingId) {
        const targetFolder = path.join(__dirname, '../uploads', meetingId);
        fs.rmdirSync(targetFolder, { recursive: true });
    }
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
                removeMeetingContent(participant.meetingId);
                endMeetingForAll(sio, participant);
            } else {
                sendMessageToAll(participant);
            }
        }
    };
    const startVideoCall = (invitation, callback) => {
        const videoCID = uuidV4();
        invitation.msg += `/${videoCID}`;

        const message = createMsgToSend(invitation);
        socket.to(invitation.recipientId).emit('message', { message });

        callback(null, { videoCID });
    }

    return { disconnect, sendMessage, startVideoCall };
};
module.exports = Handlers;
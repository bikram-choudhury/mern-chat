const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 5000;

const app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uploadsFolderPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath);
}
app.use(express.static(uploadsFolderPath));
app.use(express.static(path.join(__dirname, 'client-bundle', 'build')));

const api = require('./routes/api');
app.use('/api', api);

app.get('/*', (req, res) => {
    const filePath = path.join(__dirname, 'client-bundle', 'build', 'index.html');
    res.sendFile(filePath);
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    const env = req.app.get('env');
    const response = {
        message: err.message,
        err: env === 'development' ? err : {},
    };
    res.status(err.status || 500).send(response);
});

const server = http.createServer(app);
const sio = socketIo(server, { path: '/chat' });
const participantManager = require('./socketHandlers/participants');
const meetingRoom = require('./socketHandlers/meeting-room');
const Handlers = require('./socketHandlers/handler');

sio.on('connection', socket => {
    console.log('client connected...', socket.id);
    const handler = Handlers(socket);

    socket.on('start-meeting', (userData, callback) => {
        const date = new Date();
        const meetingName = userData.meetingName || `Anonymous-${date.getTime()}`;
        const { meetingId, error } = meetingRoom.setMeetingName(meetingName);
        if (!error) {
            const participant = {
                id: socket.id,
                status: userData.currentStatus,
                host: userData.isHost,
                name: userData.userName,
                meetingId
            };
            const { participants, error } = participantManager.addParticipant(participant);
            if (error) callback(error);

            socket.join(meetingId);
            callback(null, [{ name: meetingName, id: meetingId, type: 'meeting' }, ...participants]);
        } else {
            callback(error);
        }
    });

    socket.on('join-meeting', (userData, callback) => {
        const participant = {
            id: socket.id,
            status: userData.currentStatus,
            name: userData.name,
            meetingId: userData.meetingId
        };
        const meetingName = meetingRoom.getMeetingName(participant.meetingId);

        const { participants, error } = participantManager.addParticipant(participant);
        if (error) callback(error);

        socket.broadcast.to(participant.meetingId).emit('message', {
            message: {
                id: Math.random().toString(),
                msg: `${participant.name} has joined`,
                recipientId: participant.meetingId,
                msgType: 'notification'
            },
            participant
        });
        socket.join(participant.meetingId);

        callback(null, [{ name: meetingName, id: participant.meetingId, type: 'meeting' }, ...participants]);
    });

    socket.on('send-message', handler.sendMessage);

    socket.on('disconnect', handler.disconnect.bind(null, sio));
});


server.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})

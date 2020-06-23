const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

const settings = require('../client/src/settings');
const PORT = process.env.port || settings.PORT;

const mongoose = require('mongoose');
mongoose.connect(settings.MONGODB_URL, err => {
    if (err) throw new Error(err);
    console.log("Connected successfully");
});


const API = require('./routes/api');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', API);

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
const sio = socketIo(server);
const participantManager = require('./socketHandlers/participants');
const meetingRoom = require('./socketHandlers/meeting-room');

sio.on('connection', socket => {
    console.log('client connected...', socket.id);

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
            id: Math.random().toString(),
            msg: `${participant.name} has joined`,
            recipientId: participant.meetingId,
            msgType: 'notification'
        });
        socket.join(participant.meetingId);

        callback(null, [{ name: meetingName, id: participant.meetingId, type: 'meeting' }, ...participants]);
    });

    socket.on('disconnect', () => {
        console.log('client disconnect...', socket.id);
    });
});


server.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})

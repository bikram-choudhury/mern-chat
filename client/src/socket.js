import { connect } from 'socket.io-client';

const ClientSocket = {
    socket: null,
    socketId: null,
    _connect: function () {
        this.socket = connect('http://localhost:5000');
        this.socket.on('connect', () => {
            this.socketId = this.socket.id;
        });
    },
    _startMeetingRoom: function (userData, callback) {
        this.socket.emit('start-meeting', userData, callback);
    },
    _joinMeetingRoom: function (userData, callback) {
        this.socket.emit('join-meeting', userData, callback);
    },
    _onMsgReceived: function (onMsgReceived) {
        this.socket.on('message', onMsgReceived);
    },
    _offMsgReceived: function () {
        this.socket.off('message');
    },
    _disconnect: function () {
        this.socket.emit('disconnect');
        this.socket.off();
    }
}


/* this.socket.on('error', function (error) {
    console.log('received socket error:', error);
}); */

export default ClientSocket;
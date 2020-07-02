import { connect } from 'socket.io-client';
// const SOCKET_URL = 'https://usein.herokuapp.com';
const SOCKET_URL = window.location.origin;

const ClientSocket = {
    socket: null,
    socketId: null,
    _connect: function () {
        this.socket = connect(SOCKET_URL, {
            reconnection: true
        });
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
    _sendMessage: function (msgToSend, callback) {
        this.socket.emit('send-message', msgToSend, callback);
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
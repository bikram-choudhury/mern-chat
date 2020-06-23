import { connect } from 'socket.io-client';

function ClientSocket() {
    this.socket = null;

    this._onMsgReceived = (onMsgReceived) => {
        this.socket.on('message', onMsgReceived);
    };

    this._offMsgReceived = () => {
        this.socket.off('message');
    };

    this._joinMeetingRoom = (userData, callback) => {
        this.socket.emit('join-meeting', userData, callback);
    };

    this._startMeetingRoom = (userData, callback) => {
        this.socket.emit('start-meeting', userData, callback);
    }
    this._disconnect = () => {
        this.socket.emit('disconnect');
        this.socket.off();
    };

    /* this.socket.on('error', function (error) {
        console.log('received socket error:', error);
    }); */
};

ClientSocket.prototype._connect = function () {
    this.socket = connect('http://localhost:5000');
};

export default ClientSocket;
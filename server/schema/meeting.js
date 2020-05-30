const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    name: {
        type: String,
        required: false,
        default: 'Everyone'
    },
    hostId: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('meeting', meetingSchema);
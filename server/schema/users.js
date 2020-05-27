const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    meetingId: String
}, { timestamps: true });

module.exports = mongoose.model('participants', userSchema);
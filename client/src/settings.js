
const SERVER_PORT = 5000;
module.exports = {
    PORT: SERVER_PORT,
    SERVER_URL: `/api`,

    // DB Connection URL
    MONGODB_URL: 'mongodb+srv://admin:admin@cluster0-4ptib.mongodb.net/MernChat?retryWrites=true&w=majority',
    // API Modules
    PARTICIPANT: 'participant',
    MEETING: 'meeting',

    // API URL Segments
    SAVE: 'save',
    START: 'start'
};
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
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
server.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})

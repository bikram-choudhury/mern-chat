const express = require('express');
const router = express.Router();
const settings = require('../../client/src/settings');
const usersRouter = require('./users');

const { PARTICIPANT } = settings;
router.use(`/${PARTICIPANT}`, usersRouter);

module.exports = router;
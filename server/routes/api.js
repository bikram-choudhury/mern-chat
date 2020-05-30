const express = require('express');
const router = express.Router();
const settings = require('../../client/src/settings');
const usersRouter = require('./users');
const meetingsRouter = require('./meetings');

const { PARTICIPANT, MEETING } = settings;
router.use(`/${PARTICIPANT}`, usersRouter);
router.use(`/${MEETING}`, meetingsRouter);

module.exports = router;
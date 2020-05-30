const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const USER = require('../schema/users');
const Utils = require('../utils');
const controller = require('../controllers/user.controller');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

async function getUserInfoAfterTokenValidation(request, response, next) {
  const authToken = request.header('Authorization-token');
  if (authToken) {
    const payload = Utils.Auth.verifyToken(authToken);
    request.user = payload;
    next();
  } else {
    response.status(400).send("Invalid request. token is not available");
  }
}

router.delete('/', getUserInfoAfterTokenValidation, removeParticipant);

async function removeParticipant(request, response) {
  const participantId = request.user._id;
  const meetingId = request.user.meetingId;
  if (participantId) {
    controller.removeUserFromMetting(meetingId, participantId)
      .then(removedDocument => response.json({ removedParticipant: removedDocument }))
      .catch(error => response.status(500).send(error));
  } else {
    response.status(400).send("Invalid request. participant id is not available");
  }
}

router.post('/save', saveParticipant, prepareAndSendUserJoingResponse);

async function saveParticipant(request, response, next) {
  const body = request.body;
  const meetingId = body.meetingId;

  if (meetingId) {
    try {
      const newUser = await controller.createUser(body);
      request.participant = newUser;
      next();
    } catch (error) {
      response.status(500).json({ error });
    }
  } else {
    response.status(400).send("Invalid request. Metting id is not available");
  }
}

async function prepareAndSendUserJoingResponse(request, response) {
  try {
    const user = request.participant;
    const tokens = await controller.getLoggedInTokens(user);
    const allParticipants = await USER.find({ meetingId: user.meetingId });
    response.json({
      tokens,
      participants: allParticipants
    });
  } catch (error) {
    response.status(500).json({ error });
  }
}

module.exports = router;

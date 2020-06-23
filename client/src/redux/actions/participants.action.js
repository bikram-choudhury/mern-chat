import { ADD_PARTICIPANT, SET_PARTICIPANT_ACTIVE, REPLACE_PARTICIPANTS } from "../action.constant";

export const addParticipant = (user) => {
    return {
        type: ADD_PARTICIPANT,
        payload: user
    }
};

export const replaceParticipants = (users) => {
    return {
        type: REPLACE_PARTICIPANTS,
        payload: users
    }
};

export const setParticipantAsActive = (participantId) => {
    return {
        type: SET_PARTICIPANT_ACTIVE,
        payload: { participantId }
    }
};
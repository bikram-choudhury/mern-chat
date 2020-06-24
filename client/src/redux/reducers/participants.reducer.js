import {
    ADD_PARTICIPANT,
    SET_PARTICIPANT_ACTIVE,
    REPLACE_PARTICIPANTS,
    REMOVE_PARTICIPANT
} from "../action.constant";

const initialState = {
    list: [],
    error: null
}

export const participantsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ADD_PARTICIPANT:
            return {
                list: [...state.list, ...payload], error: null
            };
        case REPLACE_PARTICIPANTS:
            return {
                list: [...payload], error: null
            };
        case REMOVE_PARTICIPANT:
            const activeParticipants = state.list.filter(user => user.id !== payload.participantId);
            return {
                list: [...activeParticipants], error: null
            };
        case SET_PARTICIPANT_ACTIVE:
            const participants = state.list.map(user => {
                if (user.id === payload.participantId) {
                    user.isActive = true;
                } else {
                    user.isActive = false;
                }
                return user;
            });

            return {
                list: [...participants], error: null
            };
        default: return state;
    }
};

export const getParticipants = (state) => state && state.list;
export const getActiveParticipant = (state) => state && state.list.find(user => user.isActive);
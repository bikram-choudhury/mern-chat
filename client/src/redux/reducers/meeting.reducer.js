import { SAVE_MEETING_DETAILS } from "../action.constant";

const initialState = {
    _id: '', name: '', hostId: '',
};

export const meetingReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SAVE_MEETING_DETAILS:
            return { ...payload };
        default: return state;
    }
};

export const getHostId = (state) => state.hostId;
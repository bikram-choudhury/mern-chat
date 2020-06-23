import { SAVE_MEETING_DETAILS } from "../action.constant";

const initialState = {
    id: '', name: ''
};

export const meetingReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SAVE_MEETING_DETAILS:
            return { ...payload };
        default: return state;
    }
};
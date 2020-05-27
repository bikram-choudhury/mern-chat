import { SAVE_MESSAGE } from "../action.constant";

const initialState = {
    list: [],
    error: null
};

export const messageReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SAVE_MESSAGE:
            return {
                list: [...state.list, ...payload],
                error: null
            };
        default:
            return state;
    }
};

export const getMessages = (state) => state && state.list;
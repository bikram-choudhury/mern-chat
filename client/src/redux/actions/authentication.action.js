import { SET_TOKEN, LOGOUT } from "../action.constant";

export const setTokens = (tokens) => {
    return {
        type: SET_TOKEN,
        payload: { ...tokens }
    }
};

export const logoutUser = () => ({ type: LOGOUT });
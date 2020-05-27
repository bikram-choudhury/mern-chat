import { createSelector } from 'reselect';
import { SET_TOKEN } from "../action.constant";

const initialState = {
    accessToken: '',
    refreshToken: '',
    tokenType: ''
}

export const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_TOKEN:
            return { ...state, ...payload };
        default: return state;
    }
};

export const getAccessToken = state => state && state.accessToken;

export const getLoggedInUser = createSelector(
    getAccessToken,
    accessToken => decodeToken(accessToken)
)

function decodeToken(accessToken) {
    if (accessToken) {
        const encodedBase64Url = accessToken.split('.')[1];
        const base64 = encodedBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedTokenPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(decodedTokenPayload);
    } else {
        // return null;
        return { // Mock data
            _id: '002',
            name: 'Mike Ross',
            img: 'http://emilcarlsson.se/assets/mikeross.png',
            currentStatus: 'online'
        }
    }
}

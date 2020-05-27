import Axios from 'axios';
import { ADD_PARTICIPANT, SET_PARTICIPANT_ACTIVE } from "../action.constant"
import { SERVER_URL, PARTICIPANT, SAVE } from '../../settings';
import { setTokens, logoutUser } from './authentication.action';

export const addParticipant = (user) => {
    return {
        type: ADD_PARTICIPANT,
        payload: user
    }
};

export const setParticipantAsActive = (participantId) => {
    return {
        type: SET_PARTICIPANT_ACTIVE,
        payload: { participantId }
    }
};

export const saveParticipant = (user, { history }) => {
    return (dispatch, getState) => {
        const url = `${SERVER_URL}/${PARTICIPANT}/${SAVE}`;
        Axios.post(url, user)
            .then(response => {
                const { data: { tokens, participants } } = response;
                const authToken = {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    tokenType: tokens.tokenType,
                };
                dispatch(setTokens(authToken));
                dispatch(addParticipant([...participants]));
                history.push('/chat');
            }).catch(error => {
                console.error(error);
            })
    }
};

export const removeParticipant = ({ history }) => {
    return (dispatch) => {
        const url = `${SERVER_URL}/${PARTICIPANT}`;
        Axios.delete(url)
            .then(() => {
                dispatch(logoutUser());
                history.push('/join');
            }).catch(error => {
                console.error(error);
            })
    }
}
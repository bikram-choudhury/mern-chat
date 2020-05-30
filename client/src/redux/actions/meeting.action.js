import { SAVE_MEETING_DETAILS } from "../action.constant";
import { SERVER_URL, MEETING, START } from '../../settings';
import Axios from 'axios';
import { addParticipant } from "./participants.action";
import { setTokens } from "./authentication.action";

export const saveMeetingDetails = (details) => ({
    type: SAVE_MEETING_DETAILS,
    payload: details
});

export const startMeeting = (meetingDetails, { history }) => {
    return (dispatch) => {
        const url = `${SERVER_URL}/${MEETING}/${START}`;
        Axios.post(url, meetingDetails)
            .then(response => {
                const { data: { meetingInfo, participants, tokens } } = response;
                const authToken = {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    tokenType: tokens.tokenType,
                };
                dispatch(setTokens(authToken));
                dispatch(addParticipant([...participants]));
                dispatch(saveMeetingDetails(meetingInfo));
                history.push('/chat');
            })
            .catch(error => console.error(error))
    }
}
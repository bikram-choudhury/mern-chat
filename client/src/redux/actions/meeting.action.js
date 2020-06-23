import { SAVE_MEETING_DETAILS } from "../action.constant";

export const saveMeetingDetails = (details) => ({
    type: SAVE_MEETING_DETAILS,
    payload: details
});
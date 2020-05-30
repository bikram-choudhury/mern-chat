import { combineReducers } from "redux";
import { createSelector } from 'reselect';
import { LOGOUT } from "../action.constant"
import * as msg from './message.reducer';
import * as participants from './participants.reducer';
import * as auth from './authentication.reducer';
import * as meeting from './meeting.reducer';

const appReducer = combineReducers({
    messages: msg.messageReducer,
    participants: participants.participantsReducer,
    authentication: auth.authReducer,
    meeting: meeting.meetingReducer
})

export const reducers = (state, action) => {
    if (action.type === LOGOUT) return {};
    return appReducer(state, action)
};

export const getMeetingDetails = state => state.meeting;

export const getAccessToken = state => auth.getAccessToken(state.authentication);
export const getLoggedInUser = state => auth.getLoggedInUser(state.authentication);

export const getMessages = state => msg.getMessages(state.messages);
export const getParticipants = state => participants.getParticipants(state.participants);
export const getActiveParticipant = state => participants.getActiveParticipant(state.participants);

export const getActiveParticipantMessage = createSelector(
    getMessages,
    getParticipants,
    getActiveParticipant,
    getLoggedInUser,
    (messages, participacts, activeParticipant, loggedInUser) => {
        const participantMsgs = [];
        for (const message of messages) {
            if (
                (message.senderId === activeParticipant._id && message.recipientId === loggedInUser._id) ||
                (message.senderId === loggedInUser._id && message.recipientId === activeParticipant._id)
            ) {
                const senderInfo = participacts.find(user => user._id === message.senderId);
                const recipientInfo = participacts.find(user => user._id === message.recipientId);
                const newMsgObj = {
                    msgId: message._id,
                    sender: senderInfo || loggedInUser,
                    recipient: recipientInfo || loggedInUser,
                    msgType: message.msgType,
                    msg: message.msg
                };
                participantMsgs.push(newMsgObj);
            }
        }
        return participantMsgs;
    }
);

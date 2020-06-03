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
export const getHostId = state => meeting.getHostId(state.meeting);

export const getAccessToken = state => auth.getAccessToken(state.authentication);
export const getLoggedInUser = state => auth.getLoggedInUser(state.authentication);

export const getMessages = state => msg.getMessages(state.messages);
export const getParticipants = state => participants.getParticipants(state.participants);
export const getActiveParticipant = state => participants.getActiveParticipant(state.participants);

export const getParticipantsWithLastMsg = createSelector(
    getParticipants,
    getMessages,
    getLoggedInUser,
    (participants, messages, loggedInUser) => {
        const participantsWithLastMsg = participants.map(participant => {
            let lastChat;
            for (let i = (messages.length - 1); i >= 0; i--) {
                if (
                    (messages[i].senderId === loggedInUser._id && messages[i].recipientId === participant._id) ||
                    (messages[i].senderId === participant._id && messages[i].recipientId === loggedInUser._id)
                ) {
                    lastChat = messages[i];
                    break;
                }
            }

            return lastChat ? {
                ...participant,
                lastMsgBy: lastChat.msgType === 'sent' ? loggedInUser._id : participant._id,
                recentMsg: lastChat.msg
            } : participant;
        })
        return participantsWithLastMsg;
    }
)

export const getActiveParticipantMessage = createSelector(
    getMessages,
    getParticipants,
    getActiveParticipant,
    getLoggedInUser,
    (messages, participacts, activeParticipant, loggedInUser) => {
        const participantMsgs = [];
        if (!activeParticipant) {
            for (const message of messages) {
                if (
                    (message.senderId === activeParticipant._id && message.recipientId === loggedInUser._id) ||
                    (message.senderId === loggedInUser._id && message.recipientId === activeParticipant._id)
                ) {
                    const senderInfo = participacts.find(user => user._id === message.senderId);
                    const recipientInfo = participacts.find(user => user._id === message.recipientId);
                    const newMsgObj = {
                        msgId: message._id,
                        sender: {
                            _id: senderInfo._id,
                            name: senderInfo.name
                        } || loggedInUser,
                        recipient: {
                            _id: recipientInfo._id,
                            name: recipientInfo.name
                        } || loggedInUser,
                        msgType: message.msgType,
                        msg: message.msg
                    };
                    participantMsgs.push(newMsgObj);
                }
            }
        }
        return participantMsgs;
    }
);

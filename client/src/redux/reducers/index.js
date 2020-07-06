import { combineReducers } from "redux";
import { createSelector } from 'reselect';
import { LOGOUT } from "../action.constant"
import * as msg from './message.reducer';
import * as participants from './participants.reducer';
import * as meeting from './meeting.reducer';

const appReducer = combineReducers({
    messages: msg.messageReducer,
    participants: participants.participantsReducer,
    meeting: meeting.meetingReducer
})

export const reducers = (state, action) => {
    if (action.type === LOGOUT) return {};
    return appReducer(state, action)
};

export const getMeetingDetails = state => state.meeting;

export const getMessages = state => msg.getMessages(state.messages);
export const getParticipants = state => participants.getParticipants(state.participants);
export const getActiveParticipant = state => participants.getActiveParticipant(state.participants);

export const getCurrentUser = userId => createSelector(
    getParticipants,
    (participants) => {
        return participants.find(user => user.id === userId)
    }
)
export const getParticipantsWithLastMsg = currentUserId => createSelector(
    getParticipants,
    getMessages,
    (participants, messages) => {
        const participantsWithLastMsg = participants.map(participant => {
            let lastChat;
            for (let i = (messages.length - 1); i >= 0; i--) {
                if (
                    (messages[i].senderId === currentUserId && messages[i].recipientId === participant._id) ||
                    (messages[i].senderId === participant._id && messages[i].recipientId === currentUserId)
                ) {
                    lastChat = messages[i];
                    break;
                }
            }

            return lastChat ? {
                ...participant,
                lastMsgBy: lastChat.msgType === 'sent' ? currentUserId : participant._id,
                recentMsg: lastChat.msg
            } : participant;
        })
        return participantsWithLastMsg;
    }
);

export const getActiveParticipantMessage = createSelector(
    getMessages,
    getActiveParticipant,
    (allMessages, activeParticipant) => {
        const participantMsgs = [];

        if (activeParticipant) {
            const allMsgWithActiveParticipant = allMessages.filter(
                message => (
                    message.senderId === activeParticipant.id ||
                    message.recipientId === activeParticipant.id
                )
            );
            participantMsgs.push(...allMsgWithActiveParticipant);
        }

        return participantMsgs;
    }
);

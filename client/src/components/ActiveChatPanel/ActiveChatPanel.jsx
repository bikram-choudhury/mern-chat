import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getActiveParticipant } from '../../redux/reducers';
import { saveMessage } from '../../redux/actions/message.actions';
import { addParticipant, removeParticipant } from '../../redux/actions/participants.action';
import { createParticipantObjFromResponse } from '../../Utils/Utils';

import client from '../../socket';

import ContactProfile from '../ContactProfile/ContactProfile';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import ResizableTextarea from '../Textarea/ResizableTextarea';
import FileUploader from '../FileUploader/FileUploader';
import MessageList from '../MessageList/MessageList';
import './ActiveChatPanel.scss';

const ActiveChatPanel = props => {
    const {
        activeParticipant,
        addParticipant,
        removeParticipant,
        saveMessage,
        meetingId,
        loggedInUser
    } = props;

    const [messageInput, updateMessageInput] = useState('');
    const currentUserId = client.socketId;

    useEffect(() => {
        client._onMsgReceived(
            ({ message, participant, participantId }) => {
                saveMessage([message]);
                if (participant) {
                    addParticipant(
                        createParticipantObjFromResponse([participant])
                    );
                } else if (participantId) {
                    removeParticipant(participantId);
                }
            }
        );
        return () => {
            client._offMsgReceived();
            client._disconnect();
        }
    }, [saveMessage, addParticipant, removeParticipant]);

    const handleSendMsg = () => {
        const msgToSend = {
            msg: messageInput,
            senderId: currentUserId,
            recipientId: activeParticipant.id,
            meetingId
        };
        client._sendMessage(msgToSend, (error, { msgId }) => {
            handleSendMessageCallback(msgToSend, error, msgId);
        });
    };

    const handleFileOnLoad = fileInfo => {
        const msgToSend = {
            ...fileInfo,
            isFile: true,
            senderId: currentUserId,
            recipientId: activeParticipant.id,
            meetingId: meetingId,
        };
        client._sendMessage(msgToSend, (error, { msgId }) => {
            handleSendMessageCallback(msgToSend, error, msgId);
        });
    };
    const handleSendMessageCallback = (msgToSend, error, msgId) => {
        if (error) {
            console.log(error);
            return;
        }
        saveMessage([{
            ...msgToSend,
            msgType: 'sent',
            id: msgId
        }]);
        updateMessageInput('');
    };
    const handleStartVideoCall = () => {
        const { protocol, host } = window.location;
        const inviteUrl = `${protocol}//${host}/join/video`;

        const invitation = {
            msg: `${loggedInUser.name.toUpperCase()} is inviting you to join a Personal Meeting Room ${inviteUrl}`,
            senderId: currentUserId,
            recipientId: activeParticipant.id,
            meetingId
        };
        client._startVideoCall(invitation, (error, { videoCID }) => {
            const url = `${inviteUrl}/${videoCID}`;
            window.open(url, '_blank');
        })
    };

    return activeParticipant ? (
        <Fragment>
            <ContactProfile
                name={activeParticipant.name}
                currentStatus={activeParticipant.currentStatus}
                socialMedia={true}
                onStartVideoCall={handleStartVideoCall}
            />

            <MessageList />

            <div className="message-input">
                <div className="wrap">
                    <EmojiPicker
                        position="top left"
                        selected={emoji => updateMessageInput(messageInput + emoji)}
                    />
                    <ResizableTextarea
                        placeholder="Write your message..."
                        value={messageInput}
                        changed={updateMessageInput}
                    />
                    <FileUploader handleOnLoad={handleFileOnLoad} meetingId={meetingId} />
                    <button className="btn btn-primary" onClick={() => handleSendMsg()}>
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </Fragment>
    ) : null
};

const mapStateToProps = (state) => {
    return {
        activeParticipant: getActiveParticipant(state),
    }
};
const mapDispathToProps = { saveMessage, addParticipant, removeParticipant };

export default connect(mapStateToProps, mapDispathToProps)(ActiveChatPanel);
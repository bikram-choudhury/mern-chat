import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ContactProfile from '../../components/ContactProfile/ContactProfile';
import ContactWithLastChatMsg from '../../components/ContactWithLastChatMsg/ContactWithLastChatMsg';
import Message from '../../components/Message/Message';
import ProfileStatus from '../../components/ProfileStatus/ProfileStatus';
import { saveMessage } from '../../redux/actions/message.actions';
import { setParticipantAsActive } from '../../redux/actions/participants.action';
import {
    getActiveParticipant,
    getMeetingDetails,
    getParticipants
} from '../../redux/reducers';
import client from '../../socket';
import { copyToClipboard, getFirstTwoLetters } from '../../Utils/Utils';
import './Chat.scss';

const ChatLayout = props => {
    const {
        participants,
        activeParticipant,
        meeting,
        selectParticipant,
        sendMessage
    } = props;
    const [profileStatusVisibility, toggleProfileStatusVisibility] = useState(false);
    const [messageInput, updateMessageInput] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({});
    const [firstLettersForCurrentUser, setFirstLettersForCurrentUser] = useState('');
    const messages = [];

    useEffect(() => {
        const currentUser = participants.find(user => user.id === client.socketId);
        setLoggedInUser(currentUser);

        return () => {
            client._disconnect()
        }
    }, [participants]);

    useEffect(() => {
        setFirstLettersForCurrentUser(getFirstTwoLetters(loggedInUser.name));
    }, [loggedInUser])

    const { protocol, host } = window.location;
    const inviteUrl = `${protocol}//${host}/join?meetingId=${meeting.id}`;

    const handleSendMsg = () => {
        const msgToSend = {
            senderId: loggedInUser.id,
            recipientId: activeParticipant.id,
            msgType: 'sent',
            msg: messageInput,
            _id: Math.random().toString()
        };
        sendMessage([msgToSend]);
        updateMessageInput('');
    };
    const handleKeyUpForMsgInput = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            handleSendMsg();
        }
    };

    return Object.keys(loggedInUser).length ? (
        <div id="frame">
            <div id="sidepanel">
                <div id="profile">
                    <div className="profile-with-status">
                        <div className={`profile-img ${loggedInUser.currentStatus}`}
                            onClick={
                                () => toggleProfileStatusVisibility(!profileStatusVisibility)
                            }
                        >{firstLettersForCurrentUser}</div>
                        <ProfileStatus
                            isActive={profileStatusVisibility}
                            currentStatus={loggedInUser.currentStatus}
                        />
                    </div>
                    <p className="user-name">{loggedInUser.name}</p>
                </div>
                {
                    loggedInUser.host ? (
                        <div id="metting-invitation" onClick={() => copyToClipboard(inviteUrl)}>
                            <span>Copy metting invitation</span>
                            <i
                                className="fa fa-clipboard"
                                aria-hidden="true"
                            ></i>
                        </div>
                    ) : null
                }

                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search participants..." />
                </div>
                <div id="contacts">
                    <ul className="m-0 p-0">
                        {
                            participants.map(participant => {
                                return (
                                    <li className={
                                        `contact ${participant.isActive ? 'active' : ''} ${participant.id === loggedInUser.id ? 'disabled' : ''}`
                                    }
                                        key={participant.id}
                                        onClick={() => selectParticipant(participant.id)}
                                    >
                                        <ContactWithLastChatMsg
                                            {...participant}
                                            currentUserId={loggedInUser.id}
                                        />
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="content">
                {
                    activeParticipant ? (
                        <ContactProfile
                            name={activeParticipant.name}
                            currentStatus={activeParticipant.currentStatus}
                            socialMedia={true}
                        />
                    ) : null
                }

                <div className="messages">
                    <ul>
                        {
                            messages.map(message => {
                                return (
                                    <li className={message.msgType} key={message.msgId}>
                                        <Message {...message} />
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="message-input">
                    <div className="wrap">
                        <input
                            type="text"
                            placeholder="Write your message..."
                            value={messageInput}
                            onChange={({ target: { value } }) => updateMessageInput(value)}
                            onKeyUp={handleKeyUpForMsgInput}
                        />
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button className="button" onClick={() => handleSendMsg()}>
                            <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    ) : null;
};

ChatLayout.propTypes = {
    participants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            host: PropTypes.bool,
            lastMsgBy: PropTypes.string,
            recentMsg: PropTypes.string,
            currentStatus: PropTypes.string,
            isActive: PropTypes.bool
        })
    ),
    activeParticipant: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        currentStatus: PropTypes.string
    }),
    selectParticipant: PropTypes.func,
    sendMessage: PropTypes.func,
    meeting: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })
}

const mapStateToProps = state => {
    return {
        participants: getParticipants(state),
        activeParticipant: getActiveParticipant(state),
        meeting: getMeetingDetails(state)
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectParticipant: (participantId) => dispatch(setParticipantAsActive(participantId)),
        sendMessage: (msgToSend) => dispatch(saveMessage(msgToSend))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatLayout);
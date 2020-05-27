import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import ContactProfile from '../../components/ContactProfile/ContactProfile';
import ContactWithLastChatMsg from '../../components/ContactWithLastChatMsg/ContactWithLastChatMsg';
import Message from '../../components/Message/Message';
import ProfileStatus from '../../components/ProfileStatus/ProfileStatus';
import { saveMessage } from '../../redux/actions/message.actions';
import { setParticipantAsActive } from '../../redux/actions/participants.action';
import {
    getActiveParticipant,
    getActiveParticipantMessage,
    getLoggedInUser,
    getParticipants
} from '../../redux/reducers';
import './Chat.scss';

const ChatLayout = props => {
    const {
        loggedInUser,
        participants,
        activeParticipant,
        showMessages,
        messages,
        sendMessage
    } = props;
    const [profileStatusVisibility, toggleProfileStatusVisibility] = useState(false);
    const [messageInput, updateMessageInput] = useState('');

    const handleSendMsg = () => {
        const msgToSend = {
            senderId: loggedInUser._id,
            recipientId: activeParticipant._id,
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
    }

    return (
        <div id="frame">
            <div id="sidepanel">
                <div id="profile">
                    <div className="profile-with-status">
                        <img
                            id="profile-img"
                            src={loggedInUser.img}
                            className={loggedInUser.currentStatus}
                            alt={loggedInUser.name}
                            onClick={
                                () => toggleProfileStatusVisibility(!profileStatusVisibility)
                            }
                        />
                        <ProfileStatus
                            isActive={profileStatusVisibility}
                            currentStatus={loggedInUser.currentStatus}
                        />
                    </div>
                    <p className="user-name">{loggedInUser.name}</p>
                </div>
                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search participants..." />
                </div>
                <div id="contacts">
                    <ul className="m-0 p-0">
                        {
                            participants.map(participant => {
                                return (
                                    <li className={`contact ${participant.isActive ? 'active' : ''}`}
                                        key={participant._id}
                                        onClick={() => showMessages(participant._id)}
                                    >
                                        <ContactWithLastChatMsg {...participant} />
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
                            img={activeParticipant.img}
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
    );
};

ChatLayout.propTypes = {
    loggedInUser: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        img: PropTypes.string,
        currentStatus: PropTypes.string
    }),
    participants: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
            img: PropTypes.string,
            lastMsgBy: PropTypes.string,
            recentMsg: PropTypes.string,
            currentStatus: PropTypes.string,
            isActive: PropTypes.bool
        })
    ),
    activeParticipant: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        img: PropTypes.string,
        lastMsgBy: PropTypes.string,
        recentMsg: PropTypes.string,
        currentStatus: PropTypes.string,
        isActive: PropTypes.bool
    }),
    showMessages: PropTypes.func,
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            msgId: PropTypes.string,
            sender: PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string,
                img: PropTypes.string,
                lastMsgBy: PropTypes.string,
                recentMsg: PropTypes.string,
                currentStatus: PropTypes.string,
                isActive: PropTypes.bool
            }),
            recipient: PropTypes.shape({
                _id: PropTypes.string,
                name: PropTypes.string,
                img: PropTypes.string,
                lastMsgBy: PropTypes.string,
                recentMsg: PropTypes.string,
                currentStatus: PropTypes.string,
                isActive: PropTypes.bool
            }),
            msgType: PropTypes.string,
            msg: PropTypes.string
        })
    ),
    sendMessage: PropTypes.func
}

const mapStateToProps = state => {
    return {
        participants: getParticipants(state),
        loggedInUser: getLoggedInUser(state),
        activeParticipant: getActiveParticipant(state),
        messages: getActiveParticipantMessage(state)
    }
};

const mapDispatchToProps = dispatch => {
    return {
        showMessages: (participantId) => dispatch(setParticipantAsActive(participantId)),
        sendMessage: (msgToSend) => dispatch(saveMessage(msgToSend))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatLayout);
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getParticipants, getActiveParticipantMessage } from '../../redux/reducers';
import FileViewer from '../FileViewer/FileViewer';
import Message from '../Message/Message';
import './MessageList.scss';

const MessageList = props => {
    const { participants, messages } = props;

    return (
        <ul className="message-list">
            {
                messages.map(message => {
                    const sender = participants.find(user => user.id === message.senderId) || {};
                    return (
                        <li className={message.msgType} key={message.id}>
                            {
                                message.isFile ? (
                                    <FileViewer
                                        name={message.name}
                                        type={message.type}
                                        path={message.path}
                                        sender={sender}
                                    />
                                ) : (
                                        <Message msg={message.msg} sender={sender} />
                                    )
                            }

                        </li>
                    )
                })
            }
        </ul>
    );
};

MessageList.propTypes = {
    participants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            host: PropTypes.bool,
            lastMsgBy: PropTypes.string,
            recentMsg: PropTypes.string,
            currentStatus: PropTypes.string,
            isActive: PropTypes.bool
        })
    ),
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            msg: PropTypes.string.isRequired,
            meetingId: PropTypes.string,
            senderId: PropTypes.string,
            recipientId: PropTypes.string,
            isFile: PropTypes.bool,
            name: PropTypes.string,
            type: PropTypes.string,
            path: PropTypes.string
        })
    )
};

const mapStateToProps = state => {
    return {
        participants: getParticipants(state),
        messages: getActiveParticipantMessage(state)
    }
};

export default connect(mapStateToProps)(MessageList);
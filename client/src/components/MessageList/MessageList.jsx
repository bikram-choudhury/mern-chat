import React, { useEffect, createRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { animateScroll } from 'react-scroll';

import { getParticipants, getActiveParticipantMessage } from '../../redux/reducers';
import FileViewer from '../FileViewer/FileViewer';
import Message from '../Message/Message';
import './MessageList.scss';

const MessageList = props => {
    const { participants, messages } = props;
    const msgElRef = createRef();
    useEffect(() => {
        if (msgElRef) {
            animateScroll.scrollTo(msgElRef.current.scrollHeight, {
                containerId: 'message-list',
                smooth: true
            });
        }
    }, [messages, msgElRef]);

    return (
        <div className="messages" id="message-list" ref={holder => msgElRef.current = holder}>
            <ul>
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
        </div>
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
            msg: PropTypes.string,
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
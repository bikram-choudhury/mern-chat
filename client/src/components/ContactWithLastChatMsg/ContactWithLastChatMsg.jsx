import React from 'react';
import PropTypes from 'prop-types';
import './ContactWithLastChatMsg.scss';
import { getFirstTwoLetters } from '../../Utils/Utils';

const ContactWithLastChatMsg = props => {

    const {
        id: userId,
        name,
        recentMsg,
        currentStatus,
        lastMsgBy,
        host,
        currentUserId
    } = props;
    const firstLetters = getFirstTwoLetters(name);

    const participantName = name + `${host ? ' ( Host ) ' : ''}` +
        `${userId === currentUserId ? ' ( Me ) ' : ''}`;
    return (
        <div className="contact-with-recent-chat wrap">
            <div className="user-img">
                <span className={`contact-status ${currentStatus}`}></span>
                <div className="first-letters">{firstLetters}</div>
            </div>
            <div className="meta">
                <p className="name m-0">
                    {participantName}
                </p>
                <p className="msg-preview m-0 ellipsis">
                    {
                        lastMsgBy === currentUserId ? (
                            <span>You:</span>
                        ) : null
                    } {recentMsg}
                </p>
            </div>
        </div>
    );
}

ContactWithLastChatMsg.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    recentMsg: PropTypes.string,
    currentStatus: PropTypes.string,
    lastMsgBy: PropTypes.string,
    host: PropTypes.bool,
    currentUserId: PropTypes.string.isRequired
}

export default ContactWithLastChatMsg;
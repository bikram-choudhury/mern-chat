import React from 'react';
import PropTypes from 'prop-types';
import './ContactWithLastChatMsg.scss';

const ContactWithLastChatMsg = props => {

    const {
        _id: userId,
        name,
        recentMsg,
        currentStatus,
        img,
        lastMsgBy,
        hostedBy
    } = props;

    const currentUserId = '001';
    const hostId = hostedBy || '1';
    const participantName = name + '-' +
        `${userId === hostId ? ' ( Host ) ' : ''}` +
        `${userId === currentUserId ? ' ( Me ) ' : ''}`;
    return (
        <div className="contact-with-recent-chat wrap">
            <div className="user-img">
                <span className={`contact-status ${currentStatus}`}></span>
                <img src={img} alt={name} />
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
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    recentMsg: PropTypes.string,
    currentStatus: PropTypes.string,
    lastMsgBy: PropTypes.string.isRequired,
    hostedBy: PropTypes.string,
}

export default ContactWithLastChatMsg;
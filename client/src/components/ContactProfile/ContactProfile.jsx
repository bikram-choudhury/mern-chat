import React from 'react';
import PropTypes from 'prop-types';
import './ContactProfile.scss';
import { getFirstTwoLetters } from '../../Utils/Utils';

const ContactProfile = props => {
    const {
        name,
        currentStatus,
        socialMedia,
        onStartVideoCall
    } = props;
    const firstLetter = getFirstTwoLetters(name);

    return (
        <div className={`contact-profile message-box`}>
            <div className="user-info d-flex align-items-center">
                <div className={`first-letters d-flex justify-content-center align-items-center ${currentStatus}`}>{firstLetter}</div>
                <span className="ellipsis">{name}</span>
            </div>
            {
                socialMedia ? (
                    <div className="social-media">
                        <i className="fa fa-video-camera" onClick={onStartVideoCall} aria-hidden="true"></i>
                        <i className="fa fa-phone-square" aria-hidden="true"></i>
                    </div>
                ) : null
            }

        </div>
    );
};

ContactProfile.propTypes = {
    name: PropTypes.string.isRequired,
    currentStatus: PropTypes.string.isRequired,
    socialMedia: PropTypes.bool.isRequired
}

export default ContactProfile;
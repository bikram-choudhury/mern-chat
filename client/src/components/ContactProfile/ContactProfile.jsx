import React from 'react';
import PropTypes from 'prop-types';
import './ContactProfile.scss';

const ContactProfile = props => {
    const {
        name,
        img,
        socialMedia
    } = props;

    return (
        <div className={`contact-profile message-box`}>
            <div className="user-info">
                <img src={img} alt={name} />
                <span>{name}</span>
            </div>
            {
                socialMedia ? (
                    <div className="social-media">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                ) : null
            }

        </div>
    );
};

ContactProfile.propTypes = {
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    socialMedia: PropTypes.bool,
    lastMessage: PropTypes.bool,
}

export default ContactProfile;
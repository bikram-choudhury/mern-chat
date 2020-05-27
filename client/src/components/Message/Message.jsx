import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './Message.scss';

const Message = props => {

    const { sender, msg } = props;

    return (
        <Fragment>
            <div className="user-img">
                <img src={sender.img} alt={sender.name} />
            </div>
            <p className="message">{msg}</p>
        </Fragment>
    );
}


Message.propTypes = {
    sender: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        img: PropTypes.string,
        lastMsgBy: PropTypes.string,
        recentMsg: PropTypes.string,
        currentStatus: PropTypes.string,
        isActive: PropTypes.bool
    }),
    msg: PropTypes.string
}
export default Message;
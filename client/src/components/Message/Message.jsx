import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getFirstTwoLetters } from '../../Utils/Utils';
import './Message.scss';

const Message = props => {

    const { sender, msg } = props;
    const firstLetters = getFirstTwoLetters(sender.name);
    
    return (
        <Fragment>
            {
                firstLetters ? (
                    <div className="user-img">
                        <div className="first-letters">{firstLetters}</div>
                    </div>
                ) : null
            }
            <p className="message">{msg}</p>
        </Fragment>
    );
}


Message.propTypes = {
    sender: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
    }),
    msg: PropTypes.string
}
export default Message;
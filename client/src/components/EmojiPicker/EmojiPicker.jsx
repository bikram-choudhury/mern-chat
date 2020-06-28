import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import "emoji-mart/css/emoji-mart.css";
import './EmojiPicker.scss';

const EmojiPicker = props => {

    const { selected, position } = props;
    const [emojiPicker, setEmojiPicker] = useState(false);

    const handleClick = (event) => {
        event.preventDefault();
        setEmojiPicker(!emojiPicker);
    };
    return (
        <Fragment>
            <button type="button" className="btn bg-white" onClick={handleClick}>
                <span role="img" aria-label=""> 😁 </span>
            </button>
            <div className={`emoji-picker ${position} ${emojiPicker ? '' : 'vs-hidden'}`}>
                <Picker
                    title="Pick your emoji..."
                    onSelect={emoji => selected(emoji.native)}
                    autoFocus={true}
                    showSkinTones={false}
                    set={'google'}
                    i18n={{ categories: { search: ' ' } }}
                />
            </div>

        </Fragment >
    );
};

EmojiPicker.propTypes = {
    selected: PropTypes.func,
    position: PropTypes.string
};

export default EmojiPicker;
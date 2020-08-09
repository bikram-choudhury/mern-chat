import React from 'react';
import './Conference.scss';

function Conference(props) {
    // const { match: { params: { cid: conferanceId } } } = props;

    return (
        <div className="conference">
            <div className="conference__video">
                <div className="conference__videoGrid"></div>
                <div className="conference__videoControl">

                    <div className="conference__controlBlock">
                        <div className="conference__controlBtn">
                            <i className="fa fa-microphone" aria-hidden="true"></i>
                            <span>Mute</span>
                        </div>
                        <div className="conference__controlBtn">
                            <i className="fa fa-video-camera" aria-hidden="true"></i>
                            <span>Stop Video</span>
                        </div>
                    </div>

                    <div className="conference__controlBlock">

                        <div className="conference__controlBtn">
                            <i className="fa fa-users" aria-hidden="true"></i>
                            <span>Participants</span>
                        </div>
                        <div className="conference__controlBtn">
                            <i className="fa fa-list-alt" aria-hidden="true"></i>
                            <span>Chat</span>
                        </div>
                    </div>
                    <div className="conference__controlBlock">
                        <div className="conference__controlBtn">
                            <span className="leave__meeting">Leave Meeting</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="conference__chat">
                <div className="conference__chatHeader">Chats</div>
                <div className="conference__chatBody">
                    <div className="conference__chatList"></div>
                </div>
                <div className="conference__chatInputHolder">
                    <input type="text" placeholder="Type a message" className="conference__chatInputField" />
                    <button className="conference__chatInputBtn">SEND</button>
                </div>
            </div>
        </div>
    );
}

export default Conference;

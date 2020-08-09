import React, { useEffect, useState } from 'react';
import './Conference.scss';
import Video from '../../components/Video/Video';

function Conference(props) {
    // const { match: { params: { cid: conferanceId } } } = props;

    const [videoEls, setVideoEls] = useState([]);
    const [myStream, setMyStream] = useState(null);

    // local config for controls 
    const [controls, updateControls] = useState({
        audio: true,
        video: true,
        participants: true,
        chat: true
    })

    const getVideoStream = () => {
        return navigator.mediaDevices.getUserMedia({
            video: true, audio: true
        });
    };

    const addStreamToVideo = (videoStream) => {
        const className = videoEls.length > 2 ? 'small' : (
            videoEls.length === 2 ? 'medium' : 'large'
        )
        const videoJSX = (
            <Video
                key={`video-${videoEls.length}`}
                srcObject={videoStream}
                className={className}
                muted={false}
            />
        );
        setVideoEls([...videoEls, videoJSX]);
    };

    useEffect(() => {
        const init = async () => {
            const streamOfCurrentUser = await getVideoStream();
            addStreamToVideo(streamOfCurrentUser);
            setMyStream(streamOfCurrentUser);
        };

        init();
    }, []);

    const handleMuteUnMute = () => {
        const { enabled } = myStream.getAudioTracks()[0];
        // enabled = true => make it false
        // enabled = false => make it true
        myStream.getAudioTracks()[0].enabled = !enabled;
        updateControls({ ...controls, audio: !enabled })
    }

    const handlePlayPauseVideo = () => {
        const { enabled } = myStream.getVideoTracks()[0];
        // enabled = true => make it false
        // enabled = false => make it true
        myStream.getVideoTracks()[0].enabled = !enabled;
        updateControls({ ...controls, video: !enabled })
    }

    return (
        <div className="conference">
            <div className="conference__video">
                <div className="conference__videoGrid">
                    {videoEls}
                </div>
                <div className="conference__videoControl">

                    <div className="conference__controlBlock">
                        <div
                            className={`conference__controlBtn ${!controls.audio && 'unmute'}`}
                            onClick={handleMuteUnMute}
                        >
                            <i className="fa fa-microphone" aria-hidden="true"></i>
                            <span>Mute</span>
                        </div>
                        <div
                            className={`conference__controlBtn ${!controls.video && 'stop'}`}
                            onClick={handlePlayPauseVideo}
                        >
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

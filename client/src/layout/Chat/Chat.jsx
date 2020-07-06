import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getMeetingDetails, getCurrentUser } from '../../redux/reducers';
import { copyToClipboard, getFirstTwoLetters } from '../../Utils/Utils';
import './Chat.scss';

import client from '../../socket';
import ActiveChatPanel from '../../components/ActiveChatPanel/ActiveChatPanel';
import ProfileStatus from '../../components/ProfileStatus/ProfileStatus';
import ParticipantList from '../../components/ParticipantList/ParticipantList';

const ChatLayout = props => {
    const { meeting, loggedInUser } = props;
    const [profileStatusVisibility, toggleProfileStatusVisibility] = useState(false);

    const history = useHistory();

    useEffect(() => {
        const handler = function (e) {
            var confirmationMessage = "Are you sure on this action? This may lead to loose all your data";

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Webkit, Safari, Chrome
        };
        window.addEventListener("beforeunload", handler, false);
        return () => {
            window.removeEventListener('beforeunload', handler, false);
        }
    });

    const momoizedDisconnect = useCallback(() => {
        history.push('/logout');
    }, [history]);

    useEffect(() => {
        client._onDisconnect(momoizedDisconnect);
    }, [momoizedDisconnect]);

    const { protocol, host } = window.location;
    const inviteUrl = `${protocol}//${host}/join?meetingId=${meeting.id}`;

    const firstLettersForCurrentUser = getFirstTwoLetters(loggedInUser.name);

    return Object.keys(loggedInUser).length ? (
        <div id="frame">
            <div id="sidepanel">
                <div id="profile">
                    <div className="profile-with-status">
                        <div className={`profile-img ${loggedInUser.currentStatus}`}
                            onClick={
                                () => toggleProfileStatusVisibility(!profileStatusVisibility)
                            }
                        >{firstLettersForCurrentUser}</div>
                        <ProfileStatus
                            isActive={profileStatusVisibility}
                            currentStatus={loggedInUser.currentStatus}
                        />
                    </div>
                    <p className="user-name">{loggedInUser.name}</p>
                </div>
                {
                    loggedInUser.host ? (
                        <div id="metting-invitation" onClick={() => copyToClipboard(inviteUrl)}>
                            <span className="link">Copy <span>metting invitation</span> </span>
                            <i
                                className="fa fa-clipboard"
                                aria-hidden="true"
                            ></i>
                        </div>
                    ) : null
                }

                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search participants..." />
                </div>
                <div id="contacts">
                    <ParticipantList />
                </div>
            </div>
            <div className="content">
                <ActiveChatPanel meetingId={meeting.id} />
            </div>

        </div>
    ) : null;
};

ChatLayout.propTypes = {
    meeting: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    loggedInUser: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        host: PropTypes.bool,
        lastMsgBy: PropTypes.string,
        recentMsg: PropTypes.string,
        currentStatus: PropTypes.string,
        isActive: PropTypes.bool
    })
}

const mapStateToProps = state => {
    const currentUser = getCurrentUser(client.socketId);
    return {
        meeting: getMeetingDetails(state),
        loggedInUser: currentUser(state)
    }
};

export default connect(mapStateToProps)(ChatLayout);
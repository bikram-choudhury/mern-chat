import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getParticipants } from '../../redux/reducers';
import { setParticipantAsActive } from '../../redux/actions/participants.action';

import client from '../../socket';
import ContactWithLastChatMsg from '../ContactWithLastChatMsg/ContactWithLastChatMsg';

import './ParticipantList.scss';

const ParticipantList = props => {
    const { participants, selectParticipant } = props;
    const currentUserId = client.socketId;

    const firstParticipant = participants[0];
    useEffect(() => {
        selectParticipant(firstParticipant.id);
    }, [selectParticipant, firstParticipant.id]);
    
    return (
        <ul className="m-0 p-0 participant-list">
            {
                participants.map(participant => {
                    return (
                        <li className={
                            `contact ${participant.isActive ? 'active' : ''} ${participant.id === currentUserId ? 'disabled' : ''}`
                        }
                            key={participant.id}
                            onClick={() => selectParticipant(participant.id)}
                        >
                            <ContactWithLastChatMsg
                                {...participant}
                                currentUserId={currentUserId}
                            />
                        </li>
                    )
                })
            }
        </ul>
    );
};

ParticipantList.propTypes = {
    participants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            host: PropTypes.bool,
            lastMsgBy: PropTypes.string,
            recentMsg: PropTypes.string,
            currentStatus: PropTypes.string,
            isActive: PropTypes.bool
        })
    ),
    selectParticipant: PropTypes.func
}

const mapStateToProps = state => {
    return {
        participants: getParticipants(state)
    }
};

const mapDispatchToProps = {
    selectParticipant: setParticipantAsActive
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantList);
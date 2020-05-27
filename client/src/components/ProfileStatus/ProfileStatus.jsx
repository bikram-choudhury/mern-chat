import React from 'react';
import PropTypes from 'prop-types';
import { statusList } from '../../MockData/_profile-status';
import './ProfileStatus.scss';

const ProfileStatus = props => {
    const {
        isActive,
        currentStatus
    } = props;
    return (
        <div id="status-options" className={isActive ? 'active' : ''}>
            <ul className="m-0 p-0">
                {
                    statusList.map(status => {
                        return (
                            <li
                                key={status.value}
                                id={`status-${status.value}`}
                                className={currentStatus === status.value ? 'active' : ''}
                            >
                                <span className="status-circle"></span>
                                <p className="status m-0">{status.label}</p>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
};

ProfileStatus.propTypes = {
    isActive: PropTypes.bool,
    currentStatus: PropTypes.string
}

export default ProfileStatus;
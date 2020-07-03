import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { statusList } from '../../MockData/_profile-status';
import { saveMeetingDetails } from '../../redux/actions/meeting.action';
import { replaceParticipants } from '../../redux/actions/participants.action';
import client from '../../socket';
import './StartMeetingForm.scss';
import { createParticipantObjFromResponse } from '../../Utils/Utils';

const StartMeetingForm = props => {
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        client._connect();
        return () => {
            client._disconnect();
        }
    }, []);

    const onSubmit = data => {
        const userData = {
            ...data,
            currentStatus: statusList[0].value,
            isHost: true
        };
        client._startMeetingRoom(userData, (err, allParticipant) => {
            if (err) console.error(err);
            
            const meetingDetails = allParticipant[0];
            props.saveMeetingDetails(meetingDetails);
            props.replaceParticipants(createParticipantObjFromResponse(allParticipant));
            props.history.push('chat');
        });
    };
    return (
        <div className="start-meeting-form wrapper flex-form-holder">
            <div className="form-wrapper">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="userName">Please enter your name: </label>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            placeholder="Enter your display name"
                            autoComplete="false"
                            ref={register({ required: true })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="meetingName">
                            Please enter your meeting name:
                            <small>(Optional)</small>
                        </label>
                        <input
                            type="text"
                            name="meetingName"
                            id="meetingName"
                            placeholder="Enter your meeting name"
                            autoComplete="false"
                            ref={register()}
                        />
                    </div>
                    <div className="form-group">
                        <div className="text-align-right">
                            <button type="submit" className="btn btn-primary join-btn">Start Meeting</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    saveMeetingDetails, replaceParticipants
}
export default connect(null, mapDispatchToProps)(StartMeetingForm);
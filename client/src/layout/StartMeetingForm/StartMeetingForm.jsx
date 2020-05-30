import React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { statusList } from '../../MockData/_profile-status';
import { startMeeting } from '../../redux/actions/meeting.action';
import './StartMeetingForm.scss';

const StartMeetingForm = props => {
    const { history, saveUserToStartnMeeting } = props;
    const { register, handleSubmit } = useForm();
    const onSubmit = data => {
        saveUserToStartnMeeting({
            ...data,
            currentStatus: statusList[0].value
        }, { history });
    }
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
    saveUserToStartnMeeting: startMeeting
}
export default connect(null, mapDispatchToProps)(StartMeetingForm);
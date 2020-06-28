import queryString from 'query-string';
import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useFocus } from '../../hooks/useFocus';
import { statusList } from '../../MockData/_profile-status';
import { saveMeetingDetails } from '../../redux/actions/meeting.action';
import { replaceParticipants } from '../../redux/actions/participants.action';
import client from '../../socket';
import { createParticipantObjFromResponse } from '../../Utils/Utils';
import './UserJoiningForm.scss';

const UserJoiningForm = props => {
    const {
        location: { search },
    } = props;
    const parsedQueryParams = queryString.parse(search);
    const meetingId = parsedQueryParams.meetingId;

    const [mtIdInputRef, setMtIdInputFocus] = useFocus();
    const [userInputRef, setUserInputFocus] = useFocus();

    useEffect(() => {
        if (meetingId) {
            setUserInputFocus();
        } else {
            setMtIdInputFocus();
        }
    }, [meetingId, setUserInputFocus, setMtIdInputFocus]);

    useEffect(() => {
        client._connect();
        return () => client._disconnect()
    }, []);

    const { register, handleSubmit } = useForm({
        defaultValues: { meetingId }
    });
    const onSubmit = data => {
        const userData = {
            meetingId: data.meetingId || meetingId,
            name: data.userName,
            currentStatus: statusList[0].value
        };

        client._joinMeetingRoom(userData, (err, allParticipant) => {
            if (err) console.error(err);
            const meetingDetails = allParticipant[0];
            props.saveMeetingDetails(meetingDetails);
            props.replaceParticipants(createParticipantObjFromResponse(allParticipant));
            props.history.push('chat');
        });
    }
    return (
        <div className="user-joining-form wrapper flex-form-holder">
            <div className="form-wrapper">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {
                        !meetingId ? (
                            <Fragment>
                                <small>
                                    Invalid Metting id. Please check with your host to get the meeting id.
                                </small>
                                <div className="form-group">
                                    <label htmlFor="userName">Please enter meeting id: </label>
                                    <input
                                        type="text"
                                        id="meetingId"
                                        name="meetingId"
                                        placeholder="Enter your meeting id"
                                        autoComplete="off"
                                        ref={holder => {
                                            mtIdInputRef.current = holder;
                                            register(holder, { required: true })
                                        }}
                                    />
                                </div>
                            </Fragment>
                        ) : null
                    }
                    <div className="form-group">
                        <label htmlFor="userName">Please enter your name: </label>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            placeholder="Enter your display name"
                            ref={holder => {
                                userInputRef.current = holder;
                                register(holder, { required: true })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <div className="justify-content-space-between">
                            <Link to={`start-meeting`} className="btn btn-primary">
                                Start a new meeting 
                            </Link>
                            <button type="submit" className="btn btn-primary join-btn">Join Meeting</button>
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
export default connect(null, mapDispatchToProps)(UserJoiningForm);
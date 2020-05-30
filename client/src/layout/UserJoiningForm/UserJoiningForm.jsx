import React, { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import queryString from 'query-string';
import './UserJoiningForm.scss';
import { saveParticipant } from '../../redux/actions/participants.action';
import { connect } from 'react-redux';
import { getParticipants } from '../../redux/reducers/';
import { useFocus } from '../../hooks/useFocus';
import { statusList} from '../../MockData/_profile-status';

const UserJoiningForm = props => {
    const {
        location: { search },
        saveUserToJoinMeeting,
        history,
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

    const { register, handleSubmit } = useForm({
        defaultValues: { meetingId }
    });
    const onSubmit = data => {
        saveUserToJoinMeeting({
            meetingId: data.meetingId || meetingId,
            name: data.userName,
            currentStatus: statusList[0].value
        }, { history });
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
                        <div className="text-align-right">
                            <button type="submit" className="btn btn-primary join-btn">Join Meeting</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        allParticipants: getParticipants(state)
    }
}

const mapDispatchToProps = {
    saveUserToJoinMeeting: saveParticipant
}
export default connect(mapStateToProps, mapDispatchToProps)(UserJoiningForm);
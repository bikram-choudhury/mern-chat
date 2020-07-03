import React from 'react';

const StartMeetingForm = React.lazy(() => import('./layout/StartMeetingForm/StartMeetingForm'));
const UserJoiningForm = React.lazy(() => import('./layout/UserJoiningForm/UserJoiningForm'));
const Chat = React.lazy(() => import('./layout/Chat/Chat'));
const UserLogout = React.lazy(() => import('./layout/UserLogout/UserLogout'));

export const routes = [{
    path: '/start-meeting',
    component: StartMeetingForm,
    protected: false
}, {
    path: '/join',
    component: UserJoiningForm,
    protected: false
}, {
    path: '/chat',
    component: Chat,
    protected: true
}, {
    path: '/logout',
    component: UserLogout,
    protected: false
}];
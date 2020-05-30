import React from 'react';

const StartMeetingForm = React.lazy(() => import('./layout/StartMeetingForm/StartMeetingForm'));
const UserJoiningForm = React.lazy(() => import('./layout/UserJoiningForm/UserJoiningForm'));
const Chat = React.lazy(() => import('./layout/Chat/Chat'));

export const routes = [{
    path: '/start-meeting',
    component: StartMeetingForm
}, {
    path: '/join',
    component: UserJoiningForm
}, {
    path: '/chat',
    component: Chat
}];
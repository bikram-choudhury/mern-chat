import React from 'react';

const UserJoiningForm = React.lazy(() => import('./layout/UserJoiningForm/UserJoiningForm'));
const Chat = React.lazy(() => import('./layout/Chat/Chat'));

export const routes = [{
    path: '/join',
    component: UserJoiningForm
}, {
    path: '/chat',
    component: Chat
}];
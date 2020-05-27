import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { loadState, saveState } from './storage';
import { reducers } from './reducers';

const persistedState = loadState();
export const store = createStore(
    reducers,
    persistedState,
    composeWithDevTools(applyMiddleware(thunk))
);

store.subscribe(() => {
    const state = store.getState();
    const authentication = state && state.authentication;
    const messages = state && state.messages;
    const participants = state && state.participants;

    saveState({
        authentication: { ...authentication },
        messages: { ...messages, error: null },
        participants: { ...participants, error: null }
    })
});
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
    const messages = state && state.messages;
    const participants = state && state.participants;
    const meeting = state && state.meeting;

    saveState({
        meeting: { ...meeting },
        messages: { ...messages, error: null },
        participants: { ...participants, error: null }
    })
});
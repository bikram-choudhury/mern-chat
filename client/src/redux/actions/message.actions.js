import { SAVE_MESSAGE } from "../action.constant"

export const saveMessage = (message) => {
    return {
        type: SAVE_MESSAGE,
        payload: message 
    }
}


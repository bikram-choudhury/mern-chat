export const getFirstTwoLetters = (string = '') => {
    let firstLetters = "";
    const splitString = string.split(" ");
    const count = splitString.length > 2 ? 2 : splitString.length;
    for (let i = 0; i < count; i++) {
        const str = splitString[i];
        if (str) {
            firstLetters += str.charAt(0).toUpperCase();
        }
    }
    return firstLetters;
};

export const copyToClipboard = (textToCopy) => {
    // working in chrome
    navigator.clipboard.writeText(textToCopy);
};

export const createParticipantObjFromResponse = participants => {
    return participants.map(participant => {
        return {
            id: participant.id,
            name: participant.name,
            host: participant.host,
            lastMsgBy: participant.lastMsgBy || '',
            recentMsg: participant.recentMsg || '',
            currentStatus: participant.status || '',
            isActive: !!participant.isActive
        }
    });
};

export const getValueFromStorage = (key) => {
    const storageStr = sessionStorage.getItem('state');
    if (!storageStr) return {};
    const storage = JSON.parse(storageStr);
    return storage[key];
}
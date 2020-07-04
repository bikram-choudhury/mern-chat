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

export const getFileExtension = fileName => fileName.slice((fileName.lastIndexOf(".")) + 1);

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export const decodeBase64FileUrl = base64FileUrl => {
    // "data:image/gif;base64,R0lGODlhPQBEAPeoAJos..............."
    const [contentType, base64File] = base64FileUrl.split(';');
    const fileType = contentType.split(':')[1];
    const b64FileData = base64File.split(',')[1];
    const blobFile = b64toBlob(b64FileData, fileType);
    return { type: fileType, blobFile };
};

export const encodeImageToBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

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
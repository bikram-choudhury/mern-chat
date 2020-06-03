export const getFirstTwoLetters = (string) => {
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
}
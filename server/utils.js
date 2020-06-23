const jwt = require('jsonwebtoken');

exports.Auth = {
    SECRET_KEY: 'Mern chat',
    expiresIn: '1hr',
    tokenType: 'Bearer',

    createToken: function (payload = {}) {
        return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.expiresIn });
    },
    verifyToken: function (authToken) {
        if (authToken) {
            const tokenArr = authToken.split(" ");
            if (tokenArr[0] === 'Bearer') {
                const accessToken = tokenArr[1];
                const decodedToken = jwt.verify(token, this.SECRET_KEY, (error, decode) => decode ? decode : error);
                return decodedToken;
            }
        }
        return null;
    }
};

exports.generateRandomString = function (length = 10) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
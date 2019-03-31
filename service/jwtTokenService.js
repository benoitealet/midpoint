const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const privateKey = fs.readFileSync(__dirname + '/../config/jwt/jwtPrivate.key', 'utf8');
const publicKey = fs.readFileSync(__dirname + '/../config/jwt/jwtPublic.key', 'utf8');


module.exports = {

    generateToken(login) {
        const i = 'Midpoint';          // Issuer
        const s = login;        // Subject
        const a = login + '@midpoint'; // Audience

        let payload = {
            login: login,
            loginDate: moment().toISOString(),
            admin: true
        };

        let signOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "2h",
            algorithm: "RS256"
        };

        return jwt.sign(payload, privateKey, signOptions);
    },

    decodeToken(login, token) {
        const i = 'Midpoint';          // Issuer
        const s = login;        // Subject
        const a = login + '@midpoint'; // Audience

        const verifyOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "12h",
            algorithm: ["RS256"]
        };
        if(jwt.verify(token, publicKey, verifyOptions)) {
            return jwt.decode(token)
        };

    }

}

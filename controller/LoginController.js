const JwtTokenService = require('../service/jwtTokenService.js');
const AuthService = require('../service/authService.js');
const moment = require('moment');

module.exports = {
    doLogin: async function (req, res) {
        try {

            if (req.body && req.body.login && req.body.password) {
                const auth = await AuthService.auth(req.body.login, req.body.password);
                if (auth.success) {

                    res.send(JSON.stringify({
                        token: JwtTokenService.generateToken(req.body.login, auth.admin, moment().toISOString(), 1)
                    }));

                } else {
                    res.send(JSON.stringify({
                        error: 'Invalid login/password'
                    }));
                }

            } else {

                res.send(JSON.stringify({
                    error: 'Login or password is missing'
                }));
            }
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }

    }
}

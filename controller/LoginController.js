const JwtTokenService = require('../service/jwtTokenService.js');
const AuthService = require('../service/authService.js');

module.exports = {
    doLogin: function (req, res) {
        try {

            if (req.body && req.body.login && req.body.password) {
                const auth = AuthService.auth(req.body.login, req.body.password);
                if (auth.success) {

                    res.send(JSON.stringify({
                        token: JwtTokenService.generateToken(req.body.login, auth.admin)
                    }));

                } else {
                    res.send(JSON.stringify({
                        error: 'Login/mot de passe invalide'
                    }));
                }

            } else {

                res.send(JSON.stringify({
                    error: 'Requête incomplète'
                }));
            }
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }

    }
}

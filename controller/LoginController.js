const JwtTokenService = require('../service/jwtTokenService.js');

module.exports = {
    doLogin: function (req, res) {
        try {

            if (req.body && req.body.login && req.body.password) {
                if (req.body.login === 'test' && req.body.password === 'test') {

                    res.send(JSON.stringify({
                        token: JwtTokenService.generateToken(req.body.login)
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

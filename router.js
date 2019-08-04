const LoginController = require('./controller/LoginController.js');
const ProxyConfigController = require('./controller/ProxyConfigController.js');
const ProxyController = require('./controller/ProxyController.js');
const ProxyListController = require('./controller/ProxyListController.js');
const WebsocketController = require('./controller/WebsocketController.js');
const JwtTokenService = require('./service/jwtTokenService.js');
const express = require('express');

checkAuth = function (callback) {
    return (req, res) => {
        if (req.headers.authorization) {
            const authToken = JSON.parse(req.headers.authorization);
            if (authToken && authToken.login && authToken.jwtToken) {
                //console.log("Request token:", authToken.jwtToken);
                try {
                    let auth = JwtTokenService.decodeToken(authToken.login, authToken.jwtToken);
                    if (auth) {
                        callback(req, res, auth);

                        //console.log(Math.floor(Date.now() / 1000) - auth.iat);
                        const lifespan = Math.floor(Date.now() / 1000) - auth.iat;


                        if (lifespan > 20) {
                            //regenerate token

                            const generation = auth.generation+1;
                            const updatedToken = JwtTokenService.generateToken(auth.login, auth.admin, auth.loginDate, generation);

                            //console.log("Renew token to:", updatedToken);
                            res.header('x-update-auth', JSON.stringify({
                                jwtToken: updatedToken,
                                login: auth.login,
                            }));

                        }

                    } else {
                        res.status(403).send('Invalid token');
                    }
                } catch (e) {
                    res.status(403).send('Error while validating token');
                }
            } else {
                res.status(403).send('Incomplete token');
            }

        } else {
            res.status(403).send('Expected authentication');
        }
    }
}

module.exports = (model) => (app) => {
    app.disable('x-powered-by');

    const expressJs = require('express-ws')(app);
    const wsBroadcaster = WebsocketController.getBroadcaster(expressJs);
    app.all('/proxy/:slug/*', (req, res) => ProxyController.proxify(req, res, wsBroadcaster));

    app.use(express.json());
    app.use('/', require('express').static(__dirname + '/front/dist/midpoint/'));



    app.ws('/ws/proxy/:proxyId', WebsocketController.init(model));

    app.post('/doLogin', LoginController.doLogin);

    app.get('/proxyConfig/list', checkAuth(ProxyConfigController.getList));
    app.put('/proxyConfig/proxy', checkAuth(ProxyConfigController.putProxy));
    app.patch('/proxyConfig/proxy', checkAuth(ProxyConfigController.patchProxy));
    app.delete('/proxyConfig/proxy', checkAuth(ProxyConfigController.deleteProxy));

    app.get('/proxyList/list', checkAuth(ProxyListController.getList));
    app.get('/proxyList/calls/:proxyId', checkAuth(ProxyListController.getCalls));
    app.get('/proxyList/callHeaders/:httpId', checkAuth(ProxyListController.getCallHeaders));

    app.use(function (req, res, next) {
        res.status(404).send('Sorry can\'t find that!');
    });

    return {
        'broadcaster': wsBroadcaster
    }

}

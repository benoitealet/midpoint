const LoginController = require('./controller/LoginController.js');
const ProxyConfigController = require('./controller/ProxyConfigController.js');
const ProxyController = require('./controller/ProxyController.js');
const ProxyListController = require('./controller/ProxyListController.js');
const JwtTokenService = require('./service/jwtTokenService.js');
checkAuth = function (callback) {
    return (req, res) => {
        if (req.headers.authorization) {
            const authToken = JSON.parse(req.headers.authorization);
            if (authToken && authToken.login && authToken.jwtToken) {
                try {
                    let auth = JwtTokenService.decodeToken(authToken.login, authToken.jwtToken);
                    if (auth) {
                        callback(req, res, auth);
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

module.exports = (app) => {

    app.post('/doLogin', LoginController.doLogin);

    app.get('/proxyConfig/list', checkAuth(ProxyConfigController.getList));
    app.put('/proxyConfig/proxy', checkAuth(ProxyConfigController.putProxy));
    app.patch('/proxyConfig/proxy', checkAuth(ProxyConfigController.patchProxy));
    app.delete('/proxyConfig/proxy', checkAuth(ProxyConfigController.deleteProxy));

    app.get('/proxyList/list', checkAuth(ProxyListController.getList));
    app.get('/proxyList/calls/:proxyId', checkAuth(ProxyListController.getCalls));

    app.all('/proxy/:slug/*', ProxyController.proxify);

    app.use(function (req, res, next) {
        res.status(404).send('Sorry can\'t find that!');
    });

}

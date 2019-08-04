const JwtTokenService = require('../service/jwtTokenService.js');

module.exports = {
    init: (model) => (ws, req) => {

        const timerJwt = setInterval(() => {
            // if token is older than 60 secondes, renew it
            // and send it back to client

            //console.log(ws.auth);

            const lifespan = Math.floor(Date.now() / 1000) - ws.auth.iat;
            //console.log(lifespan);
            if (lifespan > 60) { // renew at 10 minutes
                //regenerate token

                const generation = ws.auth.generation + 1;
                const updatedToken = JwtTokenService.generateToken(ws.auth.login, ws.auth.admin, ws.auth.loginDate, generation);
                //console.log("Renew token by websocket to:", updatedToken);
                ws.send(JSON.stringify({
                    type: 'jwtRenew',
                    newToken: {
                        jwtToken: updatedToken,
                        login: ws.auth.login
                    }
                }));
                ws.auth = JwtTokenService.decodeToken(ws.auth.login, updatedToken);
            }

        }, 5000);

        ws.on('close', function () {
            clearInterval(timerJwt);
            console.log('closed websocket');
        });

        ws.on('message', async function (msgString) {
            try {
                const msg = JSON.parse(msgString);
                if (msg.auth) {
                    if (msg.auth.login && msg.auth.jwtToken) {
                        try {
                            let auth = JwtTokenService.decodeToken(msg.auth.login, msg.auth.jwtToken);
                            if (auth) {
                                const proxy = await model.Proxy.findByPk(req.params.proxyId);

                                const allowed = (() => {
                                    if(!proxy) {
                                        return false;
                                    }
                                    if (auth.admin || proxy.owner == auth.login) {
                                        //console.log('allowed because admin or owner', auth.admin, proxy.owner, auth.login);
                                        return true;
                                    } else {
                                        //console.log('allowed because other', auth.admin, proxy.owner, auth.login);
                                        const allowedTo = proxy.allowedTo.split(';').map(s => s.trim());
                                        return allowedTo.includes(auth.login);
                                    }
                                })();

                                if(allowed) {
                                    ws.proxy = proxy;
                                    ws.auth = auth;
                                } else {
                                    console.log('User not allowed on this proxy');
                                }
                            } else {
                                console.log('Invalid token');
                            }
                        } catch (e) {
                            console.log(e);
                            console.log('Error while validating token');
                        }
                    } else {
                        console.log('Incomplete token');
                    }
                }
            } catch (e) {
                console.log('Invalid websocket message')
                console.log(e);
            }
        });
    },

    getBroadcaster: (expressJs) => {
        return {
            broadcast: function (data, callbackFilter) {
                expressJs.getWss().clients.forEach((client) => {
                    if (callbackFilter && callbackFilter(client)) {
                        client.send(data);
                    } else {
                        console.log('rejected', data);
                    }
                });
            }
        }
    }
}

const JwtTokenService = require('../service/jwtTokenService.js');

module.exports = {
    init: (ws, req) => {
        ws.on('message', function(msgString) {
            try {
                const msg = JSON.parse(msgString);
                if (msg.auth) {
                    if (msg.auth.login && msg.auth.jwtToken) {
                        try {
                            let auth = JwtTokenService.decodeToken(msg.auth.login, msg.auth.jwtToken);
                            if (auth) {
                                ws.auth = auth;
                            } else {
                                console.log('Invalid token');
                            }
                        } catch (e) {
                            console.log('Error while validating token');
                        }
                    } else {
                        console.log('Incomplete token');
                    }
                }
            } catch(e) {
                console.log('Invalid websocket message')
                console.log(e);
            }
        });
    },

    getBroadcaster: (expressJs) => {
        return {
            broadcast: function(data, callbackFilter) {
                expressJs.getWss().clients.forEach((client) => {
                    if(callbackFilter && callbackFilter(client)) {
                        client.send(data);
                    }
                });
            }
        }
    }
}

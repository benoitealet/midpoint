const model = require('../model/model.js');

function isProxyAllowed(p, auth) {
    if(!p || !auth) {
        return false;
    }

    if (auth.admin || p.owner == auth.login) {
        return true;
    } else {
        const allowedTo = p.allowedTo.split(';').map(s => s.trim());
        return allowedTo.includes(auth.login);
    }
}

module.exports = {
    getList: async function (req, res, auth) {
        try {
            let data = await model.Proxy.findAll({
                order: [
                    ['name', 'ASC']
                ]
            });

            data = data.filter(p => isProxyAllowed(p, auth));

            res.send(data);
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }

    },

    getCalls: async function (req, res, auth) {
        try {
            let allowed = false;

            if(auth.admin) {
                allowed = true
            } else {
                let proxy = await model.Proxy.findByPk(req.params.proxyId);
                allowed = isProxyAllowed(proxy, auth);
            }
            if(allowed) {

                let data = await model.Http.findAll({
                    where: {
                        proxy: req.params.proxyId
                    },
                    order: [
                        ['date', 'DESC']
                    ]
                });
                res.send(data);
            } else {
                res
                    .status(403)
                    .send('Not allowed');
            }
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }
    },

    getCallHeaders: async function (req, res, auth) {
        try {
            let allowed = false;

            if(auth.admin) {
                allowed = true; //avoid to execute 2 queries if admin, it will be allowed
            } else {
                const http = await model.Http.findByPk(req.params.httpId);
                const proxy = await model.Proxy.findByPk(http.proxy);
                allowed = isProxyAllowed(proxy, auth);
            }

            if(allowed) {
                let data = await model.Header.findAll({
                    attributes: ['name', 'value', 'type'],
                    where: {
                        http: req.params.httpId
                    },
                    order: [
                        ['type', 'ASC'],
                        ['name', 'ASC']
                    ]
                });
                res.send(data);
            } else {
                res
                    .status(403)
                    .send('Not allowed');
            }
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }
    },


}

const model = require('../model/model.js');
const fs = require('fs');

function isProxyAllowed(p, auth) {
    if (!p || !auth) {
        return false;
    }

    if (auth.admin || p.owner == auth.login) {
        return true;
    } else if (p.allowedTo) {
        const allowedTo = p.allowedTo.split(';').map(s => s.trim());
        return allowedTo.includes(auth.login);
    } else {
        return false;
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

            if (auth.admin) {
                allowed = true
            } else {
                let proxy = await model.Proxy.findByPk(req.params.proxyId);
                allowed = isProxyAllowed(proxy, auth);
            }
            if (allowed) {

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

            if (auth.admin) {
                allowed = true; //avoid to execute 2 queries if admin, it will be allowed
            } else {
                const http = await model.Http.findByPk(req.params.httpId);
                const proxy = await model.Proxy.findByPk(http.proxy);
                allowed = isProxyAllowed(proxy, auth);
            }

            if (allowed) {
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

    getFile: async function (req, res) {
        let type = req.params.type;
        const filename = req.params.filename;

        if (!filename.match(/^[0-9]+_[0-9A-Za-z]{32}/)) {
            res.status(400).send('Invalid file name').end();
        } else {
            const filePath = __dirname + '/../storage/' + filename;

            if (fs.existsSync(filePath)) {

                const httpId = filename.split('_')[0];


                const contentType = await model.Header.findAll({
                    where: {
                        name: 'content-type',
                        type: type.toUpperCase(),
                        http: httpId
                    },
                    limit: 1
                });

                if (contentType[0]) {
                    res.setHeader('content-type', contentType[0].value);
                }

                fs.createReadStream(filePath).pipe(res);
            }
        }
    }
}

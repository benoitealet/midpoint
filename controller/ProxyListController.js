const model = require('../model/model.js');
const Sequelize = require('sequelize');

module.exports = {
    getList: async function (req, res, auth) {
        try {
            // TODO: Filter by admin/owner
            let data = await model.Proxy.findAll({
                order: [
                    ['name', 'ASC']
                ]
            });
            res.send(data);
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }

    },

    getCalls: async function (req, res, auth) {
        try {
            // TODO: Filter by admin/owner
            let data = await model.Http.findAll({
                where: {
                    proxy: req.params.proxyId
                },
                order: [
                    ['date', 'DESC']
                ]
            });
            res.send(data);
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }
    },
    getCallHeaders: async function (req, res, auth) {
        try {
            // TODO: Filter by admin/owner
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
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }
    },


}

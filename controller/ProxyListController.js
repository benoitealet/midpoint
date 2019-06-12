const model = require('../model/model.js');

module.exports = {
    getList: async function (req, res, auth) {
        try {
            // TODO: Filter by admin/owner
            let data = await model.Proxy.findAll({});
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
                }
            });
            res.send(data);
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }

    },

}

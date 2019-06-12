const model = require('../model/model.js');
const Op = require('sequelize').Op;

module.exports = {
    getList: async function (req, res, auth) {
        try {
            let data = await model.Proxy.findAll({});
            res.send(data);
        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }

    },

    putProxy: async function (req, res, auth) {
        try {
            let proxy = {
                name: req.body.name.substring(0, 64),
                encoding: req.body.encoding.substring(0, 8),
                description: req.body.description.substring(0, 256),
                slug: req.body.slug.substring(0, 64),
                destination: req.body.destination.substring(0, 256),
                owner: req.body.owner.substring(0, 256),
                delay: req.body.delay,
                allowedTo: req.body.allowedTo ? req.body.allowedTo.substring(0, 256) : null
            }

            if (!auth.admin) {
                proxy.owner = auth.login
            }

            await model.Proxy.create(proxy);
            res.send({
                success: true
            });
        } catch (e) {
            if (e.name && e.name === 'SequelizeUniqueConstraintError') {
                res.send({
                    success: false,
                    errors: e.errors.map((e) => e.message)
                });
            } else {
                res
                    .status(500)
                    .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
            }
        }
    },

    patchProxy: async function (req, res, auth) {
        try {
            const proxy = await model.Proxy.findByPk(req.body.id);
            if (!proxy) {
                res.send({
                    success: false,
                    errors: [
                        'Proxy not found'
                    ]
                });
            } else if (!auth.admin && auth.login != proxy.owner) {
                res.send({
                    success: false,
                    errors: [
                        'You are not allowed to modify this proxy'
                    ]
                });
            } else {
                proxy.name = req.body.name.substring(0, 64);
                proxy.encoding = req.body.encoding.substring(0, 8);
                proxy.description = req.body.description.substring(0, 256);
                proxy.slug = req.body.slug.substring(0, 64);
                proxy.destination = req.body.destination.substring(0, 256);
                proxy.owner = req.body.owner.substring(0, 256);
                proxy.delay = req.body.delay;
                proxy.allowedTo = req.body.allowedTo ? req.body.allowedTo.substring(0, 256) : null;

                await proxy.save();
                res.send({
                    success: true
                });
            }
        } catch (e) {
            if (e.name && e.name === 'SequelizeUniqueConstraintError') {
                res.send({
                    success: false,
                    errors: e.errors.map((e) => e.message)
                });
            } else {
                res
                    .status(500)
                    .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));
            }
        }
    },


    deleteProxy: async function (req, res, auth) {
        try {

            await model.Proxy.destroy({
                where: {
                    [Op.and]: [
                        {id: req.body.id},
                        auth.admin ? null : {owner: auth.login}
                    ]
                }
            });

            res.send({
                success: true
            });

        } catch (e) {
            res
                .status(500)
                .send(JSON.stringify(e, Object.getOwnPropertyNames(e)));

        }

    },
}

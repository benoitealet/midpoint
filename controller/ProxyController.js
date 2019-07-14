const model = require('../model/model.js');
const axios = require('axios');

function getBody(req, max) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', function (chunk) {
            data += chunk
            if (data.length > max) {
                reject('Body too big');
            }
        });
        req.on('end', function () {
            resolve(data);
        });
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    proxify: async function (req, res, wsDispatcher) {
        let timeRequest = new Date();

        let body = await getBody(req, 128 * 1024);

        let proxyDefinition = await model.Proxy.findOne({
            where: {
                slug: req.params.slug
            }
        });
        if (!proxyDefinition) {
            res.status(600);
            res.send({
                error: 'This proxy could not be found',
                slug: req.params.slug
            });
        } else {

            let http = model.Http.build({
                date: timeRequest,
                ipSource: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                requestVerb: req.method,
                requestUrl: req.params['0'],
                requestQuery: require('url').parse(req.url,false).query,
                requestBody: body,
                proxy: proxyDefinition.id
            });

            let hasHostHeader = false;

            await http.save();

            let headers = [];
            for (let key in req.headers) {
                // check if the property/key is defined in the object itself, not in parent
                if (req.headers.hasOwnProperty(key)) {
                    if(key.toLowerCase() == 'host') {
                        hasHostHeader = true;
                    }
                    headers.push({
                        name: key,
                        value: req.headers[key],
                        http: http.id,
                        type: 'REQUEST'
                    });
                }
            }

            const url = proxyDefinition.destination + '/' + req.params['0'];

            req.headers['host'] = require('url').parse(url).hostname;

            if(proxyDefinition.delay) {
                console.log('DELAY', url);
                await timeout(proxyDefinition.delay);
            }

            console.log('REQUEST', url);
            let response = {};
            try {
                response = await axios({
                    method: req.method,
                    url: url,
                    data: body,
                    headers: req.headers,
                    validateStatus: (status) => true,
                    transformResponse: (res) => {
                        // Do your own parsing here if needed ie JSON.parse(res);
                        return res;
                    },
                });
            } catch(e) {
                console.log(e);
                response = {
                    status: 600,
                }
            }

            console.log('RESPONSE', url, {status: response.status});

            for (let key in response.headers) {
                // check if the property/key is defined in the object itself, not in parent
                if (response.headers.hasOwnProperty(key)) {
                    headers.push({
                        name: key,
                        value: response.headers[key],
                        http: http.id,
                        type: 'RESPONSE'
                    });
                    res.setHeader(key, response.headers[key]);
                }
            }

            http.responseBody = response.data;
            http.responseStatus = response.status;

            res.status(response.status);

            await http.save();

            wsDispatcher.broadcast(JSON.stringify({
                type: 'call',
                call: http
            }), (client) => {
                const allowedTo = proxyDefinition.allowedTo?proxyDefinition.allowedTo.split(';'):[];
                allowedTo.push(proxyDefinition.owner);
                return allowedTo.includes(client.auth.sub);
            });

            res.end(response.data);
            model.Header.bulkCreate(headers);


        }
    }
}

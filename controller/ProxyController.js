const model = require('../model/model.js');
const axios = require('axios');
const ColorHash = require('color-hash');
const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

function getBody(req, max) {
    return new Promise((resolve, reject) => {
        let data = Buffer.alloc(0);
        req.on('data', function (chunk) {
            data  = Buffer.concat([data, chunk]);
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

        let body = await getBody(req, 16 * 1024 * 1024);

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

            const requestQuery = require('url').parse(req.url,false).query;
            let http = model.Http.build({
                date: timeRequest,
                ipSource: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                requestVerb: req.method,
                requestUrl: req.params['0'],
                requestQuery: requestQuery,
                requestBody: null,
                responseBody: '',
                proxy: proxyDefinition.id
            });

            let hasHostHeader = false;
            let hasAnonymousInRequest = false;
            let hasAnonymousInResponse = false;
            let hasColor = null;
            await http.save();

            let headers = [];
            for (let key in req.headers) {
                // check if the property/key is defined in the object itself, not in parent
                if (req.headers.hasOwnProperty(key)) {
                    if(key.toLowerCase() == 'host') {
                        hasHostHeader = true;
                    }
                    if(key.toLowerCase() == 'x-midpoint-dnt') {
                        hasAnonymousInRequest = true;
                    }
                    if(key.toLowerCase() == 'x-midpoint-color') {
                        hasColor = req.headers[key];
                        if(!hasColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                            hasColor = null;
                        }
                    }
                    headers.push({
                        name: key,
                        value: req.headers[key],
                        http: http.id,
                        type: 'REQUEST'
                    });
                }
            }

            const url = proxyDefinition.destination + '/' + req.params['0'] + (requestQuery?('?' + requestQuery):'');
            if(hasColor) {
                http.color = hasColor;
            } else {
                http.color = (new ColorHash()).hex(url);
            }

            await http.save();

            wsDispatcher.broadcast(http.proxy, JSON.stringify({
                type: 'call',
                call: http
            }), (client) => {
                const allowedTo = proxyDefinition.allowedTo?proxyDefinition.allowedTo.split(';'):[];
                allowedTo.push(proxyDefinition.owner);
                return client.auth.admin || allowedTo.includes(client.auth.login);
            });



            req.headers['host'] = require('url').parse(url).hostname;


            const timeStart = Date.now();
            if(proxyDefinition.delay) {
                //console.log('DELAY', url);
                await timeout(proxyDefinition.delay);
            }

            console.log('REQUEST', url);

            let timeEnd = null;
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
                timeEnd = Date.now();
            } catch(e) {
                console.log(e);
                response = {
                    status: 600,
                    error: e.message
                }
            }

            //console.log('RESPONSE', url, {status: response.status});

            for (let key in response.headers) {
                // check if the property/key is defined in the object itself, not in parent
                if (response.headers.hasOwnProperty(key)) {
                    if(key.toLowerCase() == 'x-midpoint-dnt') {
                        hasAnonymousInResponse = true;
                    }
                    headers.push({
                        name: key,
                        value: response.headers[key],
                        http: http.id,
                        type: 'RESPONSE'
                    });
                    res.setHeader(key, response.headers[key]);
                }
            }

            if(hasAnonymousInRequest || hasAnonymousInResponse) {
                headers = [];
            }

            if(hasAnonymousInRequest) {
                headers.push({
                    name: 'x-midpoint-dnt',
                    http: http.id,
                    type: 'REQUEST'
                });
            }

            if(hasAnonymousInResponse) {
                headers.push({
                    name: 'x-midpoint-dnt',
                    http: http.id,
                    type: 'RESPONSE'
                });
            }

            if(!hasAnonymousInRequest && !hasAnonymousInResponse) {
                if(response.error) {
                    http.responseBody = response.error;
                } else if(response.data && response.data.length < 128*1024) {
                    http.responseBody = response.data;
                } else if(response.data) {
                    const filename = http.id + '_' + cryptoRandomString({length: 64, characters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'});
                    const storageDir = __dirname + '/../storage/';

                    fs.writeFile(storageDir + filename, response.data, (err) => {
                        if(err) {
                            console.warn(err);
                        }
                    });
                    http.responseFileName = filename;
                    http.responseBody = null;
                }

                if(body.length < 128*1024) {
                    http.requestBody = body.toString();
                } else {

                    const filename = http.id + '_' + cryptoRandomString({length: 64, characters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'});
                    const storageDir = __dirname + '/../storage/';

                    fs.writeFile(storageDir + filename, response.data, (err) => {
                        if(err) {
                            console.warn(err);
                        }
                    });
                    http.requestFileName = filename;
                    http.requestBody = null;
                }

            } else {
                http.responseBody = '/* Do not track enabled, no info stored */';
                http.requestBody = '/* Do not track enabled, no info stored */';
            }

            http.time = null;
            if(timeEnd) {
                http.time = timeEnd - timeStart;
            }
            http.responseStatus = response.status;

            res.status(response.status);



            await http.save();

            wsDispatcher.broadcast(http.proxy, JSON.stringify({
                type: 'call',
                call: http
            }), (client) => {
                const allowedTo = proxyDefinition.allowedTo?proxyDefinition.allowedTo.split(';'):[];
                allowedTo.push(proxyDefinition.owner);
                return client.auth.admin || allowedTo.includes(client.auth.login);
            });

            res.end(response.data);

            model.Header.bulkCreate(headers);

        }
    }
}

"use strict"

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

module.exports.createServer = function (httpPort, cert, routing) {
    return new Promise(async (resolve, reject) => {
        try {
            const app = express();

            app.use(helmet());

            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "*");

                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);

                next();
            });


            app.options('*', cors()); // include before other routes
            app.use(cors());

            const routingService = routing(app);

            let server;
            let mode = '';
            if (cert) {
                const https = require('https');
                const fs = require('fs');


                let options = {
                    key: fs.readFileSync(cert.key),
                    cert: fs.readFileSync(cert.cert),
                    requestCert: false,
                    rejectUnauthorized: false
                };
                server = https.createServer(options, app);
                mode = 'HTTPS';
            } else {
                server = app;
                mode = 'HTTP';
            }

            server.listen(httpPort, function () {
                console.log(mode + ' Listen on port', httpPort);
            });

            resolve({
                'routingService': routingService
            });
        } catch (e) {
            console.error('Error in WebServer creation', e);
            reject();
        }
    });
}

"use strict"

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

module.exports.createServer = function (httpPort, cert, routing) {
    return new Promise((resolve, reject) => {
        try {
            const app = express();

            app.use(helmet())

            /*
             app.use(function (req, res, next) {
             res.header("Access-Control-Allow-Origin", "*");
             res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
             next();
             });
             */


            app.use(cors());

            app.use(express.json());

            app.use('/', express.static(__dirname + '/../public'));

            routing(app);

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

            resolve();
        } catch (e) {
            console.error('Error in WebServer creation', e);
            reject();
        }
    });
}

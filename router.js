const fs = require('fs');
const path = require('path');
const LoginController = require('./controller/LoginController.js');


module.exports = (config, model) => (app) => {
        const express = require('express');
        const path = require('path');

        app.post('/doLogin', LoginController.doLogin);


        app.get('/getProxyList', function (req, res) {

        });

        app.all('/proxy/:slug/*', function (req, res) {
            res.send('');
        });

        app.use(function (req, res, next) {
            res.status(404).send('Sorry can\'t find that!');
        });

    }

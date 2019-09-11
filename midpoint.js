"use strict"

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

console.log('Starting midpoint');

const config = require(__dirname + '/config/config.json');

const webServer = require(__dirname + '/modules/WebServer.js');

const model = require(__dirname + '/model/model.js');

const clean = require(__dirname + '/service/cleanService.js');

(async () => {
    await Promise.all([
        model.Proxy.sync(),
        model.Http.sync(),
        model.Header.sync()
    ]);
})();

// model.Proxy.findAll().then((data) => {
//     console.log(data);
// });


webServer
    .createServer(
        config.httpPort,
        config.cert,
        require('./router.js')(model)
    ).catch((e) => {
    console.log(e);
    process.exit(1);
}).then((webServerService) => {
    clean.initClean(model, webServerService.routingService);
});






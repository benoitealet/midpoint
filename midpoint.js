"use strict"

console.log('Starting midpoint');

const config = require(__dirname + '/config/config.json');

const webServer = require(__dirname + '/modules/WebServer.js');

const model = require(__dirname + '/model/model.js');

(async () => {
    await Promise.all([
        model.Proxy.sync(),
        model.Http.sync(),
        model.Header.sync()
    ]);
})();

webServer
    .createServer(
        config.httpPort,
        config.cert,
        require('./router.js')
    ).catch((e) => {
    console.log(e);
    process.exit(1);
});




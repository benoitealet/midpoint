const config = require('../config/config.json');

module.exports = {
    auth: (login, password) => {
        console.log('authProvider: ', config.authProvider);
        const customAuthProvider = require(config.authProvider);
        return customAuthProvider.auth(login, password);
    }
}

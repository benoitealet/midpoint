const config = require('../config/config.json');

module.exports = {
    auth: (login, password) => {
        console.log('authProvider: ', config.authProvider);
        if(config.authProvider) {
            const customAuthProvider = require(config.authProvider);
            if (customAuthProvider) {
                return customAuthProvider.auth(login, password);
            } else {
                throw new Error('AuthProvider not found: ', config.authProvider);
            }
        } else {
            throw new Error('AuthProvider not defined in configuration');
        }
    }
}

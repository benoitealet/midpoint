module.exports = {

    auth: (login, password) => {
        return new Promise((resolve, reject) => {
            if (login === password) {
                resolve({
                    success: true,
                    admin: login === 'admin'
                });
            } else {
                resolve({
                    success: false
                });
            }
        });
    }
};

module.exports = {

    auth: (login, password) => {
        if (login === 'test' && password === 'test') {
            return {
                success: true,
                admin: true
            }
        } else {
            return {
                success: false
            }
        }
    }
};

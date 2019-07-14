module.exports = {

    auth: (login, password) => {
        if (login === password) {
            return {
                success: true,
                admin: login === 'admin'
            }
        } else {
            return {
                success: false
            }
        }
    }
};

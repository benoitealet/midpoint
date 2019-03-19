const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

let Proxy = sequelize.define('proxy', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    destination: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    owner: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    allowedTo: {
        type: Sequelize.JSON
    }
});

let Http = sequelize.define('http', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    channel: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    ipSource: {
        type: Sequelize.STRING(39),
        allowNull: false
    },
    requestVerb: {
        type: Sequelize.STRING(8),
        allowNull: false
    },
    requestUrl: {
        type: Sequelize.STRING(2048),
        allowNull: false
    },
    requestBody: {
        type: Sequelize.TEXT
    },
    responseStatus: {
        type: Sequelize.INTEGER(3)
    },
    responseBody: {
        type: Sequelize.TEXT
    },
    proxy: {
        type: Sequelize.INTEGER,
        references: {
            model: Proxy,
            key: 'id'
        }
    }
});

let Header = sequelize.define('header', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    value: {
        type: Sequelize.STRING(256),
    },
    type: {
        type: Sequelize.ENUM('REQUEST', 'RESPONSE'),
    },
    http: {
        type: Sequelize.INTEGER,
        references: {
            model: Http,
            key: 'id'
        }
    }
});

module.exports = {
    Header,
    Http,
    Proxy,
}


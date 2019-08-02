const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false

});

let Proxy = sequelize.define('proxy', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
    },
    destination: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    owner: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    delay: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    retention: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    allowedTo: {
        type: Sequelize.STRING(128),
    },
    encoding: {
        type: Sequelize.STRING(8),
        allowNull: false
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
    requestQuery: {
        type: Sequelize.STRING(2048)
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
    Sequelize,
    Header,
    Http,
    Proxy,
}


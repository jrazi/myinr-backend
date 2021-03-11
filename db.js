

const devProps = {
    database: 'myinrir_test',
    user: 'myinrir_test',
    password: 'kyIg72@2',
    config: {
        host: '192.168.0.100',
        dialect: 'mssql',
        port: '1436',
    }
}

const productionProps = {
    database: 'myinrir_test',
    user: 'CAUTION_myinrir_test',
    password: 'CAUTION_kyIg72@2',
    config: {
        host: '185.165.116.32',
        dialect: 'mssql',
        port: '1435',
    }
}
function connect() {
    const {Sequelize} = require('sequelize');
    const props = devProps;
    const dbConnection = new Sequelize(props.database, props.user, props.password, props.config);
    return dbConnection;
}

var sequelize = connect();

function initDatabase() {
    const Models = initModels(sequelize);
    return Models;
}

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw new Error("Unable to connect to database");
    }
}

const _initModels = require('./models/init-models');

async function initModels(sequelize) {
    return _initModels(sequelize);
}

module.exports = {sequelize, initDatabase, testConnection, connect, initModels};
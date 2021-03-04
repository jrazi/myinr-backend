
function connect() {
    const {Sequelize} = require('sequelize');
    const dbConnection = new Sequelize('myinrir_test', 'myinrir_test', 'kyIg72@2', {
        host: '185.165.116.32',
        dialect: 'mssql',
        port: '1435',
    });
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
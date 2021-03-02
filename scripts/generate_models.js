

// For MyINR server: node --tls-min-v1.0 ./bin/www

function generateModels() {
    const SequelizeAuto = require('sequelize-auto');
    const auto = new SequelizeAuto('myinrir_test', 'myinrir_test', 'kyIg72@2', {
        host: '185.165.116.32',
        dialect: 'mssql',
        directory: './models', // where to write files
        port: '1435',
        caseModel: 'c',
        caseFile: 'p',
        lang: 'es6',

    })

    auto.run();
}

module.exports = generateModels;

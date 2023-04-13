const Sequelize = require('sequelize');

const connection = new Sequelize('queduvida', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
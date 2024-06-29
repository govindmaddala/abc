// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const { users } = require('./users.model');
const sequelize = new Sequelize('mean', 'postgres', '2107', {
    host: 'localhost',
    dialect: 'postgres',
});

async function connectDatabase() {
    try {
        await sequelize.authenticate();
        logger.info(`Connection has been established successfully at ${new Date().toLocaleTimeString()}`)
        // await sequelize.sync({ force: true });
    } catch (error) {
        logger.error(`Error in connecting to db: `, error)
    }
};

module.exports = {
    sequelize,
    userModal: users(sequelize, DataTypes),
    connectDatabase
};

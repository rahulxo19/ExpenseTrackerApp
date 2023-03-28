const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const expenses = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    price: {
        type: Sequelize.DOUBLE
    },
    category: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
})

module.exports = expenses;

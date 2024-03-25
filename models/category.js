const Sequelize = require('sequelize');
const db = require('../utils/database');

const Category = db.define('category', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
});

module.exports = Category;
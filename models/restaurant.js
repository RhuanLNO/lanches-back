const Sequelize = require('sequelize');
const db = require('../utils/database');

const Restaurant = db.define('restaurant', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  businessHours: Sequelize.STRING,
  instagram: Sequelize.STRING,
  phone: Sequelize.STRING,
  photo: Sequelize.TEXT,
});

module.exports = Restaurant;
const Category = require('../models/category');
const Restaurant = require('../models/restaurant');
const Sequelize = require('sequelize');
const db = require('../utils/database');

const RestaurantCategory = db.define('restaurantsCategories', {
  categoryId: {
    type: Sequelize.INTEGER,
    references: {
      model: Category,
      key: "id"
    }
  },
  restaurantId: {
    type: Sequelize.INTEGER,
    references: {
      model: Restaurant,
      key: "id"
    }
  }
});

Category.belongsToMany(Restaurant, { through: RestaurantCategory });
Restaurant.belongsToMany(Category, { through: RestaurantCategory });

module.exports = RestaurantCategory
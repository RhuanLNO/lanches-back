const RestaurantCategory = require('../models/restaurantCategory');
const Category = require('../models/category');
const Restaurant = require('../models/restaurant');


exports.getRestaurants = (request, response) => {
	RestaurantCategory.findAll()
		.then(restaurants => {
			response.status(200).json({ restaurants: restaurants });
		})
		.catch(err => console.log(err));
};
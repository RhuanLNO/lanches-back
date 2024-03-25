const controller = require('../controllers/restaurantsCategoriesController');
const router = require('express').Router();

router.get('/', controller.getRestaurants);

module.exports = router;
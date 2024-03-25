const controller = require('../controllers/restaurantsController');
const router = require('express').Router();

router.get('/', controller.getRestaurants);
router.get('/:restaurantId', controller.getRestaurant);
router.post('/', controller.createRestaurant);
router.delete('/:restaurantId', controller.deleteRestaurant);
router.patch('/:restaurantId', controller.updateRestaurant);

module.exports = router;
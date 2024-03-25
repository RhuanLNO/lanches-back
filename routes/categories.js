const controller = require('../controllers/categoriesController');
const router = require('express').Router();

router.get('/', controller.getCategories);
router.get('/:categoryId', controller.getCategory);
router.post('/', controller.createCategory);
router.delete('/:categoryId', controller.deleteCategory);
router.patch('/:categoryId', controller.updateCategory);

module.exports = router;
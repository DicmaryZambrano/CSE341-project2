const router = require('express').Router();
const productsController = require('../controllers/productsController');
const {
  productValidation,
  updateProductValidation,
  validateResults,
} = require('../utils/productsValidation');

// Route to get all products
router.get('/', productsController.getProducts);

// Route to get a product by ID
router.get('/:productId', productsController.getProductById);

// Route to add a new product
router.post(
  '/',
  productValidation,
  validateResults(),
  productsController.addProduct,
);

// Route to update a product by ID
router.put(
  '/:productId',
  updateProductValidation,
  validateResults(),
  productsController.updateProductById,
);

// Route to delete a product by ID
router.delete('/:productId', productsController.deleteProductById);

module.exports = router;

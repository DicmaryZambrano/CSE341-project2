const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const productsController = require('../controllers/productsController');
const {
  productValidation,
  updateProductValidation,
  validateResults,
} = require('../utils/productsValidation');

// Route to get all products
router.get('/', requiresAuth(), productsController.getProducts);

// Route to get a product by ID
router.get('/:productId', requiresAuth(), productsController.getProductById);

// Route to add a new product
router.post(
  '/',
  requiresAuth(),
  productValidation,
  validateResults(),
  productsController.addProduct,
);

// Route to update a product by ID
router.put(
  '/:productId',
  requiresAuth(),
  updateProductValidation,
  validateResults(),
  productsController.updateProductById,
);

// Route to delete a product by ID
router.delete(
  '/:productId',
  requiresAuth(),
  productsController.deleteProductById,
);

module.exports = router;

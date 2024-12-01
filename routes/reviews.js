// routes/reviewsRoutes.js
const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const reviewsController = require('../controllers/reviewsController');
const {
  reviewValidation,
  updateReviewValidation,
  validateResults,
} = require('../utils/reviewsValidation');

// Route to get all reviews for a product
router.get(
  '/product/:productId',
  requiresAuth(),
  reviewsController.getReviewsForProduct,
);

// Route to get a specific review by ID
router.get('/:reviewId', requiresAuth(), reviewsController.getReviewById);

// Route to add a new review
router.post(
  '/',
  requiresAuth(),
  reviewValidation,
  validateResults(),
  reviewsController.addReview,
);

// Route to update a review by ID
router.put(
  '/:reviewId',
  requiresAuth(),
  updateReviewValidation,
  validateResults(),
  reviewsController.updateReviewById,
);

// Route to delete a review by ID
router.delete('/:reviewId', requiresAuth(), reviewsController.deleteReviewById);

module.exports = router;

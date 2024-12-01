const { body, validationResult } = require('express-validator');
const BaseError = require('./baseError');
const Review = require('../models/reviewsModel');
const httpStatusCodes = require('./httpStatusCodes');

// Validation rules for creating a review
const reviewValidation = [
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      const error = new Error('Request body cannot be empty.');
      throw error;
    }

    const allowedFields = ['productId', 'rating', 'comment'];

    const invalidFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key),
    );
    if (invalidFields.length > 0) {
      const error = new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      throw error;
    }

    return true;
  }),

  body('productId')
    .notEmpty()
    .withMessage('Product ID is required.')
    .isMongoId()
    .withMessage('Invalid product ID format.'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5.'),

  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required.')
    .isString()
    .withMessage('Comment must be a string.'),
];

// Validation rules for updating a review
const updateReviewValidation = [
  body().custom(async (item, { req }) => {
    if (Object.keys(req.body).length === 0) {
      const error = new Error('Request body cannot be empty.');
      throw error;
    }
    const { reviewId } = req.params;
    const existingReview = await Review.findById(reviewId);

    if (!existingReview) {
      const error = new Error(`Review with ID ${reviewId} not found.`);
      throw error;
    }

    const allowedFields = ['rating', 'comment'];

    const invalidFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key),
    );
    if (invalidFields.length > 0) {
      const error = new Error(
        `Invalid fields for update: ${invalidFields.join(', ')}`,
      );
      throw error;
    }

    const filteredExistingProduct = Object.entries(existingReview.toObject())
      .filter(([key]) => allowedFields.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const filteredRequestBody = Object.entries(req.body)
      .filter(([key]) => allowedFields.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const isIdentical = Object.keys(filteredRequestBody).every(
      (key) => filteredRequestBody[key] === filteredExistingProduct[key],
    );

    if (isIdentical) {
      const error = new Error('No changes detected. Update request ignored.');
      throw error;
    }

    return true;
  }),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5.'),

  body('comment')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Comment must be a string.')
    .isString()
    .withMessage('Comment must be a string.'),
];

// Middleware to check validation results
const validateResults = () => (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Extract error messages from validation result
  const extractedErrors = errors.array().map((err) => ({ message: err.msg }));
  const errorMessage = extractedErrors.map((e) => e.message).join(', ');

  return next(
    new BaseError(
      'ValidationError',
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage,
    ),
  );
};

module.exports = {
  reviewValidation,
  updateReviewValidation,
  validateResults,
};

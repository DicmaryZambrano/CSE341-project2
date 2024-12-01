const mongoose = require('mongoose');
const Review = require('../models/reviewsModel');
const Product = require('../models/productsModel');
const Customer = require('../models/customerModel');
const BaseError = require('../utils/baseError');
const Api404Error = require('../utils/api404Error');
const httpStatusCodes = require('../utils/httpStatusCodes');

const reviewsController = {};

// Get all reviews for a specific product
reviewsController.getReviewsForProduct = async (req, res, next) => {
  const { productId } = req.params;

  // Check if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid product ID format',
      ),
    );
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new Api404Error(
          'ProductNotFoundError',
          `Product with ID ${productId} not found.`,
        ),
      );
    }

    const reviews = await Review.find({ productId });
    res.status(httpStatusCodes.OK).json(reviews);
  } catch (error) {
    next(
      new BaseError(
        'GetReviewsError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error retrieving reviews',
      ),
    );
  }
};

// Get a specific review by ID
reviewsController.getReviewById = async (req, res, next) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid product ID or review ID format',
      ),
    );
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(
        new Api404Error(
          'ReviewNotFoundError',
          `Review with ID ${reviewId} not found.`,
        ),
      );
    }

    res.status(httpStatusCodes.OK).json(review);
  } catch (error) {
    next(
      new BaseError(
        'GetReviewByIdError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error retrieving review',
      ),
    );
  }
};

// Add a new review
reviewsController.addReview = async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const { user } = req.oidc; // The authenticated user's data from OAuth

  // Check if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid product ID format',
      ),
    );
  }

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new Api404Error(
          'ProductNotFoundError',
          `Product with ID ${productId} not found.`,
        ),
      );
    }

    // Find the customer using the email from OAuth
    const customer = await Customer.findOne({ email: user.email });
    if (!customer) {
      return next(
        new Api404Error(
          'CustomerNotFoundError',
          `Customer with email ${user.email} not found.`,
        ),
      );
    }

    // Create and save the new review
    const review = new Review({
      productId,
      customerId: customer._id, // Use the customer ID from the database
      rating,
      comment,
    });
    await review.save();

    res.status(httpStatusCodes.CREATED).json({
      message: 'Review created successfully',
    });
  } catch (error) {
    next(
      new BaseError(
        'AddReviewError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error creating review',
      ),
    );
  }
};

// Update a review by ID
reviewsController.updateReviewById = async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  // Check if the reviewId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid review ID format',
      ),
    );
  }

  try {
    // Find and update the review
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!review) {
      return next(
        new Api404Error(
          'ReviewNotFoundError',
          `Review with ID ${reviewId} not found.`,
        ),
      );
    }

    res.status(httpStatusCodes.OK).json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(
      new BaseError(
        'UpdateReviewError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error updating review',
      ),
    );
  }
};

// Delete a review by ID
reviewsController.deleteReviewById = async (req, res, next) => {
  const { reviewId } = req.params;

  // Check if the reviewId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid review ID format',
      ),
    );
  }

  try {
    // Delete the review
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return next(
        new Api404Error(
          'ReviewNotFoundError',
          `Review with ID ${reviewId} not found.`,
        ),
      );
    }

    res.status(httpStatusCodes.OK).json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(
      new BaseError(
        'DeleteReviewError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error deleting review',
      ),
    );
  }
};

module.exports = reviewsController;

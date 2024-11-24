const { body, validationResult } = require('express-validator');
const BaseError = require('./baseError');
const Product = require('../models/productsModel');
const httpStatusCodes = require('./httpStatusCodes');

// Validation rules for creating a product
const productValidation = [
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      const error = new Error('Request body cannot be empty.');
      throw error;
    }

    const fields = [
      'name',
      'description',
      'price',
      'category',
      'stock',
      'createdAt',
      'updatedAt',
    ];

    const invalidFields = Object.keys(req.body).filter(
      (key) => !fields.includes(key),
    );

    if (invalidFields.length > 0) {
      const error = new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      throw error;
    }

    return true;
  }),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required.')
    .isString()
    .withMessage('Product name must be a string.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required.')
    .isString()
    .withMessage('Product description must be a string.'),
  body('price')
    .notEmpty()
    .withMessage('Product price is required.')
    .isFloat({ min: 0 })
    .withMessage(
      'Product price must be a valid number and cannot be negative.',
    ),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Product category is required.')
    .isString()
    .withMessage('Product category must be a string.'),
  body('stock')
    .notEmpty()
    .withMessage('Product stock is required.')
    .isInt({ min: 0 })
    .withMessage(
      'Product stock must be a valid integer and cannot be negative.',
    ),
];

// Validation rules for updating a product
const updateProductValidation = [
  body().custom(async (item, { req }) => {
    if (Object.keys(req.body).length === 0) {
      const error = new Error('Request body cannot be empty.');
      throw error;
    }

    const { productId } = req.params;
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      const error = new Error(`Product with ID ${productId} not found.`);
      throw error;
    }

    const editableFields = [
      'name',
      'description',
      'price',
      'category',
      'stock',
    ];

    const invalidFields = Object.keys(req.body).filter(
      (key) => !editableFields.includes(key),
    );

    if (invalidFields.length > 0) {
      const error = new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      throw error;
    }

    const filteredExistingProduct = Object.entries(existingProduct.toObject())
      .filter(([key]) => editableFields.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const filteredRequestBody = Object.entries(req.body)
      .filter(([key]) => editableFields.includes(key))
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
  }),
  body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Product name must be a string.'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Product description must be a string.'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      'Product price must be a valid number and cannot be negative.',
    ),
  body('category')
    .optional()
    .trim()
    .isString()
    .withMessage('Product category must be a string.'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      'Product stock must be a valid integer and cannot be negative.',
    ),
];

// Middleware to check validation results
const validateResults = () => (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

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
  productValidation,
  updateProductValidation,
  validateResults,
};

const mongoose = require('mongoose');
const Api404Error = require('../utils/api404Error');
const BaseError = require('../utils/baseError');
const httpStatusCodes = require('../utils/httpStatusCodes');
const Product = require('../models/productsModel');

const productsCont = {};

// Get all products
productsCont.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(httpStatusCodes.OK).json(products);
  } catch (error) {
    next(
      new BaseError(
        'GetProductsError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error retrieving products',
      ),
    );
  }
};

// Get a single product by ID
productsCont.getProductById = async (req, res, next) => {
  const { productId } = req.params;

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
    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new Api404Error(
          'ProductNotFoundError',
          `Product with ID ${productId} not found.`,
        ),
      );
    }
    res.status(httpStatusCodes.OK).json(product);
  } catch (error) {
    next(
      new BaseError(
        'GetProductByIdError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error retrieving product',
      ),
    );
  }
};

// Add a new product
productsCont.addProduct = async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Request body cannot be empty', // no changes
      ),
    );
  }

  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(httpStatusCodes.CREATED).json({
      message: 'Product created successfully',
      // eslint-disable-next-line no-underscore-dangle
      productId: savedProduct._id,
    });
  } catch (error) {
    next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid product data',
      ),
    );
  }
};

// Update an existing product by ID
productsCont.updateProductById = async (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Invalid product ID format',
      ),
    );
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new BaseError(
        'BadRequestError',
        httpStatusCodes.BAD_REQUEST,
        'Request body cannot be empty',
      ),
    );
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return next(
        new Api404Error(
          'ProductNotFoundError',
          `Product with ID ${productId} not found.`,
        ),
      );
    }

    res.status(httpStatusCodes.OK).json({
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(
      new BaseError(
        'UpdateProductError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error updating product',
      ),
    );
  }
};

// Delete a product by ID
productsCont.deleteProductById = async (req, res, next) => {
  const { productId } = req.params;

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
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return next(
        new Api404Error(
          'ProductNotFoundError',
          `Product with ID ${productId} not found.`,
        ),
      );
    }

    res.status(httpStatusCodes.OK).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(
      new BaseError(
        'DeleteProductError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error deleting product',
      ),
    );
  }
};

module.exports = productsCont;

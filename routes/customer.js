const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const Customer = require('../models/customerModel');
const BaseError = require('../utils/baseError');
const httpStatusCodes = require('../utils/httpStatusCodes');

const router = express.Router();

router.get('/createCustomer', requiresAuth(), async (req, res, next) => {
  const { user } = req.oidc; // The authenticated user's data from OAuth

  try {
    const existingCustomer = await Customer.findOne({ email: user.email });
    if (existingCustomer) {
      return res.redirect('/profile');
    }

    const newCustomer = new Customer({
      name: user.name,
      email: user.email,
    });

    await newCustomer.save();
    return res.redirect('/profile');
  } catch (error) {
    next(
      new BaseError(
        'GetReviewsError',
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error retrieving reviews',
      ),
    );
  }
});

module.exports = router;

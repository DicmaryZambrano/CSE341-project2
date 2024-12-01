const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const { requiresAuth } = require('express-openid-connect');
const swaggerDocument = require('../swagger.json');

// Custom Swagger UI options to include OAuth
const swaggerOptions = {
  swaggerOptions: {
    oauth2RedirectUrl:
      'https://cse341-project2-cmpr.onrender.com/api-docs/oauth2-redirect.html',
    initOAuth: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.SECRET,
      appName: 'My App',
      scopeSeparator: ' ',
      scopes: ['openid', 'profile'],
      useBasicAuthenticationWithAccessCodeGrant: false,
      usePkceWithAuthorizationCodeGrant: true,
    },
  },
};

// Protect the API documentation route
router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

module.exports = router;

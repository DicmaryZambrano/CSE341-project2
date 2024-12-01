// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE341 Shop API',
    description:
      'An API to manage and retrieve information about products and orders for a store.',
    version: '1.0.0', // Added version for completeness
  },
  host: 'cse341-project2-cmpr.onrender.com', // Correct host URL
  basePath: '/', // Base path remains '/'
  schemes: ['https'], // Secure HTTPS connection
};

const outputFile = './swagger.json'; // Output file path
const routes = ['./app.js']; // Ensure this matches your route file(s)

swaggerAutogen(outputFile, routes, doc);

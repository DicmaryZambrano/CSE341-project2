// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Cse341 Shop API',
    description:
      'An API to manage and retrieve information about products and orders for a store.',
  },
  host: 'shop-products-vezc.onrender.com',
  basePath: '/',
  schemes: ['https'],
  definitions: {
    Product: {
      name: 'Product Name',
      description: 'Product Description',
      price: 25.99,
      category: 'Electronics',
      stock: 100,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./app.js'];

swaggerAutogen(outputFile, routes, doc);

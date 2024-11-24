const routes = require('express').Router();
const products = require('./products');
const swagger = require('./swagger');

routes.use('/', swagger);
// #swagger.tags=['Products']
routes.use('/products', products);

module.exports = routes;

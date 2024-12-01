const routes = require('express').Router();
const products = require('./products');
const swagger = require('./swagger');
const reviews = require('./reviews');

routes.use('/', swagger);
// #swagger.tags=['Products']
routes.use('/products', products);
routes.use('/reviews', reviews);
routes.use('/', require('./account'));
routes.use('/', require('./customer'));

module.exports = routes;

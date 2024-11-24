const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class Api404Error extends BaseError {
  constructor(name, description = 'Resource not found') {
    super(name, httpStatusCodes.NOT_FOUND, description, true);
  }
}

module.exports = Api404Error;

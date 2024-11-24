function isOperationalError(error) {
  return error.isOperational || false;
}

module.exports = {
  isOperationalError,
};

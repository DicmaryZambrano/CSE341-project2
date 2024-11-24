const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  console.error(`[${statusCode}] ${err.stack || message}`);

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

module.exports = errorHandler;
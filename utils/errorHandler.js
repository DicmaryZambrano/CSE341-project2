const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // Handle unauthorized access errors
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Access is denied due to invalid credentials.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  console.error(`[${statusCode}] ${err.stack || message}`);

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

module.exports = errorHandler;

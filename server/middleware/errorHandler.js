// Catches unmatched routes
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Centralized error handler - never leaks stack traces to the client
export const errorHandler = (err, req, res, _next) => {
  console.error(err);

  let status = err.statusCode || 500;
  let message = err.message || 'Server error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `That ${field} is already in use`;
  }

  // Unexpected/unhandled errors: never leak internal details
  if (status === 500 && !err.statusCode) {
    message = 'Server error';
  }

  res.status(status).json({ message });
};

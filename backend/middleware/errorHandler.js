export function notFoundHandler(request, _response, next) {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _request, response, _next) {
  const statusCode = Number(error.statusCode) || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Unexpected server error" : error.message,
    ...(error.details ? { errors: error.details } : {}),
  });
}

export const notFoundHandler = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
};

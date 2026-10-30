exports.notFound = (req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' });

exports.errorHandler = (err, req, res, next) => {
  console.error(err.message);
  const status = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : (err.status || 500);
  res.status(status).json({ success: false, message: err.message });
};

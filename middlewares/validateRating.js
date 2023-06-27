module.exports = (req, res, next) => {
  if (req.body.rating < 1 || req.body.rating > 10)
    return next({
      status: 404,
      message: "The Rating Should be between 1 - 10",
    });
  next();
};
// Validate rating value

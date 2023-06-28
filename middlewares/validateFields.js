const { body, validationResult } = require("express-validator");

const validationRules = () => {
  return [
    // Must be at least 8 characters long
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
    // Must contain a number
    body("password")
      .matches(/\d/)
      .withMessage("Password must contain a number."),
    // Must contain an uppercase letter
    body("password")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter."),
    // Must contain a lowercase letter
    body("password")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter."),
    body("email").isEmail().withMessage("Email must be valid."),
  ];
};

const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validationRules,
  validateFields,
};

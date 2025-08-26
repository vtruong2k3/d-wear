const forgotSchema = Joi.object({ email: Joi.string().email().required() });
const checkSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
});
const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
  password: Joi.string().min(8).max(64).required(),
});

module.exports = {
  forgotSchema,
  checkSchema,
  resetSchema,
};

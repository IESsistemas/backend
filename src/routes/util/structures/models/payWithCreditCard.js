const Joi = require('joi');

const schema = Joi.object({
	paymentAmount: Joi.alternatives().try(
		Joi.number().integer(),
		Joi.number().precision(2)
	).required(),
	cardExpiration: Joi.string().regex(/^\d{2}\/\d{2}$/).required(),
	idCard: Joi.number().integer(),
	numberCard: Joi.string().pattern(/^[0-9]+$/).required(),
	verificationCode: Joi.string().required(),
	cardholder: Joi.string().required(),
	phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
	installments: Joi.number().integer()
});

module.exports = (req, res, next) => {
	const { error } = schema.validate(req.body, { abortEarly: false });

	if(!error)
		next();
	else {
		const errorMessages = error.details.map(detail => detail.message.replace(/['"]/g, ''));
		return res.status(400).json({ error: errorMessages });
	}
};

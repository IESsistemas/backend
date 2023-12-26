const Joi = require('joi');

const schema = Joi.object({
	dni: Joi.string()
		.regex(/^\d+$/)
		.message('DNI must be a string of numbers')
		.min(7)
		.max(8)
		.required()
		.label('DNI')
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

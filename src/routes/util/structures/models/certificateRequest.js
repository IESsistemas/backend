const Joi = require('joi');

const schema = Joi.object({
	typeDni: Joi.number().required(),
	dni: Joi.string()
		.regex(/^\d+$/)
		.message('DNI must be a string of numbers')
		.min(7)
		.max(8)
		.required()
		.label('DNI'),
	dispatchPlace: Joi.string().required(),
	formalities: Joi.string(),
	other: Joi.string().optional(),
	email: Joi.string().email({ tlds: { allow: false } }),
	idCareer: Joi.number().required()
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

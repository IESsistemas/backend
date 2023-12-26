const Joi = require('joi');

const schema = Joi.object({
	applicantDni: Joi.string()
		.regex(/^\d+$/)
		.message('applicantDni must be a string of numbers')
		.min(7)
		.max(8)
		.required()
		.label('DNI'),
	name: Joi.string().required(),
	lastName: Joi.string().required(),
	phone: Joi.string()
		.regex(/^\d+$/)
		.message('applicantPhone must be a string of numbers')
		.required()
		.label('phone'),
	address: Joi.string().required(),
	location: Joi.string().required(),
	promissoryNoteQuantity: Joi.number().min(1).max(6).required()
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

const Joi = require('joi');

const schema = Joi.object({
	academicExceptionType: Joi.string().valid('1', '2', '3').required(),
	idSubject: Joi.number().optional(),
	originIdCareer: Joi.number().optional(),
	semester: Joi.number().optional(),
	year: Joi.number().optional(),
	destinationIdCareer: Joi.number().optional(),
	observations: Joi.string().required(),
	idCatedra: Joi.number().optional(),
	idCommission: Joi.number().optional()
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

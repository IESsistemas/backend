const Joi = require('joi');

const schema = Joi.object({
	dni: Joi.string()
		.regex(/^\d+$/)
		.message('DNI must be a string of numbers')
		.min(7)
		.max(8)
		.required()
		.label('DNI'),
	idArea: Joi.string().required().label('Id Area'),
	descriptionArea: Joi.string().required().label('Description Area'),
	emailArea: Joi.string().required().label('Email Area'),
	subject: Joi.string().required().label('Asunto'),
	message: Joi.string().required().label('Cuerpo del mensaje'),
	page: Joi.string().required().label('Url')

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

const Joi = require('joi');

const schema = Joi.object({
	toEmail: Joi.string().required().label('PARA'),
	fromEmail: Joi.string().required().label('DE'),
	nameFrom: Joi.string().required().label('NOMBRE DE'),
	subject: Joi.string().required().label('ASUNTO'),
	message: Joi.string().allow(null).required().label('MENSAJE'),
	salida: Joi.string().valid('S', 'N').required().label('SALIDA')
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

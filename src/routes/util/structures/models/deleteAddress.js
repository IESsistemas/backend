const Joi = require('joi');

const schema = Joi.object({
	idTipoDomi: Joi.string().valid('E', 'O').required().label('ID TIPO DOMICILIO')
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

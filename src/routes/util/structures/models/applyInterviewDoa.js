const Joi = require('joi');

const schema = Joi.object({
	tipoDoc: Joi.string().required().label('TIPO DOCUMENTO'),
	numDoc: Joi.string().required().label('NUMERO DOCUMENTO'),
	fecha: Joi.string().required().label('FECHA'),
	hora: Joi.string().required().label('HORA'),
	tipoEntrevista: Joi.string().required().label('ID TIPO ENTREVISTA')
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

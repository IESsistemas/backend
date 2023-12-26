const Joi = require('joi');

const schema = Joi.object({
	idTipoTel: Joi.string().valid('C', 'D', 'F', 'X', 'M', 'O', 'P').required().label('ID TIPO TELEFONO'),
	nroTel: Joi.string().min(10).max(30).required(),
		/*.regex(/^\d+(-\d+)?$/)
		.message('NUMERO TELEFONO must be a string of numbers')
		.required()
		.label('NUMERO TELEFONO'),*/
	observaciones: Joi.string().optional().label('OBSERVACIONES')
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

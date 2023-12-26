const Joi = require('joi');

const schema = Joi.object({
	idCarrera: Joi.string().required().label('ID CARRERA'),
	idMateria: Joi.string().required().label('ID MATERIA'),
	semestre: Joi.string().required().label('SEMESTRE'),
	year: Joi.string().required().label('AÑO'),
	presentaCertificado: Joi.string().valid('SI', 'NO').required().label('PRESENTA CERTIFICADO'),
	observaciones: Joi.string().allow('').required().label('OBSERVACIONES')
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

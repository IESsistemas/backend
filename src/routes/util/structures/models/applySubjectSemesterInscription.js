const Joi = require('joi');

const schema = Joi.object({
	idCarrera: Joi.number().required().label('ID CARRERA'),
	idCentroExtension: Joi.string().required().label('ID CENTRO EXTENSION'),
	idMateria: Joi.number().required().label('ID MATERIA'),
	idComision: Joi.number().required().label('ID COMISION'),
	idModalidad: Joi.string().valid('S', 'D', 'P').required().label('ID MODALIDAD')
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

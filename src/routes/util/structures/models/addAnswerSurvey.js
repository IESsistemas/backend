const Joi = require('joi');

const schema = Joi.object({
	idEncuesta: Joi.number().required().label('ID ENCUESTA'),
	idCtroExt: Joi.string().required().label('ID CENTRO EXTENSION'),
	idModalidad: Joi.string().required().label('ID MODALIDAD'),
	idCarrera: Joi.number().required().label('ID CARRERA'),
	idMateria: Joi.number().required().label('ID MATERIA'),
	idComision: Joi.number().required().label('ID COMISION'),
	answers: Joi.array().items(
		Joi.object({
			id_encuesta: Joi.number().required().label('ID ENCUESTA ANSWER'),
			id_pregunta: Joi.number().required().label('ID PREGUNTA ANSWER'),
			id_grupopreg: Joi.number().required().label('ID GRUPO PREGUNTA ANSWER'),
			id_respuesta: Joi.number().allow(null).required().label('ID RESPUESTA ANSWER'),
			descripcion: Joi.string().allow(null).required().label('DESCRIPCION ANSWER'),
			orden: Joi.number().required().label('ORDEN')
		})
	).required().label('RESPUESTAS')
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

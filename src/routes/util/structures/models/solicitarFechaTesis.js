const Joi = require('joi');

const schema = Joi.object({
	idCareer: Joi.string().required().label('ID CARRERA'),
	nombres: Joi.string().required().label('NOMBRES ALUMNO'),
    apellidos: Joi.string().required().label('APELLIDOS ALUMNO'),
    puesto: Joi.string().required().allow("").label('PUESTO'),
    fechaTrabajo: Joi.string().required().allow("").label('FECHA TRABAJO'),
    observacion: Joi.string().required().allow("").label('OBSERVACION'),
    fechaNacimiento: Joi.string().required().label('FECHA NACIMIENTO ALUMNO'),
    idLocalidad: Joi.string().required().label('ID LOCALIDAD'),
    dptoNac: Joi.string().required().allow("").label('DEPARTAMENTO NACIMIENTO'),
    mail: Joi.string().required().label('MAIL ALUMNO'),
    calle: Joi.string().required().label('CALLE ALUMNO'),
    torre: Joi.string().required().allow("").label('TORRE ALUMNO'),
    piso: Joi.string().required().allow("").label('PISO ALUMNO'),
    dpto: Joi.string().required().allow("").label('DEPARTAMENTO ALUMNO'),
    idBarrio: Joi.string().required().label('ID BARRIO ALUMNO'),
    codPostal: Joi.string().required().label('CODIGO POSTAL'),
	nroTP: Joi.string().required().allow("").label('NUMERO TELEFONICO PERSONAL'),
	nroTC: Joi.string().required().allow("").label('NUMERO TELEFONICO CELULAR'),
	idEmpresa: Joi.string().required().allow("").label('ID EMPRESA')
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

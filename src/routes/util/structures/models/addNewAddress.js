const Joi = require('joi');

const schema = Joi.object({
	idTipoDomi: Joi.string().valid('E', 'H', 'F', 'O').required().label('ID TIPO DOMICILIO'),
	calle: Joi.string().required().label('CALLE'),
	torre: Joi.string().required().label('TORRE'),
	piso: Joi.string().required().label('PISO'),
	dpto: Joi.string().required().label('DEPARTAMENTO'),
	idBarrio: Joi.number().required().label('ID BARRIO'),
	codigoPostal: Joi.string().required().label('CODIGO POSTAL')
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

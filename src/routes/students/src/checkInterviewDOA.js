const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		let esIngresante = false;
		let doaRealizada = false;
		let becaHabilitada = false;

		const checkDateStudent = await procedures.checkDateDOAStudent(user.tipoDni, user.dni);

		const checkNewStudent = await procedures.checkNewStudent(user.tipoDni, user.dni, 'N');

		if(!checkNewStudent.length)
			esIngresante = true;

		const checkDocumentation = await procedures.getStatusDocumentationStudent(user.tipoDni, user.dni, 'M');

		const validateDOA = await checkDocumentation.some(doc => doc.id_documentacion === 5 && doc.tipo === 'D');

		if(validateDOA)
			doaRealizada = true;

		const checkScolarship = await procedures.checkScolarship();

		if(checkScolarship.length && checkScolarship[0].beca === 'OK')
			becaHabilitada = true;

		const response = {
			idTipoEntrevista: {
				Ingreso: 1,
				Asesoramiento: 2,
				Beca: 3
			},
			turnosSolicitados: checkDateStudent,
			esIngresante,
			doaRealizada,
			becaHabilitada
		};

		return res.status(200).json({
			response, statusCode: 'SUCCESS', code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

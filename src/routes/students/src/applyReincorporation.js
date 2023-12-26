/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const validationSchema = require('../../util/structures/models/applyReincorporation');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idCarrera, idMateria, semestre, year, presentaCertificado, observaciones
	} = req.body;

	const user = req.body._login;

	try {

		const bodyToSend = {
			typeDni: user.tipoDni,
			dni: user.dni,
			idCareer: idCarrera,
			idSubject: idMateria,
			semester: semestre,
			year,
			certificate: presentaCertificado,
			observations: observaciones,
			identificator: 'A'
		};

		await Promise.all([
			procedures.applyReincorporation(bodyToSend),
			procedures.webAuditory(user.tipoDni, user.dni, 'apply-reincorporation', 'Solicitud de reincorporación', ip)
		]);

		return res.status(200).json({ message: 'Solicitud de reincorporación enviada', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validationSchema, authenticate, handler);

module.exports = { app, handler };

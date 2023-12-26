/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const validationSchema = require('../../util/structures/models/applyChangeModality');
const { sendEmail, webAuditory } = require('../../../services/procedures');
const { bodyToSend } = require('../../../../modules/email/applyChangeModality');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const { careerName } = req.body;

	const user = req.body._login;

	try {

		const dataToSend = {
			dni: user.dni,
			careerName
		};

		const emailTemplate = bodyToSend(dataToSend);

		await Promise.all([
			sendEmail(
				'croldan@ies21.edu.ar',
				'sistemas@ies21.edu.ar',
				'Web Alumnos I_Cuatri',
				`SOLICITUD CAMBIO DE MODALIDAD - Alumno: ${user.dni}`,
				emailTemplate,
				'html'
			),
			webAuditory(user.tipoDni, user.dni, 'apply-change-modality', 'Solicitud de cambio de modalidad', ip)

		]);

		return res.status(200).json({ message: 'Solicitud de cambio de modalidad enviada', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validationSchema, authenticate, handler);

module.exports = { app, handler };

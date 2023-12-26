const express = require('express');

const app = express.Router();

const validationSchema = require('../../util/structures/models/forgotPassword');
const procedures = require('../../../services/procedures');
const template = require('../../../../modules/email/suggestions');

const { STUDENT_NOT_EXISTS } = require('../../../constants/errorCodes');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		dni, idArea, descriptionArea, emailArea, subject, message, page
	} = req.body;

	try {

		const response = await procedures.checkPasswordExpiration(0, dni);

		if(!response.length)
			return res.status(200).json({ message: STUDENT_NOT_EXISTS(dni), statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const [{ nombres: name, apellidos: lastname, tipo_doc: typeDni }] = response;

		const emailUser = (await procedures.checkEmailActive(typeDni, dni))[0].E_MAIL;

		const [{ NRO_TE: phone, TIPO_TE: typePhone }] = await procedures.getStudentPhone(typeDni, dni);

		const dataToEmail = {
			idArea,
			descriptionArea,
			dni,
			name,
			lastname,
			typePhone,
			phone,
			message,
			page
		};

		const emailToSend = template(dataToEmail);

		await Promise.all([
			procedures.sendEmail(emailArea, emailUser, name, subject, emailToSend, 'html'),
			procedures.webAuditory(typeDni, dni, 'complaints-suggestions', 'Envío de reclamos/sugerencias', ip)
		]);

		return res.status(200).json({ message: 'Reclamo y/o sugerencia enviado exitosamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);

module.exports = { app, validationSchema, handler };

const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const validateApplyeInterviewDoa = require('../../util/structures/models/applyInterviewDoa');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	DATE_NO_LONGER_AVAILABLE
} = errorCodes;

const handler = async (req, res) => {

	const { ip } = req;

	const {
		tipoDoc, numDoc, fecha, hora, tipoEntrevista
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const bodyToInsert = {
			typeDniInterviewer: tipoDoc,
			dniInterviewer: numDoc,
			typeDniStudent: user.tipoDni,
			dniStudent: user.dni,
			date: fecha,
			time: hora,
			idTypeInterview: tipoEntrevista
		};

		const applyInterview = await procedures.applyInterviewDoa(bodyToInsert);

		if(applyInterview === -1 || applyInterview === -2)
			return res.status(200).json({ message: DATE_NO_LONGER_AVAILABLE, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		await procedures.webAuditory(user.tipoDni, user.dni, 'apply-interview-doa', 'Solicitud de entrevista DOA', ip);

		return res.status(200).json({ message: 'Turno solicitado correctamente.', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateApplyeInterviewDoa, authenticate, handler);

module.exports = { app, handler };

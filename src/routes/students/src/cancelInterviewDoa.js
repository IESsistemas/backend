const express = require('express');

const app = express.Router();

const validateCancelInterviewDoa = require('../../util/structures/models/cancelInterviewDoa');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;

	const {
		fecha, hora
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const bodyToInsert = {
			typeDni: user.tipoDni,
			dni: user.dni,
			date: fecha,
			time: hora,
			result: 0
		};

		await Promise.all([
			procedures.cancelInterviewDoa(bodyToInsert),
			procedures.webAuditory(user.tipoDni, user.dni, 'cancel-interview-doa', 'Cancelar solicitud de entrevista DOA', ip)
		]);

		return res.status(200).json({ message: 'Turno cancelado correctamente.', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.put('/', validateCancelInterviewDoa, authenticate, handler);

module.exports = { app, handler };

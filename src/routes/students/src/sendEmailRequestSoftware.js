const express = require('express');

const app = express.Router();

const validationSchema = require('../../util/structures/models/sendEmailRequestSoftware');
const authenticate = require('../../util/authentication/index');
const procedures = require('../../../services/procedures');
const { getRequestSoftware1, getRequestSoftware2 } = require('../../../../modules/email/requestSoftware');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		toEmail, fromEmail, nameFrom, subject, message, salida
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const { dni, nombres, apellidos, email } = user;

		let dataToEmail = {};
		let emailToSend;

		if(message) {
			dataToEmail = {
				dni,
				name: nombres.toUpperCase(),
				lastname: apellidos.toUpperCase(),
				email: email.toUpperCase(),
				message: message.toUpperCase()
			};

			emailToSend = getRequestSoftware2(dataToEmail);
		} else {
			dataToEmail = {
				dni,
				name: nombres.toUpperCase(),
				lastname: apellidos.toUpperCase(),
				email: email.toUpperCase()
			};

			emailToSend = getRequestSoftware1(dataToEmail);
		}

		if(salida === 'S') {

			await Promise.all([
				procedures.sendEmail(toEmail, fromEmail, nameFrom, subject, emailToSend, 'html'),
				procedures.webAuditory(user.tipoDni, user.dni, 'request-software', 'Envío consulta estado de pedido de software', ip)
			]);

			return res.status(200).json({ message: 'Consulta estado de pedido de software enviada correctamente', statusCode: 'SUCCESS', code: 2 });
		}

		await Promise.all([
			procedures.requestSoftware(user.tipoDni, user.dni, 13, 'P'),
			procedures.sendEmail(toEmail, fromEmail, nameFrom, subject, emailToSend, 'html'),
			procedures.webAuditory(user.tipoDni, user.dni, 'request-software', 'Envío consulta estado de pedido de software', ip)
		]);

		return res.status(200).json({ message: 'Su pedido de Software fue registrado correctamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validationSchema, authenticate, handler);

module.exports = { app, handler };

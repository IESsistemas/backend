const express = require('express');

const app = express.Router();

const validateForgotPassword = require('../../util/structures/models/forgotPassword');
const procedures = require('../../../services/procedures');

const { generateOrignalPassword } = require('../../util/studentServices');

const handler = async (req, res) => {

	const { ip } = req;
	const { dni } = req.body;

	try {

		const [student] = await procedures.checkPasswordExpiration(0, dni);

		const { tipo_doc: typeDni, pin: password } = student;

		const originalPassword = await generateOrignalPassword(dni);

		await Promise.all([
			procedures.changePassword(typeDni, dni, password, originalPassword),
			procedures.updateExpireDatePassword(typeDni, dni),
			procedures.updateDateTime(dni),
			procedures.webAuditory(typeDni, dni, 'forgot-password', 'Reestablecimiento de contraseña a la original', ip)
		]);

		return res.status(200).json({ message: 'Contraseña reestablecida', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);

module.exports = { app, validateForgotPassword, handler };

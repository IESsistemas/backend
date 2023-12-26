const express = require('express');

const app = express.Router();

const validateAddNewEmail = require('../../util/structures/models/addNewEmail');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const { newEmail } = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		await Promise.all([
			procedures.addNewEmailStudent(user.tipoDni, user.dni, 'I', newEmail, 's'),
			procedures.webAuditory(user.tipoDni, user.dni, 'add-new-email-student', 'Agregar/Modificar email estudiante', ip)
		]);

		return res.status(200).json({ message: 'Email añadido correctamente, revise su casilla de correos', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateAddNewEmail, authenticate, handler);

module.exports = { app, handler };

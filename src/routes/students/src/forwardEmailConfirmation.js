const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	try {
		// eslint-disable-next-line no-underscore-dangle
		const user = req.body._login;

		await procedures.forwardEmailConfirmation(user.dni);

		return res.status(200).json({ message: 'Email enviado, revise su casilla de correos', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

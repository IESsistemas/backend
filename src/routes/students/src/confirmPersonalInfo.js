const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		await Promise.all([
			procedures.updateDateTime(user.dni),
			procedures.webAuditory(user.tipoDni, user.dni, 'confirm-personal-info', 'Actualización fecha modificación datos personales', ip)
		]);

		return res.status(200).json({ message: 'Datos personales confirmados', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.put('/', authenticate, handler);

module.exports = { app, handler };

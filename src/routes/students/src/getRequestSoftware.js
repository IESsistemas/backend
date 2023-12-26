const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const userRequestSofware = await procedures.getRequestSoftware(user.tipoDni, user.dni, 13);

		if(userRequestSofware[0].salida === 'S') {
			return res.status(200).json({
				message: 'Usted ya tiene un pedido de software en gestión, a la brevedad recibirá un correo electrónico con más instrucciones.',
				userRequestSofware,
				statusCode: 'SUCCESS',
				code: 2
			});
		}

		return res.status(200).json({ userRequestSofware, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

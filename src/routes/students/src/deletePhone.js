const express = require('express');

const app = express.Router();

const validateDeletePhone = require('../../util/structures/models/deletePhone');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idTipoTel
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		await Promise.all([
			procedures.deletePhone(user.tipoDni, user.dni, idTipoTel),
			procedures.webAuditory(user.tipoDni, user.dni, 'delete-phone', `Se ha eliminado teléfono tipo: ${idTipoTel}`, ip)
		]);

		return res.status(200).json({ message: 'Teléfono eliminado correctamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.delete('/', validateDeletePhone, authenticate, handler);

module.exports = { app, handler };

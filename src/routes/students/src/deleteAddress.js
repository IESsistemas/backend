const express = require('express');

const app = express.Router();

const validateDeleteAddress = require('../../util/structures/models/deleteAddress');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idTipoDomi
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		await Promise.all([
			procedures.deleteAddress(user.tipoDni, user.dni, idTipoDomi),
			procedures.webAuditory(user.tipoDni, user.dni, 'delete-address', `Se ha eliminado domicilio tipo: ${idTipoDomi}`, ip)
		]);

		return res.status(200).json({ message: 'Domicilio eliminado correctamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.delete('/', validateDeleteAddress, authenticate, handler);

module.exports = { app, handler };

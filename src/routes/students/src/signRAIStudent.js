const express = require('express');

const app = express.Router();

const validationSchema = require('../../util/structures/models/signRai');
const authenticate = require('../../util/authentication/index');
const procedures = require('../../../services/procedures');
const { encode } = require('../../util/jwt/jsonWebToken');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		tipo, page
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		await Promise.all([
			procedures.signRaiStudent(user.tipoDni, user.dni, tipo),
			procedures.webAuditory(user.tipoDni, user.dni, page, 'Firma RAI alumno', ip)
		]);

		user.reglamentoAlumnoPendiente = false;
		const newToken = encode(user);

		return res.status(200).json({ message: 'RAI firmado correctamente', statusCode: 'SUCCESS', newToken, code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validationSchema, authenticate, handler);

module.exports = { app, handler };

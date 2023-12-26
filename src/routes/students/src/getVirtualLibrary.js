/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const { getVirtualLibrary } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { idCareer } = req.params;

	const user = req.body._login;

	try {

		const virtualLibraryToGet = await getVirtualLibrary(user.tipoDni, user.dni, idCareer);

		const virtualLibrary = [...new Set(virtualLibraryToGet
			.map(({ NOMBRE_MAT, WEBMOVILES }) => JSON.stringify({ NOMBRE_MAT, WEBMOVILES })))]
			.map(item => JSON.parse(item));

		return res.status(200).json({
			virtualLibrary, statusCode: 'SUCCESS', code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const {
	getDetalleInscripcionExamen
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;

	const { idCareer } = req.params;

	try {
		const getDetail = await getDetalleInscripcionExamen({typeDni, dni, idCareer});

		return res.status(200).json( {
			detalleMateriasInscriptas: getDetail
		});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

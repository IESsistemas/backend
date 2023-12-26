/* eslint-disable no-underscore-dangle */
const express = require('express');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const app = express.Router();

const handler = async (req, res) => {

	const { dni } = req.body._login;

	const { fileName } = req.query;
	try {

		const examenes = await procedures.getModelosExamen(dni);

		const modelToDownload = examenes.find(examen => examen.ARCHIVO === fileName);

		if(!modelToDownload)
			return res.status(404).json({ message: `No se encontro un modelo de examen con el nombre: ${fileName}` });

		const urlToDownload = `${process.env.HOST}/ModelosExamen/${fileName}`;

		return res.json({ urlToDownload });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

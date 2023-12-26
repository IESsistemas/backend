/* eslint-disable no-underscore-dangle */
const express = require('express');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const app = express.Router();

const handler = async (req, res) => {
	const { dni } = req.body._login;

	try {

		const examenes = await procedures.getModelosExamen(dni);

		return res.json(examenes);

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

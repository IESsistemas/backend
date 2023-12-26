/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication/index');
const procedures = require('../../../services/procedures');
const { getFirstElement } = require('../../util/arrayUtil');

const handler = async (req, res) => {
	try {
		const { dni, tipoDni: typeDni } = req.body._login;

		const codigoBarra = await procedures.generateRapipagoTicket({ typeDni, dni });

		return res.json({ code: getFirstElement(Object.values(codigoBarra)) });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {
	const { dni } = req.body._login;
	try {

		const rejectedPayments = await procedures.getProcessingPayments(dni);
		const rejectedPaymentsFormatted = rejectedPayments.map(({ FechaCarga, Nombretitular, Importe }) => ({ FechaCarga, Nombretitular, Importe }));

		return res.status(200).json(rejectedPaymentsFormatted);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

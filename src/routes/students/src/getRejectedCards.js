/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;
	try {
		const rejectedPayments = await procedures.getRejectedCards({ dni, typeDni });

		return res.status(200).json(rejectedPayments);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

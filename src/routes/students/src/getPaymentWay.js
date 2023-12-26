const express = require('express');

const app = express.Router();

const { getPaymentWay } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	try {

		const typesOfPayments = await getPaymentWay('AA');

		return res.status(200).json({
			typesOfPayments,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

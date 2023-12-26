const express = require('express');

const app = express.Router();

const { getPaymentMethodByType } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const PROMISSORY_NOTE = 'PA';

const handler = async (req, res) => {

	try {
		const surchasePromissoryNote = await getPaymentMethodByType(PROMISSORY_NOTE);

		return res.status(200).json(surchasePromissoryNote);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

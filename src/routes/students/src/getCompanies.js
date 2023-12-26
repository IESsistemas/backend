const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');

const handler = async (req, res) => {

	try {

		const companies = await procedures.getCompanies();

		return res.status(200).json({ companies, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };

const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');

const { NO_COUNTRIES } = errorCodes;

const handler = async (req, res) => {

	try {

		const countries = await procedures.getCountries();

		if(!countries.length)
			return res.status(200).json({ message: NO_COUNTRIES, statusCode: 'NO_COUNTRIES', code: 1 });

		return res.status(200).json({ countries, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };

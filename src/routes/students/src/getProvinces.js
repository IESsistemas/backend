const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');

const { NO_PROVINCE_FOUNDED } = errorCodes;

const handler = async (req, res) => {

	const { idPais } = req.params;

	try {

		const provinces = await procedures.getProvinces(idPais);

		if(!provinces.length)
			return res.status(200).json({ message: NO_PROVINCE_FOUNDED(idPais), statusCode: 'VALIDATIONS_FAILED', code: 1 });

		return res.status(200).json({ provinces, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idPais', handler);

module.exports = { app, handler };

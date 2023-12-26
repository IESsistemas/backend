const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');

const { NO_NEIGHBORHOOD_FOUNDED } = errorCodes;

const handler = async (req, res) => {

	const { idLocalidad } = req.params;

	try {

		const neighborhoods = await procedures.getNeighbours(idLocalidad);

		if(!neighborhoods.length)
			return res.status(200).json({ message: NO_NEIGHBORHOOD_FOUNDED(idLocalidad), statusCode: 'VALIDATIONS_FAILED', code: 1 });

		return res.status(200).json({ neighborhoods, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idLocalidad', handler);

module.exports = { app, handler };

const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');

const { NO_LOCALITY_FOUNDED } = errorCodes;

const handler = async (req, res) => {

	const { idProvincia } = req.params;

	try {

		const localities = await procedures.getLocalities(idProvincia);

		if(!localities.length)
			return res.status(200).json({ message: NO_LOCALITY_FOUNDED(idProvincia), statusCode: 'VALIDATIONS_FAILED', code: 1 });

		return res.status(200).json({ localities, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idProvincia', handler);

module.exports = { app, handler };

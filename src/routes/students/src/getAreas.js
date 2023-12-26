const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');

const { NO_AREAS } = errorCodes;

const handler = async (req, res) => {

	const { area } = req.params;

	try {

		const areas = await procedures.getAreas(area);

		if(!areas.length)
			return res.status(200).json({ message: NO_AREAS(area), statusCode: 'NO_AREAS', code: 1 });

		return res.status(200).json({ areas, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:area', handler);

module.exports = { app, handler };

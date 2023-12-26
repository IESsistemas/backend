const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');

const { NO_AREAS } = errorCodes;

const handler = async (req, res) => {

	const { tipoComp, num, tipo, fecha, nCuenta, pVta, tipoDoc, doc } = req.body;

	try {

		const areas = await procedures.getInfoRecivo({ tipoComp, num, tipo, fecha, nCuenta, pVta, tipoDoc, doc });

		if(!areas.length)
			return res.status(200).json({ message: NO_AREAS(area), statusCode: 'NO_AREAS', code: 1 });

		return res.status(200).json({ areas, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', handler);

module.exports = { app, handler };

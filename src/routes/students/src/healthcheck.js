const express = require('express');
const app = express.Router();
const procedures = require('../../../services/procedures');

const handler = async (req, res) => {
	try {
		const serverStatus = await procedures.healthcheck();

        if(serverStatus?.Valor === 1) return res.status(200).json({ message: 'SERVIDOR EN MANTENIMIENTO', code: 1 });

		return res.status(200).json({ message: 'SERVIDOR OK', code: 2 });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', handler);

module.exports = { app, handler };

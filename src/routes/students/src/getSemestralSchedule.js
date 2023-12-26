/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const { getSemestralSchedule } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	try {

		const [semestralSchedule] = await getSemestralSchedule();

		const response = {
			title: Object.fromEntries(Object.entries(semestralSchedule).slice(1, 2)),
			bloque1: Object.fromEntries(Object.entries(semestralSchedule).slice(2, 4)),
			bloque2: Object.fromEntries(Object.entries(semestralSchedule).slice(4, 14)),
			bloque3: Object.fromEntries(Object.entries(semestralSchedule).slice(14, 31)),
			bloque4: Object.fromEntries(Object.entries(semestralSchedule).slice(31, 33)),
			bloque5: Object.fromEntries(Object.entries(semestralSchedule).slice(35, 37))
		};

		return res.status(200).json({
			response, statusCode: 'SUCCESS', code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');
const { groupByCriteria } = require('../../util/arrayUtil');

const {
	NO_DATES_AVAILABLE
} = errorCodes;

function translateDayName(dayName) {
	switch(dayName) {
		case 'Monday':
			return 'Lunes';
		case 'Tuesday':
			return 'Martes';
		case 'Wednesday':
			return 'Miércoles';
		case 'Thursday':
			return 'Jueves';
		case 'Friday':
			return 'Viernes';
		// Agrega más casos según sea necesario
		default:
			return dayName;
	}
}

const handler = async (req, res) => {

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const checkAvailability = await procedures.getInterviewDoaAvailable(user.tipoDni, user.dni);

		if(!checkAvailability.length)
			return res.status(200).json({ message: NO_DATES_AVAILABLE, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const modifiedAvailability = checkAvailability.map(item => {
			const nombredia = translateDayName(item.nombredia);
			return { ...item, nombredia };
		});

		return res.status(200).json({ modifiedAvailability: groupByCriteria(modifiedAvailability, 'nombredia'), statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

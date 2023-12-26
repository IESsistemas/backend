/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	NO_ABSENSE_REGISTERED
} = errorCodes;

const handler = async (req, res) => {

	const { idCarrera } = req.params;

	const user = req.body._login;

	try {

		const absenses = await procedures.getAbsence(idCarrera, user.tipoDni, user.dni, 'W');

		if(!absenses.length)
			return res.status(200).json({ message: NO_ABSENSE_REGISTERED, statusCode: 'SUCCESS', code: 2 });

		for(const currentAbsense of absenses) {

			const dateAbsenses = await procedures.getDateAbsence(
				currentAbsense.ID_MATERIA,
				user.tipoDni,
				user.dni,
				currentAbsense.SEMESTRE,
				currentAbsense.AÑO
			);

			currentAbsense.FECHAS_FALTAS = dateAbsenses;
		}

		return res.status(200).json({
			message: 'Inasistencias registradas.',
			absenses,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCarrera', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');

const { searchAcademicExceptions } = require('../../../services/procedures');
const { getTodayInGMT } = require('../../util/dateUtil');
const { getAcademicExceptionsByType } = require('../../util/academicExceptionsUtil');
const { groupByCriteria } = require('../../util/arrayUtil');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;
	const { idCareer } = req.query;
	const { academicExceptionType } = req.params;

	try {
		const inscriptionsDates = await searchAcademicExceptions();
		const today = getTodayInGMT();

		if(!(today >= inscriptionsDates.InInsCua && today <= inscriptionsDates.FinInsCua))
			return res.json({ message: 'PERÍODO DE INSCRIPCION CERRADO' });

		const academicExceptions = await getAcademicExceptionsByType[academicExceptionType]({
			semester: inscriptionsDates.Semestre, year: inscriptionsDates.Año, typeDni, dni, idCareer
		});

		const response = academicExceptionType === '2' || academicExceptionType === '3' ?
			groupByCriteria(academicExceptions, 'Materia') :
			academicExceptions;
		return res.status(200).json(response);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/:academicExceptionType', authenticate, handler);

module.exports = { app, handler };

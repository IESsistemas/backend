/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const { getActualDate, checkCareers, getScolarshipHistory } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { idCareer } = req.params;

	const user = req.body._login;

	try {

		const [actualDate, careerInfo, [{ Cantidad: quantity }], getLastSubjectsOnCurse] = await Promise.all([
			getActualDate(),
			checkCareers(user.tipoDni, user.dni, idCareer),
			getScolarshipHistory(user.tipoDni, user.dni, idCareer, 'H'),
			getScolarshipHistory(user.tipoDni, user.dni, idCareer, 'M')
		]);

		const studentData = {
			alumno: user.apellidos + ', ' + user.nombres,
			dni: user.dni,
			modalidad: careerInfo.ID_MODALIDAD_DOA,
			centroExt: careerInfo.ID_CTROEXT_DOA,
			carrera: careerInfo.DESCRIPCION,
			cuatrimestre: careerInfo.CUAT
		};

		const scolarshipHistory = {
			obtuvoBecas: 'No',
			cantidad: 0
		};

		if(quantity > 0) {
			scolarshipHistory.obtuvoBecas = 'Si';
			scolarshipHistory.cantidad = quantity;
		}

		const lastSubjectsOnCurse = getLastSubjectsOnCurse.map(({
			SEM, AÑO, MATERIA, REG, nota
		}) => ({
			SEM, YEAR: AÑO, MATERIA, CONDITION: REG + '/ Nota: ' + nota
		}));

		return res.status(200).json({
			response: { actualDate, studentData, scolarshipHistory, lastSubjectsOnCurse }, statusCode: 'SUCCESS', code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const authenticate = require('../../util/authentication/index');
const { getStudentCalendar, checkCareer } = require('../../../services/procedures');
const { HAS_NO_CAREERS_ASSIGNED } = require('../../../constants/errorCodes');
const {
	getFirstElement, groupByDays, sortSubject
} = require('../../util/arrayUtil');

// const validate = require('../../util/structures/models/subjectSchedule');
const { parseDay } = require('../../util/dateUtil');

const app = express.Router();

const findCareerByID = (careers, id) => careers.filter(career => career.ID_CARRERA === id);

const handler = async (req, res) => {

	const { tipoDni, dni } = req.body._login;
	const { idCareer } = req.params;
	const id = +idCareer;

	try {

		const dataStudent = await checkCareer(tipoDni, dni);

		if(!dataStudent.length)
			return res.status(404).json({ message: HAS_NO_CAREERS_ASSIGNED, success: 'NOT FOUND', code: 1 });

		const career = findCareerByID(dataStudent, id);

		if(!career.length)
			return res.status(404).json({ message: `La carrera con el ID: ${id} no se encuentra`, success: 'NO FOUNT', code: 1 });

		const { ID_CARRERA, Años } = getFirstElement(career);

		const dataToGetCalendar = modalidad => ({
			typeDni: tipoDni,
			dni,
			idCareer: ID_CARRERA,
			variable: modalidad,
			years: Años
		});

		const studentCalendarModalidadP = await getStudentCalendar(dataToGetCalendar('P'));
		const studentCalendarModalidadS = await getStudentCalendar(dataToGetCalendar('S'));
		const studentCalendarModalidadD = await getStudentCalendar(dataToGetCalendar('D'));

		const studentCalendar = [
			...studentCalendarModalidadD,
			...studentCalendarModalidadP,
			...studentCalendarModalidadS
		].map(data => ({ ...data, DIA: parseDay[data.DIA] }));

		const subjectCareerByDays = groupByDays(studentCalendar);

		sortSubject(subjectCareerByDays);

		res.status(200).json({ groupedDays: subjectCareerByDays, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.message });
	}
};

app.post('/:idCareer', /* validate,*/ authenticate, handler);

module.exports = { app, handler };

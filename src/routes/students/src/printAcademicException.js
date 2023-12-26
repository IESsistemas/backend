/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');
const { getStudentName, checkCareers, getAcademicExceptionToConditionalCourse } = require('../../../services/procedures');
const { getFirstElement } = require('../../util/arrayUtil');

const handler = async (req, res) => {

	const { dni, tipoDni: typeDni } = req.body._login;
	const { idCareer } = req.body;

	const { NOMBRES, APELLIDOS } = await getStudentName({ typeDni, dni });
	const { ID_MODALIDAD, DESCRIPCION } = getFirstElement(await checkCareers(typeDni, dni, idCareer));
	const {
		Nro_Te, E_mail, Materia, Carrera_d, Carrera_o, COMISION, TURNO, Nombre, Fecha_Aut
	} = getFirstElement(await getAcademicExceptionToConditionalCourse(typeDni, dni, idCareer, 'I', 1, 2023));

	const dataToGeneratePfd = {
		studentName: NOMBRES,
		studentLastName: APELLIDOS,
		careerName: DESCRIPCION,
		idModalidad: ID_MODALIDAD,
		exceptionData: {
			phoneNumber: Nro_Te,
			email: E_mail,
			subject: Materia,
			destinyCareer: Carrera_d,
			originCareer: Carrera_o,
			commission: COMISION,
			turn: TURNO,
			exceptionName: Nombre,
			authorizationDate: Fecha_Aut
		}
	};

	return res.status(200).json(dataToGeneratePfd);
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');

const {
	searchAcademicExceptions, getSubjectsExceptions, getStudentName, checkCareers, getAcademicExceptionToConditionalCourse
} = require('../../../services/procedures');
const { getTodayInGMT } = require('../../util/dateUtil');
const { getFirstElement } = require('../../util/arrayUtil');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;
	const { idCareer } = req.query;

	try {
		const inscriptionsDates = await searchAcademicExceptions();
		const today = getTodayInGMT();

		if(!(today >= inscriptionsDates.InInsCua && today <= inscriptionsDates.FinInsCua))
			return res.json({ message: 'PERÍODO DE INSCRIPCION CERRADO' });

		const subjectsExceptions = await getSubjectsExceptions(typeDni, dni);

		const formattedSubjectsExceptions = subjectsExceptions.map(item => {
			const {
				Materia, TIPO_ECXEP, ESTADO_EXEP, Fecha_solicitud, Observaciones_academicas
			} = item;

			if(ESTADO_EXEP === 'NEGADA') {
				return {
					Materia,
					TIPO_ECXEP,
					ESTADO_EXEP,
					Fecha_solicitud,
					Observaciones_academicas
				};
			}
			if(ESTADO_EXEP === 'ACEPTADA' && TIPO_ECXEP === 'CURSADO EN OTRA CARRERA') {
				return {
					Materia,
					TIPO_ECXEP,
					ESTADO_EXEP,
					Fecha_solicitud,
					botonImprimir: true,
					message: 'Solo puede imprimir la excepción al archivo en otra carrera una vez que sea ACEPTADO. Una vez impreso deberás presentarlo en Bedelia'
				};
			}
			return item;
		});

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

		const response = {
			academicExceptionsProcessed: formattedSubjectsExceptions,
			print: dataToGeneratePfd
		};

		return res.status(200).json(response);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

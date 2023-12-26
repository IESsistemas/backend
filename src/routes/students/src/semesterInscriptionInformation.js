/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const {
	getControlDataSemester,
	getControlHabilitationInscriptionSemester,
	getDocumentationFile,
	checkInhabilitation,
	getMaxValueRegister,
	getSubjectsAvailablesToCourse,
	getModalityCourse,
	getSubjectsPreEnrolled,
	getSubjectsEnrolled,
	getModalityChangeAvailable
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	PERIOD_INSCRIPTION_CUATRIMESTRAL_INHABILITATED,
	PERIOD_MODIFIE_INSCRIPTION_INHABILITATED,
	PENDING_DOCUMENTATION,
	STUDENT_INHABILITATION,
	NO_SUBJECTS_ENROLLED_FOUNDED,
	PROCESS_ALREADY_IN_COURSE
} = errorCodes;

const { setResponseValue } = require('../../util/functions/setStatus');

const handler = async (req, res) => {

	const { idCareer } = req.params;

	const user = req.body._login;

	try {

		const { Paso: value } = await getControlDataSemester({ typeDni: user.tipoDni, dni: user.dni });

		if(setResponseValue[value])
			return setResponseValue[value](res);

		const { HABITOWEBINSCRI: periodInscription, HABITOWEBMODIFINSCRI: modifiePeriodInscription } = await getControlHabilitationInscriptionSemester();

		if(periodInscription === 'N')
			return res.status(200).json({ message: PERIOD_INSCRIPTION_CUATRIMESTRAL_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		if(modifiePeriodInscription === 'x')
			return res.status(200).json({ message: PERIOD_MODIFIE_INSCRIPTION_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const checkUserDocumentation = await getDocumentationFile(user.tipoDni, user.dni);

		if(checkUserDocumentation !== 'P')
			return res.status(200).json({ message: PENDING_DOCUMENTATION, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const checkUserInhabilitation = await checkInhabilitation(user.tipoDni, user.dni, 'S');

		if(checkUserInhabilitation.length)
			return res.status(200).json({ message: STUDENT_INHABILITATION, checkUserInhabilitation, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const registrationFee = await getMaxValueRegister();

		const userBody = {
			typeDni: user.tipoDni,
			dni: user.dni,
			idCareer
		};

		const changeModalityAvailable = {
			availableToChange: true
		};

		const changeModalityAvailableResponse = await getModalityChangeAvailable(user.tipoDni, user.dni);

		if(changeModalityAvailableResponse.length) {
			changeModalityAvailable.availableToChange = false;
			changeModalityAvailable.message = PROCESS_ALREADY_IN_COURSE;
		}

		const typesOfModalityAvailables = await getModalityCourse(userBody);

		const subjectsAvailablesToCourse = await getSubjectsAvailablesToCourse(userBody);

		const subjectsPreEnrolled = await getSubjectsPreEnrolled({ ...userBody, shortCourse: null, whereUse: 'W' });

		subjectsPreEnrolled.unshift({ message: NO_SUBJECTS_ENROLLED_FOUNDED });

		const subjectsEnrolled = await getSubjectsEnrolled({ ...userBody, idetinf: null, whereUse: 'W' });

		return res.status(200).json({
			changeModalityAvailable,
			registrationFee,
			typesOfModalityAvailables,
			subjectsAvailablesToCourse,
			subjectsPreEnrolled,
			subjectsEnrolled,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');
const { sendAcademicException } = require('../../../services/procedures');
const validateSendAcademicException = require('../../util/structures/models/sendAcademicException');
const { handdleDuplicateError } = require('../../util/errorUtil');
const { getParametersByExceptionType } = require('../../util/exceptionUtil');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;
	const {
		academicExceptionType, idSubject, originIdCareer, destinationIdCareer, semester, year, observations, idCatedra, idCommission
	} = req.body;

	const dataToSend = {
		typeDni,
		dni,
		idSubject,
		semester,
		year,
		observations,
		...getParametersByExceptionType[academicExceptionType]({ originIdCareer, destinationIdCareer, idCatedra, idCommission })
	};

	try {
		const test = await sendAcademicException(dataToSend);
		console.log('🚀 ~ file: sendAcademicException.js:30 ~ handler ~ test:', test);
		return res.json({ message: 'Excepcion enviada', code: 2 });
	} catch(error) {
		console.log('🚀 ~ file: sendAcademicException.js:33 ~ handler ~ error:', error);
		if(handdleDuplicateError)
			return res.status(400).json({ message: 'Ya existe una excepcion enviada con estas caracteristicas.', code: 1 });

		return res.status(500).json({ message: error.message, code: 1 });
	}
};

app.post('/', validateSendAcademicException, authenticate, handler);

module.exports = { app, handler };

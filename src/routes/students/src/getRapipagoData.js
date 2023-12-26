/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication/index');
const procedures = require('../../../services/procedures');

const handler = async (req, res) => {
	try {
		const { dni, tipoDni: typeDni } = req.body._login;
		const { idCareer } = req.params;

		const studentData = await procedures.getStudentName({ dni, typeDni });

		const materiasPreinscriptas = await procedures.getSubjectsPreEnrolled({
			typeDni, dni, idCareer, shortCourse: null, whereUse: 'W'
		});

		const valorMatricula = await procedures.getValorMatricula({ dni, typeDni, idCareer });

		return res.json({ materiasPreinscriptas, studentData, valorMatricula: valorMatricula.VALOR_MATRICULA });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

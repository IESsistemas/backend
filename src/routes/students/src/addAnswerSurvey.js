const express = require('express');

const app = express.Router();

const validateAddAnswerSurvey = require('../../util/structures/models/addAnswerSurvey');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idEncuesta, idCtroExt, idModalidad, idCarrera, idMateria, idComision, answers
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const bodyToInsertSurvey = {
			idEncuesta,
			idCtroExt,
			idModalidad,
			idCarrera,
			idMateria,
			idComision,
			typeDni: user.tipoDni,
			dni: user.dni
		};

		const surveyInserted = await procedures.insertSurveyData(bodyToInsertSurvey);

		const idEncuestaRespuesta = surveyInserted.codigo;

		for(const currentAnswer of answers) {

			const bodyToInsertAnswer = {
				idEncuestaRespuesta,
				idEncuesta: currentAnswer.id_encuesta,
				idPregunta: currentAnswer.id_pregunta,
				idGrupoPreg: currentAnswer.id_grupopreg,
				idRespuesta: currentAnswer.id_respuesta,
				observacion: currentAnswer.descripcion,
				orden: currentAnswer.orden
			};

			await procedures.insertSurveyAnswer(bodyToInsertAnswer);
		}

		await procedures.webAuditory(user.tipoDni, user.dni, 'add-answer-survey', `Ingresó encuesta id : ${idEncuesta}`, ip);

		return res.status(200).json({ message: 'Encuesta respondida satisfactoriamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateAddAnswerSurvey, authenticate, handler);

module.exports = { app, handler };

const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { idSurvey } = req.params;

	try {

		const userPendingSurveys = await procedures.getGroupQuestionsSurvey(idSurvey);

		for(const currentTypeQuestion of userPendingSurveys) {

			const questions = await procedures.getQuestions(idSurvey, currentTypeQuestion.id_grupopreg);

			currentTypeQuestion.questions = questions;

			for(const currentQuestion of questions) {

				if(currentQuestion.tipo === 'U' || currentQuestion.tipo === 'M') {
					const answers = await procedures.getAnswers(idSurvey, currentTypeQuestion.id_grupopreg, currentQuestion.id_pregunta);

					currentQuestion.answers = answers;
				}

			}
		}

		return res.status(200).json({ userPendingSurveys, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idSurvey', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const { getExamModel } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	DOWNLOAD_INHABILITATED
} = errorCodes;

const handler = async (req, res) => {
	const { idCareer } = req.params;
	const user = req.body._login;

	try {
		const exams = await getExamModel({ typeDni: user.tipoDni, dni: user.dni, idCareer, identit: 'B' });

		if(!exams.length)
			return res.status(200).json({ message: DOWNLOAD_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		return res.status(200).json(exams);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const userPendingSurveys = await procedures.checkSurvey(user.tipoDni, user.dni);

		return res.status(200).json({ userPendingSurveys, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {
	try {
		const { dni, tipoDni: typeDni } = req.body._login;
		const messages = await procedures.getMessages({ dni, typeDni });

		return res.status(200).json(messages);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('', authenticate, handler);

module.exports = { app, handler };

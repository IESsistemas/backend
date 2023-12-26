const express = require('express');

const app = express.Router();
const authenticate = require('../../util/authentication/index');


const handler = async (req, res) => {
	try {
		return res.status(200).json({ message: 'Login exitoso!', data: req.body._login, statusCode: 'SUCCESS', code: 2 });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.get('/', authenticate, handler);

module.exports = { app, handler };

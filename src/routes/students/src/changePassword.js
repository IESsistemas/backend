const express = require('express');

const app = express.Router();

const validatePassword = require('../../util/structures/models/validatePassword');
const validateChangePassword = require('../../util/structures/models/changePassword');
const authenticate = require('../../util/authentication/index');
const { changePassword } = require('../../util/studentServices');

const handler = async (req, res) => {

	try {
		const { user } = req;

		await changePassword(user);

		return res.status(200).json({ message: 'Credenciales cambiadas', statusCode: 'SUCCESS', code: 2 });
	} catch(error) {
		return res.status(500).json({ message: error.message });
	}
};

app.post('/', validateChangePassword, authenticate, validatePassword, handler);

module.exports = { app, handler };

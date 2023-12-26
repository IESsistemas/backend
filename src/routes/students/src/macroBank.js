/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express.Router();
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;
	const { ip } = req;
	const { amount } = req.body;

	try {

		const bodyFormData = new FormData();

		bodyFormData.append('inputTipo_Doc', `${typeDni}`);
		bodyFormData.append('inputNum_Doc', `${dni}`);
		bodyFormData.append('inputIp', `${ip}`);
		bodyFormData.append('inputImporte', amount);

		const response = await axios({
			method: 'post',
			url: 'https://macroclikpago.ies21.edu.ar/ClickBancoMacro.php',
			data: bodyFormData,
			headers: { 'Content-Type': 'multipart/form-data' }
		});

		return res.send(response.data);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

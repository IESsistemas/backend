/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const validateGeneratePromissoryNote = require('../../util/structures/models/generatePromissoryNote');
const { generatePromissoryNote, webAuditory } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const {
		applicantDni, name, lastName, phone, address, location, promissoryNoteQuantity
	} = req.body;

	const { tipoDni: typeDni, dni } = req.body._login;

	try {
		await generatePromissoryNote({
			dni, name, lastName, phone, address, location, promissoryNoteQuantity, applicantDni, typeDni
		});

		await webAuditory(typeDni, dni, 'generate-promissory-note', 'generate-promissory-note');

		return res.status(200).json({ message: 'Pagare generado', code: 2 });
	} catch(error) {
		return res.status(500).json({ message: error.toString(), code: 1 });
	}
};

app.post('/', validateGeneratePromissoryNote, authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-unused-expressions */
const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	try {

		// eslint-disable-next-line no-underscore-dangle
		const user = req.body._login;

		const [{ alumno: student, num_doc: dni, CODIGOBARRA: barCode }] = await procedures.checkPasswordExpiration(user.tipoDni, user.dni);
		const [{ foto_alumno: photo }] = await procedures.getStudent(user.tipoDni, user.dni);

		const credentialInfo = {
			student, dni, barCode
		};

		return res.status(200).json({
			credentialInfo, statusCode: 'SUCCESS', code: 2, photo: photo?("data:image/jpeg;base64,"+photo.toString('base64')):null
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

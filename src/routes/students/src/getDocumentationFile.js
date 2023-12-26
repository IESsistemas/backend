/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');
const { setStatus } = require('../../util/functions/setStatus');

const {
	NO_DOCUMENTATION_OWED
} = errorCodes;

const handler = async (req, res) => {

	const { idCarrera } = req.params;

	const user = req.body._login;

	try {

		const [getDocumentationFile, documentation] = await Promise.all([
			procedures.getDocumentationFile(user.tipoDni, user.dni, idCarrera),
			procedures.getStatusDocumentationStudent(user.tipoDni, user.dni, 'W')
		]);

		// if(getDocumentationFile === 'P')
		// 	return res.status(200).json({ message: NO_DOCUMENTATION_OWED, statusCode: 'SUCCESS', code: 2 });

		for(const document of documentation) {
			if(document.tipo_documentacion === 'T' && setStatus[document.tipo])
				setStatus[document.tipo](document);
			else
				document.estado = 'Adeuda';
		}

		return res.status(200).json({
			message: getDocumentationFile !== 'P' ?
				'Para poder realizar el trámite de Inscripción se debe completar la Documentación Adeudada.' :
				NO_DOCUMENTATION_OWED,
			documentation,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCarrera', authenticate, handler);

module.exports = { app, handler };

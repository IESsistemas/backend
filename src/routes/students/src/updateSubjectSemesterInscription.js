/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const validationSchema = require('../../util/structures/models/applySubjectSemesterInscription');
const { updateSubjectSemesterInscription, insertRegistration, webAuditory } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idCarrera, idCentroExtension, idMateria, idComision, idModalidad
	} = req.body;

	const user = req.body._login;

	try {

		const bodyToSend = {
			typeDni: user.tipoDni,
			dni: user.dni,
			idCareer: idCarrera,
			idSubject: idMateria
		};

		await Promise.all([
			updateSubjectSemesterInscription({
				...bodyToSend,
				idExtensionCenter: idCentroExtension,
				idCommission: idComision,
				idModality: idModalidad
			}),
			insertRegistration(user.tipoDni, user.dni, idCarrera),
			webAuditory(user.tipoDni, user.dni, 'update-subject-semester-inscription', 'Actualización de materia inscripta/preinscripta a semestre', ip)
		]);

		return res.status(200).json({ message: 'Solicitud actualizada', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.put('/', validationSchema, authenticate, handler);

module.exports = { app, handler };

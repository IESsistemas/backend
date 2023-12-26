/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const { getExamModel, insertTableFile, webAuditory } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	DOWNLOAD_INHABILITATED
} = errorCodes;

const handler = async (req, res) => {
	const user = req.body._login;
	const { ip } = req;
	const { idModelo, idMesa, idCarrera } = req.body;

	try {
		const exams = await getExamModel({ typeDni: user.tipoDni, dni: user.dni, idCareer: idCarrera, identit: 'B' });

		if(!exams.length)
			return res.status(200).json({ message: DOWNLOAD_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const examToDownload = exams.find(({ ID_MESA, ID_MODELO }) => ID_MESA === idMesa && ID_MODELO === idModelo);

		if(!examToDownload)
			return res.status(200).json({ message: 'Examen no encontrado', statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const downloadRoute = `${process.env.HOST}/modelosExamen/${examToDownload.NOMBRE_ARCHIVO}`;

		Promise.all([
			await insertTableFile({
				typeDni: user.tipoDni,
				dni: user.dni,
				idTable: examToDownload.ID_MESA,
				idModel: examToDownload.ID_MODELO,
				nameFile: `${examToDownload.ID_MESA}-${user.dni}.${examToDownload.ext}`,
				identit: 'B'
			}),
			await webAuditory(
				user.tipoDni,
				user.dni,
				'exams-cies/download/',
				'Alumno dni: ' + user.dni +
                ' *id_mesa: ' + examToDownload.ID_MESA +
                ' *id_modelo: ' + examToDownload.id_modelo +
                ' *Bajo Examen Nombre Archivo: ' + examToDownload.NOMBRE_ARCHIVO +
                ' *Nombre Archivo Armado: ' + downloadRoute +
                ' *Año Turno: ' + examToDownload.ANIOTURNO +
                ' *Periodo Turno: ' + examToDownload.PERIODOTURNO,
				ip
			)
		]);

		return res.status(200).json({ downloadRoute });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const { getExamsFiles/* , getParams*/, getExamFile } = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');
const { formatDateTypeAndSplice, parseDate } = require('../../util/dateUtil');

const {
	NO_CIES_EXAMS_FOUNDED
} = errorCodes;

const handler = async (req, res) => {

	const user = req.body._login;

	try {

		const exams = await getExamsFiles(user.dni, 'A');

		if(!exams)
			return res.status(200).json({ message: NO_CIES_EXAMS_FOUNDED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		// const params = await getParams(8);

		const file = await getExamFile(user.tipoDni, user.dni, exams.id_mesa);

		const examenAlumno = `${process.env.HOST}/Archivosparciales/${file.Nombre_Archivo}`;
		const examenCorregido = `${process.env.HOST}/Archivosparciales/${file.Nombre_ArchivoCorregido}`;

		const response = {
			carrera: exams.CARRERA,
			idCtroExt: exams.ID_CTROEXT,
			idModalidad: exams.ID_MODALIDAD,
			nombreGrupo: exams.NOMBREGRUPO,
			turno: exams.TURNO,
			fechaExamen: formatDateTypeAndSplice(exams.FECHA_EXAMEN),
			horaExamen: exams.HORA_EXAMEN,
			fechaExamenParsed: parseDate(formatDateTypeAndSplice(exams.FECHA_EXAMEN), exams.HORA_EXAMEN),
			examenAlumno,
			examenCorregido
			// examenAlumno: `${params.XML}\\alumnosexa\\${file.año}${file.periodo}\\${file.Nombre_Archivo}`,
			// examenCorregido: `${params.XML}\\corregidos\\${file.año}${file.periodo}\\${file.Nombre_ArchivoCorregido}`
		};

		return res.status(200).json({
			// message: 'Exámen CIES obtenido.',
			...response
			// statusCode: 'SUCCESS',
			// code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

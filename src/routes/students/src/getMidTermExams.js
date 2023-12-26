/* eslint-disable max-len */
/* eslint-disable no-unreachable-loop */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const { getMidTermExams, downloadMidTermExamsCorrected } = require('../../../services/procedures');
const { checkId } = require('../../util/functions/setStatus');
const { formatDateTypeAndSplice } = require('../../util/dateUtil');
const authenticate = require('../../util/authentication/index');

const {
	NO_MID_TERM_EXAMS_FOUNDED
} = errorCodes;

const handler = async (req, res) => {

	const user = req.body._login;

	try {

		const currentDate = new Date();
		currentDate.setHours(currentDate.getHours() - 3);

		const midTermExams = await getMidTermExams(user.tipoDni, user.dni, 'C');

		if(!midTermExams.length)
			return res.status(200).json({ message: NO_MID_TERM_EXAMS_FOUNDED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		for(const currentExam of midTermExams) {

			const {
				fecha_bajado, fecha_fin, fecha_correccion, id_parcial, id_catedra, semestre, anio
			} = currentExam;

			const corregido = fecha_correccion ? 'SI' : 'NO';

			currentExam.corregido = corregido;

			if(fecha_bajado !== null && fecha_fin < currentDate) {
				const examFile = await downloadMidTermExamsCorrected(id_catedra, semestre, anio, id_parcial, 'B', user.tipoDni, user.dni);
				// currentExam.examFile = `${examFile.rutaserver}\\${examFile.Año}\\${examFile.Semestre}\\${examFile.nombre_corrector}`;
				currentExam.examFile = `${process.env.HOST}/Archivosparciales/${examFile.nombre_corrector}`;
			}

			if(fecha_bajado !== null && fecha_fin < currentDate && corregido === 'SI') {

				const examCorrected = await downloadMidTermExamsCorrected(id_catedra, semestre, anio, id_parcial, 'P', user.tipoDni, user.dni);
				// currentExam.examCorrected = `${examCorrected.rutaserver}\\${examCorrected.Año}\\${examCorrected.Semestre}\\${examCorrected.nombrearchivocorregido}`;
				currentExam.examCorrected = `${process.env.HOST}/Archivosparciales/${examCorrected.nombrearchivocorregido}`;
			}

		}

		const midTermExamsFormatted = midTermExams.map(currentExam => {

			const modifiedMidTermExams = {
				descripcion: currentExam.descripcion,
				fechaBajado: formatDateTypeAndSplice(currentExam.fecha_bajado),
				fechaSubido: formatDateTypeAndSplice(currentExam.fecha_subido),
				corregido: currentExam.corregido,
				fechaCorregido: formatDateTypeAndSplice(currentExam.fecha_correccion),
				archivoCorregido: currentExam.examCorrected,
				archivoCorrector: currentExam.examFile
			};

			if(checkId[currentExam.id_parcial]) {
				checkId[currentExam.id_parcial](currentExam);
				modifiedMidTermExams.parcial = currentExam.parcial;
			}

			return modifiedMidTermExams;

		});

		return res.status(200).json({
			midTermExamsFormatted,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

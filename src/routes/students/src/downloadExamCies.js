/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const {
	checkInhabilitation/* , getParams*/, getExamModel, insertTableFile, webAuditory
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	DOWNLOAD_INHABILITATED
} = errorCodes;

const handler = async (req, res) => {

	const { ip } = req;
	const { idCareer } = req.params;
	const user = req.body._login;

	try {

		const checkInhabilitationUser = await checkInhabilitation(user.tipoDni, user.dni);

		const exams = await getExamModel({ typeDni: user.tipoDni, dni: user.dni, idCareer, identit: 'B' });
		console.log('🚀 ~ file: downloadExamCies.js:28 ~ handler ~ exams:', exams);

		if(!exams.length)
			return res.status(200).json({ message: DOWNLOAD_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		// if(!examModel || (examModel.idestado !== 1 && examModel.tiemporestante <= 0))
		// return res.status(200).json({ message: DOWNLOAD_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		// const downloadRoute = `${params.XML}\\modelos\\${examModel.ANIOTURNO}${examModel.PERIODOTURNO}\\${examModel.NOMBRE_ARCHIVO}`;
		const response = [];
		for(const examModel of exams) {
			const downloadRoute = `${process.env.HOST}/modelosExamen/${examModel.NOMBRE_ARCHIVO}`;

			Promise.all([
				await insertTableFile({
					typeDni: user.tipoDni,
					dni: user.dni,
					idTable: examModel.ID_MESA,
					idModel: examModel.ID_MODELO,
					nameFile: `${examModel.ID_MESA}-${user.dni}.${examModel.ext}`,
					identit: 'B'
				}),
				await webAuditory(
					user.tipoDni,
					user.dni,
					'exams-cies/download/',
					'Alumno dni: ' + user.dni +
					' *id_mesa: ' + examModel.ID_MESA +
					' *id_modelo: ' + examModel.id_modelo +
					' *Bajo Examen Nombre Archivo: ' + examModel.NOMBRE_ARCHIVO +
					' *Nombre Archivo Armado: ' + downloadRoute +
					' *Año Turno: ' + examModel.ANIOTURNO +
					' *Periodo Turno: ' + examModel.PERIODOTURNO,
					ip
				)
			]);

			response.push({
				checkInhabilitationUser,
				descripcion: examModel.DESCRIPCION,
				estado: examModel.ESTADO,
				fecha_bajado: examModel.FECHA_BAJADO,
				fecha_subido: examModel.FECHA_SUBIDO,
				fecha_examen: examModel.FECHA_EXAMEN,
				hora_examen: examModel.HORA_EXAMEN,
				id_mesa: examModel.Id_Mesa,
				id_carrera: examModel.Id_Carrera,
				id_materia: examModel.Id_Materia,
				nombre_archivo: examModel.NOMBRE_ARCHIVO,
				archivo: examModel.ARCHIVO,
				downloadRoute
			});
		}

		return res.status(200).json(response);

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

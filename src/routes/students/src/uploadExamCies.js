/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const multer = require('multer');
const mimeType = require('mime-types');

const app = express.Router();

const authenticate = require('../../util/authentication/index');
const { decode } = require('../../util/jwt/jsonWebToken');
const { getExamModel, insertTableFile, webAuditory } = require('../../../services/procedures');
const { DOWNLOAD_INHABILITATED } = require('../../../constants/errorCodes');

const getYearAndSemester = () => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	if(currentMonth >= 0 && currentMonth < 6)
		return { currentYear, semester: 1 };

	return { currentYear, semester: 2 };
};

const storage = multer.diskStorage({
	destination: `${process.env.FILES_PATH}/mnt/ModelosExamen/alumnosexa/${(getYearAndSemester()).currentYear}${(getYearAndSemester()).semester}`,
	filename: (req, file, cb) => {
		const { dni, tipoDni } = decode(req.headers.authorization.replace('Bearer ', ''));
		// const { exam } = req;
		// const nameFile = `${exam.Id_Mesa}-${dni}.${exam.ext}`;
		const nameFile = `1369139-${dni}`; // TODO: cambiar esto!, tiene que ser el id de la mesa, hay q cambiar el orden de los middlewares
		this.extension = mimeType.extension(file.mimetype);
		this.fileName = `${nameFile}.${this.extension}`;

		cb('', this.fileName);
		req.body._login = { dni, tipoDni };
	}
});

const upload = multer({ storage });

const handler = async (req, res) => {
	const { tipoDni: typeDni, dni } = req.body._login;
	const { idCareer } = req.params;
	const { ip } = req;

	const examModel = await getExamModel({ typeDni, dni, idCareer, identit: 'B' });

	req.exam = examModel;

	if(!examModel || (examModel.idestado !== 1 && examModel.tiemporestante <= 0))
		return res.status(200).json({ message: DOWNLOAD_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

	Promise.all([
		await insertTableFile({
			typeDni,
			dni,
			idTable: examModel.ID_MESA,
			idModel: examModel.ID_MODELO,
			nameFile: `${examModel.ID_MESA}-${dni}.${examModel.ext}`,
			identit: 'S'
		}),
		await webAuditory(
			typeDni,
			dni,
			'exams-cies/download/',
			'Alumno dni: ' + dni +
				' *id_mesa: ' + examModel.ID_MESA +
				' *id_modelo: ' + examModel.id_modelo +
				' *Bajo Examen Nombre Archivo: ' + examModel.NOMBRE_ARCHIVO +
				// eslint-disable-next-line no-useless-concat
				' *Nombre Archivo Armado: ' + `${examModel.ID_MESA}-${dni}.${examModel.ext}` +
				' *Año Turno: ' + examModel.ANIOTURNO +
				' *Periodo Turno: ' + examModel.PERIODOTURNO,
			ip
		)
	]);

	res.json({ message: 'Archivo subido' });
};

app.post('/:idCareer', authenticate, upload.single('file'), handler);

module.exports = { app, handler };

/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const multer = require('multer');

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
	filename: async (req, file, cb) => {

		const { dni, tipoDni } = decode(req.headers.authorization.replace('Bearer ', ''));
		const { exam } = req;

		const nameFile = `${exam.Id_Mesa}-${dni}.${exam.ext}`;

		cb('', nameFile);
		req.body._login = { dni, tipoDni };
		req.exam = exam;
	}
});

const upload = multer({ storage });

const handler = async (req, res) => {

	const { tipoDni: typeDni, dni } = req.body._login;
	const { ip, exam } = req;

	Promise.all([
		await insertTableFile({
			typeDni,
			dni,
			idTable: exam.ID_MESA,
			idModel: exam.ID_MODELO,
			nameFile: `${exam.ID_MESA}-${dni}.${exam.ext}`,
			identit: 'S'
		}),
		await webAuditory(
			typeDni,
			dni,
			'exams-cies/download/',
			'Alumno dni: ' + dni +
				' *id_mesa: ' + exam.ID_MESA +
				' *id_modelo: ' + exam.id_modelo +
				' *Bajo Examen Nombre Archivo: ' + exam.NOMBRE_ARCHIVO +
				// eslint-disable-next-line no-useless-concat
				' *Nombre Archivo Armado: ' + `${exam.ID_MESA}-${dni}.${exam.ext}` +
				' *Año Turno: ' + exam.ANIOTURNO +
				' *Periodo Turno: ' + exam.PERIODOTURNO,
			ip
		)
	]);

	res.json({ message: 'Archivo subido' });
};

const getExams = async (req, res, next) => {
	const user = req.body._login;
	const { idModelo, idMesa, idCarrera } = req.params;

	try {
		const exams = await getExamModel({ typeDni: user.tipoDni, dni: user.dni, idCareer: idCarrera, identit: 'B' });

		if(!exams.length)
			return res.status(200).json({ message: DOWNLOAD_INHABILITATED, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const exam = exams.find(({ ID_MESA, ID_MODELO }) => ID_MESA === +idMesa && ID_MODELO === +idModelo);

		if(!exam)
			return res.status(200).json({ message: 'Examen no encontrado', statusCode: 'VALIDATIONS_FAILED', code: 1 });

		req.exam = exam;
		next();
	} catch(error) {
		return res.status(200).json({ message: 'Examen no encontrado', statusCode: 'VALIDATIONS_FAILED', code: 1 });
	}
};

app.post('/:idModelo/:idMesa/:idCarrera', authenticate, getExams, upload.single('file'), handler);

module.exports = { app, handler };

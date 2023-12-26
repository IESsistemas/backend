/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const multer = require('multer');
const mimeType = require('mime-types');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');
const { decode } = require('../../util/jwt/jsonWebToken');

const getNameFile = nameComplete => {

	let name = '';
	for(const letter of nameComplete) {
		if(letter === '.')
			return name;
		name += letter;
	}

	return name;
};

const getYearAndSemester = () => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	if(currentMonth >= 0 && currentMonth < 6)
		return { currentYear, semester: 1 };

	return { currentYear, semester: 2 };
};

const storage = multer.diskStorage({
	destination: `${process.env.FILES_PATH}/mnt/Archivosparciales/${(getYearAndSemester()).currentYear}${(getYearAndSemester()).semester}`,
	filename: (req, file, cb) => {
		const { dni, tipoDni } = decode(req.headers.authorization.replace('Bearer ', ''));
		const { idParcial, idCatedra } = req.params;
		const { currentYear, semester } = getYearAndSemester();

		const nameFile = `${getNameFile(file.originalname)[0]}${idParcial}${semester}${currentYear}${idCatedra}-${dni}`;
		this.extension = mimeType.extension(file.mimetype);

		this.fileName = `${nameFile}.${this.extension}`;

		cb('', this.fileName);
		req.body._login = { dni, tipoDni };
	}
});

const upload = multer({ storage });

const handler = async (req, res) => {

	const { tipoDni: typeDni, dni } = req.body._login;
	const { idParcial } = req.params;

	const parciales = await procedures.getParcial({ typeDni, dni });

	const parcial = parciales.find(p => p.nombre_archivo === idParcial);

	if(!parcial)
		return res.status(404).json({ message: 'Parcial no encontrado' });

	const dataParcial = {
		typeDni,
		dni,
		idCareer: parcial.id_carrera,
		idMateria: parcial.id_materia,
		idPlanEstudio: parcial.id_plan_estudio,
		semestre: parcial.semestre,
		anio: parcial.anio,
		idParcial: parcial.id_parcial,
		idModParcial: parcial.nombre_archivo[0],
		nombreArchivo: parcial.nombre_archivo,
		parama: 'S'
	};

	await procedures.insertParcialArchivo(dataParcial);

	const nameFile = `${parcial.nombre_archivo[0]}${parcial.id_parcial}${parcial.semestre}${parcial.anio}${parcial.id_catedra}-${dni}`;
	const dataAuditory =
	`
	*Alumno dni:| ${dni} |
	*id_carrera: | ${parcial.id_carrera}| 
	*id_materia:| ${parcial.id_materia}|
	*semestre:| ${parcial.semestre} |
	*año:| ${parcial.anio} |
	*id_plan_estudio:| ${parcial.id_plan_estudio} |
	*id_parcial:| ${parcial.id_parcial} |
	*Subio Parcial:| ${parcial.nombre_archivo} |
	*Nombre Archivo Armado:| ${nameFile}
	`;

	await procedures.webAuditory(typeDni, dni, 'upload-parcial', dataAuditory, 'data');

	res.json({ message: 'Archivo subido' });
};

app.post('/:idParcial', authenticate, upload.single('file'), handler);

module.exports = { app, handler };

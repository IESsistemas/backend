/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const authenticate = require('../../util/authentication/index');
const procedures = require('../../../services/procedures');

const handler = async (req, res) => {
	try {
		const { tipoDni: typeDni, dni } = req.body._login;
		const { idParcial } = req.params;

		const parciales = await procedures.getParcial({ typeDni, dni });
		const parcial = parciales.find(p => p.nombre_archivo === idParcial);

		if(!parcial)
			return res.status(404).json({ message: 'Parcial no encontrado' });

		const urlToDownload = `${process.env.HOST}/Archivosparciales/${parcial.nombre_archivo}`;

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
			parama: 'B'
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
		*Bajo Parcial:| ${parcial.nombre_archivo} |
		*Nombre Archivo Armado:| ${nameFile}
		`;

		await procedures.webAuditory(typeDni, dni, 'download-parcial', dataAuditory, 'data');

		return res.json({ urlToDownload });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idParcial', authenticate, handler);

module.exports = { app, handler };

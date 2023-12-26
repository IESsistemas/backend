/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const {
	checkBalanceWeb,
	checkBalance,
	getDocumentationFile,
	getMateriasInscriptasCursillo,
	getMateriasAInscribirCursillo,
	getMesaExamenMateriaCursillo
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const { materiasNoAptas } = require('../../util/functions/setStatus');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;

	const { idCareer } = req.params;

	try {
		const infoBalanceWeb = await checkBalanceWeb(typeDni, dni, 'E');

		const infoBalance = await checkBalance(typeDni, dni);

		const checkDocumentation = await getDocumentationFile(typeDni, dni, idCareer)

		if(checkDocumentation === 'N'){
			return res.status(404).json({ message: 'Ud. Adeuda Documentación. Sólo podrá realizar Inscripciones a Exámenes Finales de Cursillo'})
		};

		const getMateriasInscriptas = await getMateriasInscriptasCursillo({
			idTurnoCursillo: 0,
			idCarrera: 0,
			idMateria: 0,
			identit: 'I',
			typeDni,
			dni,
			idPlanEstudio: '0'
		})

		const getMateriasAInscribir = await getMateriasAInscribirCursillo({
			typeDni,
			dni,
			idCareer
		})

		const aptas1 = ["LA", "FA"];
		const aptas2 = ["RA", "RU"];

		for(const obj of getMateriasAInscribir) {

			if(aptas1.includes(obj.CONDICION)){
				const mesasExamen = await getMesaExamenMateriaCursillo({
					idMateria: obj.ID_MATERIA,
					idCarrera: idCareer,
					idPlanEstudio: obj.ID_PLAN_ESTUDIO,
					idCtroExt: obj.CTRO_EXT,
					idModalidad: obj.ID_MODALIDAD,
					identif: "L",
					idComision: 0,
					typeDni,
					dni
				});

				obj.mesasExamen = mesasExamen;
			}

			if(aptas2.includes(obj.CONDICION)){
				const mesasExamen = await getMesaExamenMateriaCursillo({
					idMateria: obj.ID_MATERIA,
					idCarrera: idCareer,
					idPlanEstudio: obj.ID_PLAN_ESTUDIO,
					idCtroExt: obj.CTRO_EXT,
					idModalidad: obj.ID_MODALIDAD,
					identif: "V",
					idComision: 0,
					typeDni,
					dni
				});

				obj.mesasExamen = mesasExamen;

			}else{
				materiasNoAptas[obj.CONDICION](obj);
			}
		}

		return res.status(200).json( {
			saldo: infoBalance,
			saldoWeb: infoBalanceWeb,
			materiasInscriptas: getMateriasInscriptas,
			materiasAInscribir: getMateriasAInscribir

		});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

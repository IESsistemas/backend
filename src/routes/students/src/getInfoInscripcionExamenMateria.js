/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const {
	checkBalanceWeb,
	checkBalance,
	getDocumentationFile,
	getMateriasInscripcionExamen,
	getMesaExamenMateria,
    checkFechaTesis,
	controlPagareExamen
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {
	const { dni, tipoDni: typeDni } = req.body._login;

	const { idCareer } = req.params;

	try {
		const infoBalanceWeb = await checkBalanceWeb(typeDni, dni, 'E');

		const infoBalance = await checkBalance(typeDni, dni);

		const checkDocumentation = await getDocumentationFile(typeDni, dni, idCareer)

		if(checkDocumentation !== 'P'){
			return res.status(404).json({ message: 'Ud. Adeuda documentación del legajo'})
		};

        const checkAnioVigencia = await checkFechaTesis(typeDni, dni, 'S', idCareer);

        if(checkAnioVigencia.Año_Fin_Vigencia !== null){
            return res.status(404).json({ message: 'Deberá comunicarse con Secretaia Académica para solicitar una revisión sobre el Plan de Estudio Asignado para su Carrera'})
        }

		const getMaterias = await getMateriasInscripcionExamen({
			typeDni,
            dni,
            idCareer
		})

		const aptas = ["RA", "RU", "LA", "FA", "EQ"];

        const noAptas = ["RC", "LC", "FC", "BV", "BN"];

        const materiasCursillo = [];
        const materiasAptas = [];
        const materiasNoAptas = [];
        const materiasPromocionadas = [];


		for(const obj of getMaterias) {

            if(obj.cuatrimestre === 0){
                materiasCursillo.push(obj);
            };

			if(obj.TESIS === 'S' || noAptas.includes(obj.Condicion)){
				materiasNoAptas.push(obj);
			};

			if(aptas.includes(obj.Condicion)){

                if(obj.Condicion !== 'EQ'){
                const mesasExamen = await getMesaExamenMateria({
					idMateria: obj.Id_Materia,
					idCarrera: idCareer,
					idPlanEstudio: obj.Id_Plan_Estudio,
					idCtroExt: obj.Ctro_Ext,
					idModalidad: obj.Id_Modalidad,
					identif: obj.Condicion === 'RA' || obj.Condicion === 'RU' ? 'H' : 'K',
					idComision: 0,
					ingreso: checkAnioVigencia.año
				});

				for(const obj of mesasExamen){
					let fechaExamen = obj.Fecha_Examen
					const checkPagare = await controlPagareExamen({
						typeDni,
						dni,
						fechaExamen
					})

					obj.controlPagare = checkPagare;
				}
				obj.mesasExamen = mesasExamen;
                }

				materiasAptas.push(obj);
			}
			if(obj.Condicion === 'PR'){
                materiasPromocionadas.push(obj);
            };
		}

		return res.status(200).json( {
			saldo: infoBalance,
			saldoWeb: infoBalanceWeb,
			materiasCursillo,
			materiasAptas,
			materiasNoAptas,
			materiasPromocionadas
		});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCareer', authenticate, handler);

module.exports = { app, handler };

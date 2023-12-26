/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const validatGetCommissionsSubjects = require('../../util/structures/models/getCommissionsSubjects');
const authenticate = require('../../util/authentication/index');
const { commissionSubject } = require('../../../services/procedures');
const { translateTurn } = require('../../util/functions/setStatus');

const handler = async (req, res) => {

	const { idCarrera, idMateria, idPlanEstudio, idModalidad } = req.query;

	try {

		const commissionsToGet = await commissionSubject({
			idCareer: idCarrera, idSubject: idMateria, idStudyPlan: idPlanEstudio, idModality: idModalidad
		});

		const commissions = commissionsToGet.map(({
			Turno, Division, Ctro_Ext, Id_CtroExt, Id_Comision, Fecha_Inicio_Real, Fecha_Fin_Real, Puntos, Valor_Punto
		}) => ({
			comision: `${translateTurn[Turno]} - ${Division}`,
			centroExtension: Ctro_Ext.trim(),
			idCentroExtension: Id_CtroExt[0],
			idComision: Id_Comision,
			fechaInicioClases: new Date(Fecha_Inicio_Real).toISOString().slice(0, 10),
			fechaFinClases: new Date(Fecha_Fin_Real).toISOString().slice(0, 10),
			puntos: Puntos,
			valorPunto: Valor_Punto * 5,
			monto: Puntos * Valor_Punto * 5
		}));

		return res.status(200).json({
			commissions,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', validatGetCommissionsSubjects, authenticate, handler);

module.exports = { app, handler };

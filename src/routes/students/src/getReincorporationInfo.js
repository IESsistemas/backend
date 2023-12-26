/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');
const { setStatusReincorporation } = require('../../util/functions/setStatus');

const handler = async (req, res) => {

	const { idCarrera } = req.params;

	const user = req.body._login;

	try {

		const absenses = await procedures.checkReincorporationAvailable(user.tipoDni, user.dni, idCarrera);

		const statusAbsenses = absenses.map(currentAbsense => {
			const modifiedAbsense = {
				MATERIA: currentAbsense.MATERIA,
				SEMESTRE: currentAbsense.SEMESTRE,
				AÑO: currentAbsense.AÑO,
				PRESENTA_CERTIFICADO: currentAbsense.PRESENTA_CERTIFICADO,
				OBSERVACION: currentAbsense.OBSERVACION,
				ESTADO_ACTUAL: null,
				SOLICITADA: null,
				ID_MATERIA: currentAbsense.ID_MATERIA
			};

			if(currentAbsense.FECHA_SOLICITUD !== null) {
				if(setStatusReincorporation[currentAbsense.APROBADO_DOCENTE]) {
					setStatusReincorporation[currentAbsense.APROBADO_DOCENTE](currentAbsense);
					modifiedAbsense.ESTADO_ACTUAL = currentAbsense.ESTADO_ACTUAL;
					modifiedAbsense.SOLICITADA = true;
				} else {
					modifiedAbsense.ESTADO_ACTUAL = 'Pendiente de Aprobación';
					modifiedAbsense.SOLICITADA = true;
				}

			} else {
				modifiedAbsense.ESTADO_ACTUAL = 'Materia disponible para solicitar reincorporación';
				modifiedAbsense.SOLICITADA = false;
			}
			return modifiedAbsense;
		});

		return res.status(200).json({
			message: 'Reincorporaciones disponibles y/o solicitadas.',
			statusAbsenses,
			statusCode: 'SUCCESS',
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/:idCarrera', authenticate, handler);

module.exports = { app, handler };

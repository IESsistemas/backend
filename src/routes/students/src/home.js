const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const { NO_CAREERS_FOUNDED } = errorCodes;

const handler = async (req, res) => {

	try {

		// eslint-disable-next-line no-underscore-dangle
		const user = req.body._login;

		const userCareers = await procedures.checkCareer(user.tipoDni, user.dni);

		if(!userCareers.length)
			return res.status(200).json({ message: NO_CAREERS_FOUNDED(user.dni), code: 2 });

		// eslint-disable-next-line camelcase
		const careersIds = userCareers.map(({ ID_CARRERA, id_modalidad }) => [ID_CARRERA, id_modalidad]);

		const getPrincipalsCareers = await procedures.getPrincipals();

		const principalsFiltered = getPrincipalsCareers.filter(principal => {
			const hasMatchingCareer = careersIds.some(career => career[0] === principal.id_carrera && career[1] === principal.id_modalidad);
			const hasDirectorPosition = principal.puesto === 'DIRECTOR DE CARRERA';

			return hasMatchingCareer && hasDirectorPosition;
		});

		const careersWithDirectors = userCareers.map(career => {
			// eslint-disable-next-line max-len
			const director = principalsFiltered.find(principal => principal.id_carrera === career.ID_CARRERA && principal.id_modalidad === career.id_modalidad);
			return {
				...career, director
			};
		});

		const studentInhabilitation = await procedures.checkInhabilitation(user.tipoDni, user.dni);

		const banner = await procedures.getBanner('C');

		return res.status(200).json({ careersWithDirectors, studentInhabilitation, banner, code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

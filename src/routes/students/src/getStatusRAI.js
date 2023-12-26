const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const documentsSigned = await procedures.getStatusDocumentationStudent(user.tipoDni, user.dni, 'M');

		const raiStatusToGet = documentsSigned.filter(area => area.id_documentacion === 17);

		if(raiStatusToGet[0].tipo == null)
			return res.status(200).json({ message: 'RAI pendiente', statusCode: 'VALIDATIONS_FAILED', code: 1 });

		return res.status(200).json({ raiStatusToGet, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

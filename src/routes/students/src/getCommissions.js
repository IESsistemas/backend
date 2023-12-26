const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');

const { getCommissions } = require('../../../services/procedures');

const handler = async (req, res) => {
	try {
		const { commission, modality, careerId, subjectId } = req.query;
		const commissions = await getCommissions({ careerId: JSON.parse(careerId), subjectId: JSON.parse(subjectId), modalityId: modality });

		if(commission)
			return res.status(200).json(commissions.filter(({ COMISION }) => COMISION === commission));

		return res.status(200).json(commissions);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

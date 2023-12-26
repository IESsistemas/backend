const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const {
		cuenta,
		num_comp,
		p_vta,
		tipo,
		fecha
	 } = req.body;

	 const user = req.body._login;

	 

	try {

		const info = await procedures.getInfoBoletas(
			cuenta,
			num_comp,
			p_vta,
			tipo,
			fecha,
			user.tipoDni, 
			user.dni
		);

		if(!info.length)
			return res.status(200).json({ message: "No se obtuvo información de la boleta", statusCode: 'VALIDATIONS_FAILED', code: 1 });

		return res.status(200).json({ info, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

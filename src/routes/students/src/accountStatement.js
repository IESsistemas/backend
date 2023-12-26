const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	try {

		// eslint-disable-next-line no-underscore-dangle
		const user = req.body._login;

		const balance = await procedures.checkBalance(user.tipoDni, user.dni);

		const pagares = await procedures.checkPagaresWeb(user.tipoDni, user.dni, 'W');

		const lastMovementsInitialBalance = await procedures.initialBalance(user.tipoDni, user.dni, 1);

		const lastMovements = await procedures.postInitialBalance(user.tipoDni, user.dni);

		const coupons = await procedures.getCoupons(user.tipoDni, user.dni);

		const response = {
			consultaSaldo: balance,
			pagares,
			ultMovSaldoInicial: lastMovementsInitialBalance,
			ultimosMovimientos: lastMovements,
			cupones: coupons

		};

		return res.status(200).json({ response, statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

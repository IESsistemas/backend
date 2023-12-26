const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');
const encript = require('../../util/encriptUtil');
const validateData = require('../../util/structures/models/payWithCreditCard');
const { isAnExpiredDate } = require('../../util/dateUtil');
const { payWithCreditCard } = require('../../../services/procedures');

const handler = async (req, res) => {

	const {
		paymentAmount, cardExpiration, idCard, numberCard, verificationCode, cardholder, phoneNumber, installments, _login
	} = req.body;

	const { dni, tipoDni: typeDni } = _login;

	if(isAnExpiredDate(cardExpiration))
		return res.json({ message: 'Tarjeta expirada' });

	const cardData = {
		dni, typeDni, paymentAmount, cardExpiration, idCard, numberCard, verificationCode: encript(verificationCode), cardholder, phoneNumber, installments
	};

	try {
		await payWithCreditCard(cardData);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

	return res.json({ message: 'Pago exitoso' });
};

app.post('/', validateData, authenticate, handler);

module.exports = { app, handler };

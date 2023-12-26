const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication');
const { getPaymentMethodByType } = require('../../../services/procedures');
const { filteredCreditCards, getCreditCards } = require('../../util/paymentMethodsUtil');

const PAYCHECK_ALIAS = 'ch';
const PROMISSORY_NOTE_ALIAS = 'PA';

const handler = async (req, res) => {
	try {
		const [paycheckData, promissoryNoteData] = await Promise.all([
			getPaymentMethodByType(PAYCHECK_ALIAS), getPaymentMethodByType(PROMISSORY_NOTE_ALIAS)
		]);

		const cards = await getCreditCards();

		const response = {
			paycheck: { description: paycheckData.DESCRIPCION, surcharge: paycheckData.RECARGO },
			creditCards: filteredCreditCards(cards),
			promissoryNotes: { description: promissoryNoteData.DESCRIPCION, surcharge: promissoryNoteData.RECARGO }
		};

		return res.status(200).json(response);
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

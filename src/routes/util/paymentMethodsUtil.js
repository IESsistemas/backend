/* eslint-disable camelcase */
const { getCreditCardsTypes } = require('../../services/procedures');

const CREDIT_CARD_TYPES = ['Cordobesa', 'Naranja', 'Visa', 'Nativa', 'Cabal', 'MasterCard'];

const getCreditCards = async () => Promise.all(CREDIT_CARD_TYPES.map(creditCardType => getCreditCardsTypes(creditCardType)));

const filteredCreditCards = cards => cards
	.flat()
	.filter(card => card.ventatel === 'S' && card.recargo !== 99)
	.map(({ descripcion, recargo, id_tarjeta }) => ({ id: id_tarjeta, card: descripcion, surcharge: recargo }));

module.exports = {
	getCreditCards,
	filteredCreditCards
};

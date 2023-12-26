const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const validateAddNewAddress = require('../../util/structures/models/addNewAddress');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	ADDRESS_TYPE_ALREADY_EXISTS
} = errorCodes;

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idTipoDomi, calle, torre, piso, dpto, idBarrio, codigoPostal
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const addressesAvailables = await procedures.getAddressAvailablesToInsert('W', user.tipoDni, user.dni);

		const addressValidation = addressesAvailables.some(address => address.Id_Tipo_Domi === idTipoDomi);

		if(!addressValidation)
			return res.status(200).json({ message: ADDRESS_TYPE_ALREADY_EXISTS, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const bodyToInsert = {
			typeDni: user.tipoDni,
			dni: user.dni,
			idTypeAddress: idTipoDomi,
			street: calle,
			tower: torre,
			floor: piso,
			apartment: dpto,
			idNeighborhood: idBarrio,
			zipCode: codigoPostal
		};

		await Promise.all([
			procedures.insertAddress(bodyToInsert),
			procedures.webAuditory(user.tipoDni, user.dni, 'add-new-address', 'Añadir nuevo domicilio', ip)
		]);

		return res.status(200).json({ message: 'Domicilio añadido exitosamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateAddNewAddress, authenticate, handler);

module.exports = { app, handler };

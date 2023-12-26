const express = require('express');

const app = express.Router();

const validateUpdateAddress = require('../../util/structures/models/updateAddress');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const {
		idTipoDomi, calle, torre, piso, dpto, idBarrio, codigoPostal
	} = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

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
			procedures.webAuditory(user.tipoDni, user.dni, 'update-address', `Actualizar domicilio tipo: ${idTipoDomi}`, ip)
		]);

		return res.status(200).json({ message: 'Domicilio actualizado correctamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.put('/', validateUpdateAddress, authenticate, handler);

module.exports = { app, handler };

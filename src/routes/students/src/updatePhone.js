const express = require('express');

const app = express.Router();

const validateAddNewPhone = require('../../util/structures/models/addNewPhone');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	const { ip } = req;
	const { idTipoTel, nroTel, observaciones } = req.body;

	// eslint-disable-next-line no-underscore-dangle
	const user = req.body._login;

	try {

		const bodyToInsert = {
			typeDni: user.tipoDni,
			dni: user.dni,
			idTypePhone: idTipoTel,
			newPhone: nroTel,
			observations: observaciones || ''

		};

		await Promise.all([
			procedures.addNewPhoneStudent(bodyToInsert),
			procedures.webAuditory(user.tipoDni, user.dni, 'update-phone-student', `Actualizar teléfono tipo: ${idTipoTel}`, ip)
		]);

		return res.status(200).json({ message: 'Teléfono actualizado correctamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.put('/', validateAddNewPhone, authenticate, handler);

module.exports = { app, handler };

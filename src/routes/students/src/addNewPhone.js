const express = require('express');

const app = express.Router();

const errorCodes = require('../../../constants/errorCodes');
const validateAddNewPhone = require('../../util/structures/models/addNewPhone');
const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const {
	PHONE_TYPE_ALREADY_EXISTS
} = errorCodes;

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

		const userPhones = await procedures.getStudentPhone(user.tipoDni, user.dni);

		const phoneAlreadyExists = userPhones.some(phone => phone.ID_TIPO_TE === idTipoTel);

		if(phoneAlreadyExists)
			return res.status(200).json({ message: PHONE_TYPE_ALREADY_EXISTS, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		await Promise.all([
			procedures.addNewPhoneStudent(bodyToInsert),
			procedures.webAuditory(user.tipoDni, user.dni, 'add-new-phone-student', 'Agregar teléfono estudiante', ip)
		]);

		return res.status(200).json({ message: 'Teléfono añadido correctamente', statusCode: 'SUCCESS', code: 2 });

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateAddNewPhone, authenticate, handler);

module.exports = { app, handler };

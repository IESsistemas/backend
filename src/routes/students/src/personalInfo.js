/* eslint-disable no-unused-expressions */
const express = require('express');

const app = express.Router();

const procedures = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

	try {

		// eslint-disable-next-line no-underscore-dangle
		const user = req.body._login;

		let needToConfirmEmail = false;
		let needToUpdateNewEmail = false;

		const [emailStudent] = await procedures.checkEmailActive(user.tipoDni, user.dni);

		if(emailStudent.ID_TIPO_MAIL === 'I' && emailStudent.ACTIVO === 'P')
			needToConfirmEmail = true;

		if(emailStudent.ID_TIPO_MAIL === 'I' && emailStudent.ACTIVO === 'N')
			needToUpdateNewEmail = true;

		emailStudent.needToConfirmEmail = needToConfirmEmail;
		emailStudent.needToUpdateNewEmail = needToUpdateNewEmail;

		const [addressFamiliar, addressActual, addressSend, addressOther] = await Promise.all([
			procedures.getAddressInfo(user.tipoDni, user.dni, 'F'),
			procedures.getAddressInfo(user.tipoDni, user.dni, 'H'),
			procedures.getAddressInfo(user.tipoDni, user.dni, 'E'),
			procedures.getAddressInfo(user.tipoDni, user.dni, 'O')
		]);

		addressFamiliar[0] ? addressFamiliar[0].isObligatory = true : addressFamiliar.push({ isObligatory: true });
		addressActual[0] ? addressActual[0].isObligatory = true : addressActual.push({ isObligatory: true });
		addressSend[0] ? addressSend[0].isObligatory = false : addressSend.push({ Id_Tipo_Domi: 'E', isObligatory: false });
		addressOther[0] ? addressOther[0].isObligatory = false : addressOther.push({ Id_Tipo_Domi: 'O', isObligatory: false });

		const studentPhone = await procedures.getStudentPhone(user.tipoDni, user.dni);

		return res.status(200).json({
			studentPhone,
			emailStudent,
			addressFamiliar,
			addressActual,
			addressSend,
			addressOther,
			code: 2
		});

	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.get('/', authenticate, handler);

module.exports = { app, handler };

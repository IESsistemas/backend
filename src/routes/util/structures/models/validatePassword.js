/* eslint-disable no-underscore-dangle */
const { checkPin } = require('../../../../services/procedures');
const { generateOrignalPassword } = require('../../studentServices');

const RESPONSE_INVALID_PASSWORD = { message: 'Contraseña incorrecta', statusCode: 'VALIDATIONS_FAILED', code: 1 };

const validatePassword = async (req, res, next) => {
	const { newPassword, currentPassword } = req.body;

	const { dni, tipoDni } = req.body._login;

	const validatedPassword = await checkPin(dni, currentPassword);

	if(!validatedPassword.length)
		return res.status(200).json(RESPONSE_INVALID_PASSWORD);

	if(newPassword.includes(dni))
		return res.status(200).json(RESPONSE_INVALID_PASSWORD);

	const originalPassword = await generateOrignalPassword(dni);

	if(originalPassword === newPassword)
		return res.status(200).json(RESPONSE_INVALID_PASSWORD);

	if(currentPassword === newPassword)
		return res.status(200).json(RESPONSE_INVALID_PASSWORD);

	req.user = {
		dni, tipoDni, newPassword, currentPassword, userIp: req.ip
	};

	next();
};

module.exports = validatePassword;

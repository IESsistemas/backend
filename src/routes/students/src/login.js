const express = require('express');

const app = express.Router();
const errorCodes = require('../../../constants/errorCodes');
const validateLogin = require('../../util/structures/models/signIn');
const procedures = require('../../../services/procedures');
const { encode } = require('../../util/jwt/jsonWebToken');

const {
	INVALID_DATA_USER, INVALID_INSCRIPTION
} = errorCodes;

const onlyNum = (tex)=>{
	let res = '';
	const num = '0123456789'
	for (let i = 0; i < tex.length; i++) {
		if(num.indexOf(tex[i]) != -1) res+=tex[i]
	}
	return res;
}

const handler = async (req, res) => {

	const { ip } = req;

	const { dni, password } = req.body;

	try {

		const student = await procedures.checkPin(dni, password);

		if(!student.length)
			return res.status(200).json({ message: INVALID_DATA_USER, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		// eslint-disable-next-line camelcase
		// const carreers = student.map(({ Id_Carrera, Carrera }) => ({ Id_Carrera, Carrera }));

		const validateInscription = await procedures.checkInscription(dni);

		const invalidInscription = validateInscription.every(obj => obj.Id_Carrera === 68);

		if(invalidInscription)
			return res.status(200).json({ message: INVALID_INSCRIPTION, statusCode: 'VALIDATIONS_FAILED', code: 1 });

		const { Tipo_Doc: typeDni } = student[0];

		const validateSurvey = await procedures.checkSurvey(typeDni, dni);

		let pendingSurvey = false;
		let pendingSurveyObligatory = false;

		if(validateSurvey.length) {
			const checkObligatorySurvey = validateSurvey.some(obj => obj.obligatoria === 'S');
			if(checkObligatorySurvey)
				// return res.status(200).json({ message: PENDING_SURVEY, statusCode: 'SURVEY_OBLIGATORY_PENDING', code: 1 });
				pendingSurveyObligatory = true;

			const checkSurvey = validateSurvey.some(obj => obj.obligatoria === 'N');
			if(checkSurvey)
				// return res.status(200).json({ message: PENDING_SURVEY, statusCode: 'SURVEY_OBLIGATORY_PENDING', code: 1 });
				pendingSurvey = true;

		}

		const checkPasswordExpired = await procedures.checkPasswordExpiration(typeDni, dni);

		// eslint-disable-next-line camelcase
		const user = {
			doc: onlyNum(checkPasswordExpired[0].num_doc),
			birthday: checkPasswordExpired[0].Fecha_Nac,
			passwordExpiredDate: checkPasswordExpired[0].vencimiento_pin,
			password: checkPasswordExpired[0].pin
		};

		let birthday = (typeof(user.birthday) == 'object') ? user.birthday : new Date(user.birthday);
		const day = ('0' + birthday.getUTCDate()).slice(-2);
		const month = ('0' + (birthday.getUTCMonth() + 1)).slice(-2);
		const last3Digits = user.doc.slice(-3);

		const originalPassword = day + last3Digits + month;

		const actualDate = new Date();

		let passwordExpired = false;

		if(user.password === originalPassword || user.passwordExpiredDate < actualDate)
			passwordExpired = true;

		const checkEmailActive = await procedures.checkEmailActive(typeDni, dni);

		let pendingEmail = false;

		if(checkEmailActive[0]?.ACTIVO !== 'S')
			pendingEmail = true;

		const checkStudentRegulations = await procedures.checkStudentRegulations(typeDni, dni);

		let pendingStudentRegulation = false;
		if(checkStudentRegulations.length)
			pendingStudentRegulation = true;

		await procedures.webAuditory(typeDni, dni, 'login', 'Inicio de sesión de alumno', ip);

		const dataToEncript = {
			nombres: student[0].nombres,
			apellidos: student[0].apellidos,
			dni,
			// carreers,
			email: checkEmailActive[0]?.E_MAIL,
			cambiarContraseña: passwordExpired,
			emailPendiente: pendingEmail,
			encuestaNoObligatoriaPendiente: pendingSurvey,
			encuestaObligatoriaPendiente: pendingSurveyObligatory,
			reglamentoAlumnoPendiente: pendingStudentRegulation,
			tipoDni: typeDni
		};

		const token = encode(dataToEncript);

		return res.status(200).json({
			message: 'Login exitoso!', token, data: dataToEncript, statusCode: 'SUCCESS', code: 2
		});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}

};

app.post('/', validateLogin, handler);

module.exports = { app, handler };

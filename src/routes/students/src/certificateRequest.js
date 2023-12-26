/* eslint-disable camelcase */
const express = require('express');

const {
	getStudent, getStudentPhone, checkEmailActive, checkCareer, sendEmail
} = require('../../../services/procedures');

const validateCertificateReq = require('../../util/structures/models/certificateRequest');
const { STUDENT_NOT_EXISTS, PHONE_NOT_FOUNT, EMAIL_NOT_FOUNT, CAREER_NOT_EXISTS } = require('../../../constants/errorCodes');
const { getFirstElement } = require('../../util/arrayUtil');
const template = require('../../../../modules/email/certificateRequest');

const app = express.Router();

const handler = async (req, res) => {

	const {
		typeDni, dni, dispatchPlace, formalities, other, email, idCareer
	} = req.body;

	const studentData = await getStudent(typeDni, dni);

	if(!studentData.length)
		res.status(404).json({ message: STUDENT_NOT_EXISTS, statusCode: 'STUDENT_NO_EXIST', code: 1 });

	const { tipo_doc, num_doc, alumno } = getFirstElement(studentData);
	const [studentPhone, studentEmail, studentCareer] = await Promise.all([
		getStudentPhone(tipo_doc, num_doc),
		checkEmailActive(tipo_doc, num_doc),
		checkCareer(tipo_doc, num_doc)
	]);

	if(!studentPhone.length)
		return res.status(404).json({ message: PHONE_NOT_FOUNT, statusCode: 'PHONE_NOT_FOUNT', code: 1 });

	if(!studentEmail.length)
		return res.status(404).json({ message: EMAIL_NOT_FOUNT, statusCode: 'EMAIL_NOT_FOUNT', code: 1 });

	if(!studentCareer.length)
		return res.status(404).json({ message: EMAIL_NOT_FOUNT, statusCode: 'EMAIL_NOT_FOUNT', code: 1 });

	const career = studentCareer.find(({ ID_CARRERA }) => ID_CARRERA === idCareer);

	if(!career)
		return res.status(404).json({ message: CAREER_NOT_EXISTS(idCareer), statusCode: 'CAREER_NOT_EXISTS', code: 1 });

	const dataToSend = {
		student: alumno,
		dni: num_doc,
		career: career.DESCRIPCION,
		phone: getFirstElement(studentPhone).NRO_TE,
		email: getFirstElement(studentEmail).E_MAIL,
		dispatchPlace,
		formalities,
		other
	};

	const emailTemplate = template(dataToSend);

	await sendEmail('croldan@ies21.edu.ar;  dnoe@ies21.edu.ar', email, 'Web Alumnos', 'SOLICITUD DE TRAMITE', emailTemplate, 'html');

	return res.status(200).json({ message: 'Los Datos se Enviaron Correctamente', statusCode: 'SUCCESS', code: 2 });
};

app.post('/', validateCertificateReq, handler);

module.exports = { app, handler };

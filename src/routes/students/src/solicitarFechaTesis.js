/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const {
	checkFechaTesis,
    sendEmail,
    webAuditory,
    solicitarFechaTesis
} = require('../../../services/procedures');
const { bodyToSend } = require('../../../../modules/email/solicitarFechaTesis');
const validateBody = require('../../util/structures/models/solicitarFechaTesis');
const authenticate = require('../../util/authentication/index');

const handler = async (req, res) => {

    const { ip } = req;

	const { dni, tipoDni: typeDni } = req.body._login;

	const {
        idCareer,
        nombres,
        apellidos,
        puesto,
        fechaTrabajo,
        observacion,
        fechaNacimiento,
        idLocalidad,
        dptoNac,
        mail,
        calle,
        torre,
        piso,
        dpto,
        idBarrio,
        codPostal,
        nroTP,
        nroTC,
        idEmpresa
    } = req.body;

	try {

		const infoBalance = await checkFechaTesis(typeDni, dni, 'F', idCareer);

        if(infoBalance.fechatesis !== null && (infoBalance.cond !== 'R' || infoBalance.cond !== 'F'))
            return res.status(404).json({message: 'Ud. no está habilitado para Solicitar una Fecha de Tesis', statusCode: 'VALIDATIONS_FAILED', code: 1});

        const dataToSend = {
            dni,
            apellidos,
            nombres,
            puesto: puesto ? puesto : '',
            fechaTrabajo: fechaTrabajo ? fechaTrabajo : '',
            observacion
        };

        const emailTemplate = bodyToSend(dataToSend);

        let bodyFechaTesis = {
            typeDni,
            dni,
            idCarrera: idCareer,
            apellidos,
            nombres,
            fechaNac: fechaNacimiento,
            lugarNac: idLocalidad,
            dptoNac,
            mail,
            calle,
            torre,
            piso,
            dpto,
            idBarrio,
            codPostal,
            nroTP,
            nroTC,
            idEmpresa: null,
            puesto: null,
            fechaTrabajo: null,
            observacion: null
        }

        if(idEmpresa === "" && puesto !== ""){
            bodyFechaTesis = {
                ...bodyFechaTesis,
                idEmpresa: 1,
                puesto: puesto,
                fechaTrabajo: fechaTrabajo,
                observacion: observacion
            }
        } else if(idEmpresa !== ""){
            bodyFechaTesis = {
                ...bodyFechaTesis,
                idEmpresa: idEmpresa,
                puesto: puesto,
                fechaTrabajo: fechaTrabajo,
                observacion: observacion
            }
        }

        await sendEmail(
            'croldan@ies21.edu.ar',
            'sistemas@ies21.edu.ar',
            'Web Alumnos',
            'Fecha Tesis',
            emailTemplate,
            'html'
        );

        const responseSolicitarFechaTesis = await solicitarFechaTesis(bodyFechaTesis)

        if(responseSolicitarFechaTesis === "S"){
            await webAuditory(typeDni, dni, 'solicitar-fecha-tesis', 'solicitud fecha tesis', ip);
        }

		return res.status(200).json({message: 'Solicitud realizada correctamente.'});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateBody, authenticate, handler);

module.exports = { app, handler };

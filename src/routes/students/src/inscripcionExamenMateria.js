/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const {
	insertFinalesExamenes,
    webAuditory,
    sendEmailForStudentWithDifficultiesCopy
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');
const validateBody = require('../../util/structures/models/incripcionExamenMateria');

const { setResponseValueInscripcionExamenMateria } = require('../../util/functions/setStatus');

const handler = async (req, res) => {

    const { ip } = req;

	const { dni, tipoDni: typeDni } = req.body._login;

	const { idMesa, condicion, valor } = req.body;

	try {

        let bodyToSend = {
            typeDni,
            dni,
            idMesa
        }

        if(condicion === 'EQ'){
            bodyToSend = {...bodyToSend, buscarValor: 'N', tipoFinal: 'EQ'}
        }else{
            bodyToSend = {...bodyToSend, buscarValor: valor, tipoFinal: 'dematercur'}
        }

		const inscripcionExamen = await insertFinalesExamenes(bodyToSend);

		if(setResponseValueInscripcionExamenMateria[inscripcionExamen])
			return setResponseValueInscripcionExamenMateria[inscripcionExamen](res);

        const datasended = JSON.stringify(bodyToSend);

        const dataEmailStudent = {
            typeDni,
            dni,
            idCareer: 0,
            idSubject: idMesa
        }

        await Promise.all([
            webAuditory(typeDni, dni, 'inscripcion-examen-materia', datasended, ip),
            sendEmailForStudentWithDifficultiesCopy(dataEmailStudent)
        ]);

		return res.status(200).json({
            message: 'Ha finalizado el procesio de Inscripción. Se recomienda consultar detalle.',
            statusCode: 'OK',
            code: 2
        });
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateBody, authenticate, handler);

module.exports = { app, handler };

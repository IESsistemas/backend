/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();
const {
	insertFinalesExamenes,
    webAuditory,
    sendEmailForStudentWithDifficultiesCopy
} = require('../../../services/procedures');
const authenticate = require('../../util/authentication/index');

const { setResponseValueInscripcionCursillo } = require('../../util/functions/setStatus');

const handler = async (req, res) => {

    const { ip } = req;

	const { dni, tipoDni: typeDni } = req.body._login;

	const { idMesa, valor, idMateria } = req.query;

	try {

		const infoBalance = await insertFinalesExamenes({
            typeDni,
            dni,
            idMesa,
            buscarValor: valor,
            tipoFinal: 'dematercur'
        });

		if(setResponseValueInscripcionCursillo[infoBalance])
			return setResponseValueInscripcionCursillo[infoBalance](res);

        const bodyToSend = {
			typeDni,
			dni,
			idCareer: 0,
			idSubject: idMateria
		};

        await Promise.all([
            webAuditory(typeDni, dni, 'inscripcion-examen-cursillo', 'Inscripcion examen cursillo', ip),
            sendEmailForStudentWithDifficultiesCopy(bodyToSend)
        ]);

		return res.status(200).json({message: 'Inscripción exitosa'});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', authenticate, handler);

module.exports = { app, handler };

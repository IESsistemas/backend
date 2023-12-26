const errorCodes = require('../../../constants/errorCodes');

const {
	REDIRECT_TO_PERSONAL_INFORMATION,
	INVALID_SEMESTER_INSCRIPTION_HAS_SCOLARSHIP,
	NO_BALANCE,
	ALREADY_SUBJECT_INSCRIPTION
} = errorCodes;

const setStatus = {
	P: doc => {
		doc.estado = 'Provisoria';
	},
	D: doc => {
		doc.estado = 'Definitiva';
	}
};

const setStatusReincorporation = {
	S: doc => {
		if(doc.Fecha_Doa !== null)
			doc.ESTADO_ACTUAL = 'Aprobado por DOA, para quedar reincorporado debe pasar por Bedelía';
		else {
			doc.ESTADO_ACTUAL = `Aprobado por Docente.
			Para terminar con el trámite seguir los siguientes pasos:
			1-Solicitar eximición en depto DOA o abonar en Administración la reincorporación
			2-Dirigirse a Bedelía`;
		}
	},
	N: doc => {
		doc.ESTADO_ACTUAL = 'Rechazado por Docente, comunicarse con Secretaría Académica';
	}
};

const translateTurn = {
	M: 'Mañana',
	T: 'Tarde',
	N: 'Noche'
};

const setResponseValue = {
	N: res => res.status(200).json({ message: REDIRECT_TO_PERSONAL_INFORMATION, statusCode: 'VALIDATIONS_FAILED', code: 1 }),
	B: res => res.status(200).json({ message: INVALID_SEMESTER_INSCRIPTION_HAS_SCOLARSHIP, statusCode: 'VALIDATIONS_FAILED', code: 1 })
};

const checkId = {
	1: doc => {
		doc.parcial = `1º Parcial, Nota: ${doc.nota1}`;
	},
	2: doc => {
		doc.parcial = `2º Parcial, Nota: ${doc.nota2}`;
	},
	3: doc => {
		doc.parcial = `Recuperatorio, Nota: ${doc.recup}`;
	}
};

const materiasNoAptas = {
	IN: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura porque se encuentra Libre por Inasistencias.';
	},
	LN: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura porque se encuentra Libre por Notas.';
	},
	LC: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura por problemas de correlatividades.';
	},
	LP: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura por problemas de porcentaje.';
	},
	RC: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura porque <b>debe una correlativa.';
	},
	RP: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura por problemas de porcentaje.';
	},
	FC: doc => {
		doc.NO_APTA = '"No puede rendir esta asignatura por problemas de correlatividades.';
	},
	BV: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura.';
	},
	FP: doc => {
		doc.NO_APTA = 'No puede rendir esta asignatura por problemas de porcentaje.';
	}
}

const setResponseValueInscripcionCursillo = {
	S: res => res.status(200).json({ message: NO_BALANCE, statusCode: 'VALIDATIONS_FAILED', code: 1 }),
	D: res => res.status(200).json({ message: ALREADY_SUBJECT_INSCRIPTION, statusCode: 'VALIDATIONS_FAILED', code: 1 })
};

const setResponseValueInscripcionExamenMateria = {
	S: res => res.status(404).json({
		message: 'Posiblemente exista un problema con el saldo. Consultar en Administración.',
		statusCode: 'VALIDATIONS_FAILED',
		code: 1
	}),
	D: res => res.status(404).json({
		message: 'Atención... Error en la Inscripción. No se puede rendir más de una asignatura por día.',
		statusCode: 'VALIDATIONS_FAILED',
		code: 1
	}),
	X: res => res.status(404).json({
		message: 'Atención... Error en la Inscripción. Consultar en Administración.',
		statusCode: 'VALIDATIONS_FAILED',
		code: 1
	}),
};

module.exports = {
	setStatus,
	setStatusReincorporation,
	setResponseValue,
	translateTurn,
	checkId,
	materiasNoAptas,
	setResponseValueInscripcionCursillo,
	setResponseValueInscripcionExamenMateria
};

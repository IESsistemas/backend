/* eslint-disable camelcase */
const { sql } = require('../../modules/database/db');
const { getFirstElement } = require('../routes/util/arrayUtil');

let pool;

const setPool = newPool => {
	pool = newPool;
};

const webAuditory = async (typeDni, dni, page, userAgent, remoteHost) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Pantalla', sql.VarChar, page)
			.input('User_Agent', sql.VarChar, userAgent)
			.input('Remote_Host', sql.VarChar, remoteHost)
			.execute('PA_INSERT_AUDITORIA_WEB');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}
};

const addNewEmailStudent = async (typeDni, dni, idTypeEmail, newEmail, active) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Tipo_Mail', sql.Char, idTypeEmail)
			.input('E_Mail', sql.VarChar, newEmail)
			.input('Activo_sp', sql.Char, active)
			.execute('PA_INSERT_ALU_MAIL');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const addNewPhoneStudent = async ({
	typeDni, dni, idTypePhone, newPhone, observations
}) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.input('Id_Tipo_Te_SP', sql.Char, idTypePhone)
			.input('Nro_Te_SP', sql.VarChar, newPhone)
			.input('Te_Observaciones_SP', sql.Text, observations)
			.execute('PA_INSERT_ALU_TE');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const applyReincorporation = async ({
	typeDni, dni, idCareer, idSubject, semester, year, identificator, certificate, observations
}) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.VarChar, dni)
			.input('Id_Carrera', sql.Int, idCareer)
			.input('Id_Materia', sql.Int, idSubject)
			.input('Semestre', sql.TinyInt, semester)
			.input('Año', sql.Int, year)
			.input('Identificador', sql.Char, identificator)
			.input('Presenta_Certificado', sql.Char, certificate)
			.input('Observacion', sql.VarChar, observations)
			.execute('PA_UPDATE_SOLICITUD_REINCORPORACIONES');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const applyInterviewDoa = async ({
	typeDniInterviewer, dniInterviewer, typeDniStudent, dniStudent, date, time, idTypeInterview
}) => {
	try {
		const request = pool.request();
		request.input('tipo_doc', sql.TinyInt, typeDniInterviewer);
		request.input('num_doc', sql.VarChar, dniInterviewer);
		request.input('fecha', sql.SmallDateTime, date);
		request.input('hora', sql.VarChar, time);
		request.input('tipo_doc_alumno', sql.TinyInt, typeDniStudent);
		request.input('num_doc_alumno', sql.VarChar, dniStudent);
		request.input('tipo_entrevista', sql.Int, idTypeInterview);
		request.output('salida', sql.Int);

		const result = await request.execute('PA_UPDATE_DOA_TURNOS_ENTREVISTAS');
		const response = result.output;

		const { salida } = response;

		return salida;
	} catch(error) {
		throw new Error(error.message);
	}
};

const cancelInterviewDoa = async ({
	typeDni, dni, date, time, result
}) => {

	try {
		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.input('fecha', sql.SmallDateTime, date)
			.input('hora', sql.VarChar, time)
			.input('resultado', sql.Int, result)
			.execute('PA_UPDATE_DOA_TURNOS_ENTREVISTAS_RESULTADO');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const checkBalance = async (typeDni, dni) => {
	try {
		const request = pool.request();
		request.input('TIPO_DOC', sql.TinyInt, typeDni);
		request.input('NUM_DOC', sql.Char, dni);
		request.output('TOT', sql.Money);

		const result = await request.execute('PA_SELECT_SALDO');
		const response = result.output;

		const balance = response.TOT; // Obtener el saldo de la cuenta desde el resultado

		return balance;
	} catch(error) {
		throw new Error(error.message);
	}
};

const checkBalanceWeb = async (typeDni, dni, identit) => {
	try {
		const request = pool.request();
		request.input('Tipo_Doc', sql.TinyInt, typeDni);
		request.input('Num_Doc', sql.Char, dni);
		request.input('Identif', sql.Char, identit);
		request.output('total', sql.Money);

		const result = await request.execute('PA_SELECT_SALDO_WEB');
		const response = result.output;

		const balance = response.total; // Obtener el saldo de la cuenta desde el resultado

		return balance;
	} catch(error) {
		throw new Error(error.message);
	}
};

const checkDateDOAStudent = async (typeDni, dni) => {

	try {
		const { recordset: response } = await pool.request()
			.input('tipo_doc_alumno', sql.TinyInt, typeDni)
			.input('num_doc_alumno', sql.VarChar, dni)
			.execute('PA_SELECT_DOA_TURNOS_ENTREVISTAS_PENDIENTES_POR_ALUMNO');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const checkNewStudent = async (typeDni, dni, type) => {

	try {
		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('INGRESANTE', sql.Char, type)
			.execute('PA_BUSCA_INGRESANTE');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const checkPagaresWeb = async (typeDni, dni, identif) => {

	try {
		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('IDENTIF', sql.Char, identif)
			.execute('PA_SELECT_PAGARES_WEB');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const checkPin = async (dni, password) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Num_Doc', sql.Char, dni)
			.input('Pin', sql.VarChar, password)
			.execute('PA_CHECK_PIN');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const checkInscription = async dni => {

	try {
		const { recordset: response } = await pool.request()
			.input('Num_Doc', sql.Char, dni)
			.execute('pa_select_INSCRIPTO_CURSO_DOCENTE');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}
};

const checkScolarship = async () => {

	try {
		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_PERIODO_BECA');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}
};

const checkSurvey = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_ENCUESTA', sql.Int, 0)
			.execute('PA_SELECT_DETECTA_ENCUESTAS_AREALIZAR_MODELONUEVO');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}

};

const checkInhabilitation = async (typeDni, dni, type) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Tipo', sql.Char, type)
			.execute('PA_SELECT_INHABILITADO_BY_NUM_DOC');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}

};

const getStudent = async (typeDni, dni) => {
	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.execute('PA_SELECT_ALUMNOS');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getSemestralSchedule = async () => {
	try {
		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_CRONOGRAMA_SEMESTRAL');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const checkPasswordExpiration = async (typeDni, dni) => {
	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.execute('PA_SELECT_ALUMNOS');

		const convertedResponse = response.map(row => {
			if(row.Fecha_Nac && typeof row.Fecha_Nac === 'object') {
				const utcDate = row.Fecha_Nac;
				const utcOffset = utcDate.getTimezoneOffset();
				const utcDateAdjusted = new Date(utcDate.getTime() + (utcOffset * 60000));
				row.Fecha_Nac = utcDateAdjusted;
			}

			if(row.vencimiento_pin && typeof row.vencimiento_pin === 'object') {
				const utcDate = row.vencimiento_pin;
				const utcOffset = utcDate.getTimezoneOffset();
				const utcDateAdjusted = new Date(utcDate.getTime() + (utcOffset * 60000));
				row.vencimiento_pin = utcDateAdjusted;
			}

			return row;
		});

		return convertedResponse;
	} catch(error) {
		throw new Error(error.message);
	}
};

const checkEmailActive = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.execute('PA_SELECT_ALU_MAIL');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const checkReincorporationAvailable = async (typeDni, dni, idCareer) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.input('ID_CARRERA', sql.SmallInt, idCareer)
			.execute('PA_SELECT_REINCORPORACION_COMP');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const checkStudentRegulations = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.execute('PA_VERIFICA_REGLAMENTO_ALUMNO');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const checkCareer = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.execute('PA_SELECT_ALU_CARRERA');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const checkFechaTesis = async (typeDni, dni, activo, idCareer) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.input('Activo', sql.Char, activo)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.execute('PA_SELECT_ALU_CARRERA');

		return getFirstElement(response);

	} catch(error) {

		throw new Error(error.message);
	}
};

const checkCareers = async (typeDni, dni, idCareer) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC_SP', sql.TinyInt, typeDni)
			.input('NUM_DOC_SP', sql.Char, dni)
			.input('IDCARRERA', sql.Int, idCareer)
			.execute('PA_SELECT_ALU_CARRERAS');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const changePassword = async (typeDni, dni, oldPassword, newPassword) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('OLD_PIN', sql.VarChar, oldPassword)
			.input('NEW_PIN', sql.VarChar, newPassword)
			.execute('PA_CAMBIO_PIN');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const deleteAddress = async (typeDni, dni, idTypeAddress) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_doc_SP', sql.Char, dni)
			.input('Id_Tipo_Domi', sql.Char, idTypeAddress)
			.execute('PA_DELETE_ALU_DOMI');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const deletePhone = async (typeDni, dni, idTypePhone) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.input('Id_Tipo_Te_SP', sql.Char, idTypePhone)
			.execute('PA_DELETE_ALU_TE');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const forwardEmailConfirmation = async dni => {

	try {

		const { recordset: response } = await pool.request()
			.input('Num_Doc', sql.VarChar, dni)
			.execute('PA_CAMBIO_DATOS_PERSONALES_AVISOXMAIL');

		return response;

	} catch(error) {

		throw new Error(error.message);
	}
};

const getAbsence = async (idCareer, typeDni, dni, identit) => {
	try {

		const { recordset: response } = await pool.request()
			.input('IDCAR', sql.TinyInt, idCareer)
			.input('TIPDOC', sql.TinyInt, typeDni)
			.input('NUMDOC', sql.Char, dni)
			.input('IDENTIF', sql.Char, identit)
			.execute('PA_BUSCAINASISTENCIA');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getAbsencePreInscription = async (idCareer, typeDni, dni, identit) => {
	try {

		const { recordset: response } = await pool.request()
			.input('IDCAR', sql.TinyInt, idCareer)
			.input('TIPDOC', sql.TinyInt, typeDni)
			.input('NUMDOC', sql.Char, dni)
			.input('IDENTIF', sql.Char, identit)
			.execute('pa_buscainasistencia_preinsc_por_alumno');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getAreas = async type => {
	try {

		const { recordset: response } = await pool.request()
			.input('Ident', sql.Char, type)
			.execute('PA_SELECT_AREAS_PERSONAL');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getActualDate = async () => {
	try {

		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_GETFECHA_Detallada');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getAddressAvailablesToInsert = async (identit, typeDni, dni) => {
	try {

		const { recordset: response } = await pool.request()
			.input('IDENTIT', sql.Char, identit)
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.execute('pa_select_TIPO_DOMI');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getAddressInfo = async (typeDni, dni, typeAddress) => {
	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.input('Tipo_Domi', sql.Char, typeAddress)
			.execute('PA_SELECT_ALU_DOMI');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getAnswers = async (idSurvey, idGroupQuestion, idQuestion) => {
	try {

		const { recordset: response } = await pool.request()
			.input('id_encuesta', sql.Int, idSurvey)
			.input('id_grupopreg', sql.SmallInt, idGroupQuestion)
			.input('id_pregunta', sql.Int, idQuestion)
			.execute('PA_SELECT_PREGUNTAS_RESPUESTAS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getBanner = async type => {
	try {

		const { recordset: response } = await pool.request()
			.input('IDENTIF', sql.Char, type)
			.execute('PA_BANNER_ALUMNOS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getCountries = async () => {
	try {

		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_PAISES');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getCompanies = async () => {
	try {

		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_EMPRESAS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getDateAbsence = async (subject, typeDni, dni, semester, year) => {
	try {

		const { recordset: response } = await pool.request()
			.input('Id_materia', sql.Int, subject)
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_doc', sql.Char, dni)
			.input('Semestre', sql.TinyInt, semester)
			.input('Año', sql.Int, year)
			.execute('PA_SELECT_FECHA_INASIST');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getDocumentationFile = async (typeDni, dni, idCareer) => {
	try {

		const request = pool.request();
		request.input('Tipo_Doc_sp', sql.TinyInt, typeDni);
		request.input('Num_Doc_sp', sql.Char, dni);
		request.input('Id_Carrera', sql.Int, idCareer);
		request.output('Resultado', sql.Char);

		const result = await request.execute('PA_LIBRE_DOCUMENTACION');
		const response = result.output;

		const output = response.Resultado.trim();

		return output;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getGroupQuestionsSurvey = async idSurvey => {
	try {

		const { recordset: response } = await pool.request()
			.input('id_encuesta', sql.Int, idSurvey)
			.execute('PA_SELECT_GRUPO_PREG_ENCUESTAS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getScolarshipHistory = async (typeDni, dni, idCareer, identit) => {
	try {

		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.input('id_carrera', sql.SmallInt, idCareer)
			.input('IDENTIF', sql.Char, identit)
			.execute('PA_SELECT_BECA_ALUMNO_SOLICITUD');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getInterviewDoaAvailable = async (typeDni, dni) => {
	try {

		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.execute('PA_SELECT_DOA_TURNOS_ENTREVISTAS_DISPONIBLES');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getLocalities = async idProvince => {
	try {

		const { recordset: response } = await pool.request()
			.input('Id_Provincia', sql.Int, idProvince)
			.execute('PA_SELECT_LOCALIDAD_PROVINCIA');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getInfoBoletas = async (
	cuenta,
	num_comp,
	p_vta,
	tipo,
	fecha,
	tipoDni,
	dni
) => {
	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_COMP', sql.Char, 'RE')
			.input('NUM_COMP', sql.Int, num_comp)
			.input('TIPO', sql.Char, tipo)
			.input('FECHA', sql.DateTime, fecha.substr(0, 10))
			.input('NUM_CUENTA', sql.Int, cuenta)
			.input('PTO_VTA', sql.SmallInt, p_vta)
			.input('TIPO_DOC', sql.TinyInt, tipoDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.execute('pa_select_COMP_TIPO_PAGO');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getNeighbours = async idLocalty => {
	try {

		const { recordset: response } = await pool.request()
			.input('Id_Localidad_SP', sql.Int, idLocalty)
			.execute('PA_SELECT_BARRIOS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getProvinces = async idCountry => {
	try {

		const { recordset: response } = await pool.request()
			.input('Id_Pais', sql.Int, idCountry)
			.execute('PA_SELECT_PROVINCIAS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getQuestions = async (idSurvey, idGroupQuestion) => {
	try {

		const { recordset: response } = await pool.request()
			.input('id_encuesta', sql.Int, idSurvey)
			.input('id_grupopreg', sql.Int, idGroupQuestion)
			.execute('PA_SELECT_ENCUESTAS_PREGUNTAS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getRequestSoftware = async (typeDni, dni, idSoft) => {
	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.input('ID_SOFT', sql.TinyInt, idSoft)
			.execute('PA_SELECT_SOFTWARE_ENTREGADO_ALUMNOS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getStudentPhone = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC_SP', sql.TinyInt, typeDni)
			.input('NUM_DOC_SP', sql.Char, dni)
			.execute('PA_SELECT_ALU_TE');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getStatusDocumentationStudent = async (typeDni, dni, identit) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TipoDoc', sql.TinyInt, typeDni)
			.input('NumDoc', sql.Char, dni)
			.input('Identit', sql.Char, identit)
			.execute('PA_SELECT_DOC_ENTREGADA');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getVirtualLibrary = async (typeDni, dni, idCareer) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC_SP', sql.Int, typeDni)
			.input('NUM_DOC_SP', sql.VarChar, dni)
			.input('ID_CARRERA_SP', sql.Int, idCareer)
			.execute('pa_select_alumnos_biblioteca_virtual');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getPrincipals = async () => {

	try {

		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_DIRECTORES_CARRERAS');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const getCoupons = async (typeDni, dni) => {

	try {
		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.execute('PA_SELECT_CANTIDAD_DE_CUPONES');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const initialBalance = async (typeDni, dni, identif) => {

	try {
		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.Char, dni)
			.input('identif', sql.TinyInt, identif)
			.execute('PA_SELECT_ALUSALDO');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const insertAddress = async ({
	typeDni, dni, idTypeAddress, street, tower, floor, apartment, idNeighborhood, zipCode
}) => {

	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_doc_SP', sql.Char, dni)
			.input('Id_tipo_Domi_SP', sql.Char, idTypeAddress)
			.input('Calle_SP', sql.VarChar, street)
			.input('Torre_SP', sql.VarChar, tower)
			.input('Piso_SP', sql.VarChar, floor)
			.input('Dpto_SP', sql.VarChar, apartment)
			.input('Id_barrio_SP', sql.Int, idNeighborhood)
			.input('cod_postal', sql.VarChar, zipCode)
			.execute('PA_INSERT_ALU_DOMI');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const insertSurveyAnswer = async ({
	idEncuestaRespuesta, idEncuesta, idPregunta, idGrupoPreg, idRespuesta, observacion, orden
}) => {

	try {

		const request = pool.request();
		request.input('ID_ENC_RESPUESTA', sql.Int, idEncuestaRespuesta);
		request.input('ID_ENCUESTA', sql.Int, idEncuesta);
		request.input('ID_PREGUNTA', sql.Int, idPregunta);
		request.input('id_grupopreg', sql.SmallInt, idGrupoPreg);
		request.input('ID_RESPUESTA', sql.Int, idRespuesta);
		request.input('OBSERVACION', sql.Text, observacion);
		request.input('ORDEN', sql.TinyInt, orden);
		request.output('SALIDA', sql.Char);

		const result = await request.execute('PA_INSERT_ENC_RESPUESTAS_DETALLE');
		const response = result.output;

		const responseAnswer = response.SALIDA;

		return responseAnswer;
	} catch(error) {

		throw new Error(error.message);
	}

};

const insertSurveyData = async ({
	idEncuesta, idCtroExt, idModalidad, idCarrera, idMateria, idComision, typeDni, dni
}) => {

	try {

		const request = pool.request();
		request.input('ID_ENCUESTA', sql.Int, idEncuesta);
		request.input('ID_CTROEXT', sql.Char, idCtroExt);
		request.input('ID_MODALIDAD', sql.Char, idModalidad);
		request.input('ID_CARRERA', sql.SmallInt, idCarrera);
		request.input('ID_MATERIA', sql.Int, idMateria);
		request.input('ID_COMISION', sql.TinyInt, idComision);
		request.input('TIPO_DOC', sql.TinyInt, typeDni);
		request.input('NUM_DOC', sql.Char, dni);
		request.output('SALIDA', sql.Char);
		request.output('CODIGO', sql.Int);

		const result = await request.execute('PA_INSERT_ENCUESTAS_ALUMNOS_MODNUEVO');
		const response = result.output;

		const responseAnswer = {
			salida: response.SALIDA,
			codigo: response.CODIGO
		};

		return responseAnswer;

	} catch(error) {

		throw new Error(error.message);
	}

};

const postInitialBalance = async (typeDni, dni) => {

	try {
		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.Char, dni)
			.execute('PA_SELECT_ALU_MOVIM');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const requestSoftware = async (typeDni, dni, idSoftware, deliver) => {

	try {
		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.input('ID_SOFTWARE', sql.Int, idSoftware)
			.input('ENTREGA', sql.Char, deliver)
			.execute('PA_INSERT_SOFTWARE_ALUMNO');

		return response;
	} catch(error) {

		throw new Error(error.message);
	}

};

const sendEmail = async (to, from, nameFrom, subject, message, type) => {
	try {

		const { recordset: response } = await pool.request()
			.input('PARA', sql.VarChar, to)
			.input('DE', sql.VarChar, from)
			.input('NOMBREDE', sql.VarChar, nameFrom)
			.input('ASUNTO', sql.VarChar, subject)
			.input('MSJ', sql.VarChar, message)
			.input('IDENTIF', sql.VarChar, type)
			.execute('PA_ENVIO_UN_EMAIL');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const signRaiStudent = async (typeDni, dni, type) => {
	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.input('TIPO', sql.Char, type)
			.execute('PA_INSERT_DOC_ENTREGADA_LEEINSTRUCTIVO');

		return response;

	} catch(error) {

		throw new Error(error.message);

	}
};

const updateExpireDatePassword = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.Char, dni)
			.execute('PA_UPDATE_ALUMNOS_VENCIMIENTO_PIN');

		return response;

	} catch(error) {
		throw new Error(error.message);
	}
};

const updateDateTime = async dni => {
	try {

		const { recordset: response } = await pool.request()
			.input('Num_Doc_sp', sql.Char, dni)
			.execute('PA_UPDATE_ALUMNOS_FECHA_MODIF');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}
};

const getStudentCalendar = async ({
	typeDni, dni, idCareer, variable, years
}) => {
	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.Int, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('CARRERA', sql.Int, idCareer)
			.input('VARIABLE', sql.Char, variable)
			.input('AÑOS', sql.Char, years)
			.execute('PA_SELECT_CALENDARIO_ALUMNO');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}
};

const gradeBook = async ({
	typeDni, dni, idCareer, years
}) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.input('Parametro', sql.Char, 'A')
			.input('AÑOS', sql.Char, years)
			.execute('PA_SELECT_LIBRO_MATRIZ');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getStudentScholarship = async ({
	dni, semestre, year
}) => {

	try {

		const { recordset: response } = await pool.request()
			.input('DNI', sql.VarChar, dni)
			.input('identit', sql.Char, 'A')
			.input('Semestre', sql.Int, semestre)
			.input('Año', sql.Int, year)
			.execute('PA_SELECT_BECA_ALUMNO');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const 	getSubjectsTaken = async ({ typeDni, dni, idCareer }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.VarChar, dni)
			.input('id_Carrera', sql.SmallInt, idCareer)
			.execute('PA_SELECT_ANALITICO_FINALES_CUR');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getTableTeacher = async (id, identit = 'X') => {
	try {
		const { recordset: response } = await pool.request()
			.input('ID_GRUPOMESA', sql.Int, id)
			.input('IDENTIT', sql.Char, identit)
			.execute('PA_SELECT_PROFE_MESA');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getEquivalencies = async ({ typeDni, dni, idCareer }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.execute('PA_SELECT_ANALITICO_EQUIVALENCIAS');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getUnbilledEquivalencies = async ({ typeDni, dni, idCareer, years }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.input('AÑOS', sql.SmallInt, years)
			.execute('PA_SELECT_ANALITICO_COMP_EQUIVALENCIAS');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getSubjectsInProgress = async ({ typeDni, dni, idCareer, years }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_CARRERA', sql.SmallInt, idCareer)
			.input('AÑOS', sql.SmallInt, years)
			.execute('PA_SELECT_ANALITICO_CURSANDO_2013');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getRegularizedSubjects = async ({ typeDni, dni, idCareer }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_CARRERA', sql.Int, idCareer)
			.execute('PA_SELECT_ANALITICO_NO_RENDIDAS');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getCorrelatives = async ({ dni, idCareer }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('ID_CARRERA', sql.Int, idCareer)
			.input('num_doc', sql.VarChar, dni)
			.execute('PA_SELECT_CORRELATIVAS_MOSTRARWEB');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getStudyPlan = async ({ idCareer, typeDni, dni }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Id_Plan_Estudio_SP', sql.Char, '000')
			.input('Id_Carrera_SP', sql.SmallInt, idCareer)
			.input('Id_Materia_SP', sql.Int, 0)
			.input('Tesis', sql.Char, null)
			.input('Identit', sql.Char, null)
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.VarChar, dni)
			.execute('PA_SELECT_MATERIAS_PLAN_EST');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getControlDataSemester = async ({ typeDni, dni }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.execute('PA_CONTROL_DATOS');

		return getFirstElement(response);

	} catch(error) {
		throw new Error(error.message);

	}

};

const getControlHabilitationInscriptionSemester = async () => {

	try {

		const { recordset: response } = await pool.request()
			.execute('PA_CONTROL_HABILITACION_INSCRIWEB');

		return getFirstElement(response);

	} catch(error) {
		throw new Error(error.message);

	}

};

const getMaxValueRegister = async () => {

	try {

		const { recordset: response } = await pool.request()
			.execute('PA_SELECT_BUSCAR_MAXVALORMATRICULA');

		return getFirstElement(response);

	} catch(error) {
		throw new Error(error.message);

	}

};

const getSubjectsAvailablesToCourse = async ({ typeDni, dni, idCareer }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('TIPO_DOC_SP', sql.TinyInt, typeDni)
			.input('NUM_DOC_SP', sql.Char, dni)
			.input('ID_CARRERA_SP', sql.SmallInt, idCareer)
			.execute('MAT_CURSAR_PRUEBA');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getModalityCourse = async ({ typeDni, dni, idCareer }) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.VarChar, dni)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.execute('PA_SELECT_MODALIDAD_ALUMNO');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getSubjectsPreEnrolled = async ({
	typeDni, dni, idCareer, shortCourse, whereUse, years
}) => {
	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.input('Cursillo', sql.Char, shortCourse)
			.input('Dondelouso', sql.Char, whereUse)
			.input('AÑOS', sql.Char, years)
			.execute('PA_SELECT_COMP_ALU_MATERIA');
		return response;

	} catch(error) {
		throw new Error(error.message);

	}

};

const getSubjectsEnrolled = async ({
	typeDni, dni, idCareer, identif, whereUse
}) => {

	try {

		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Carrera', sql.SmallInt, idCareer)
			.input('Identif', sql.Char, identif)
			.input('dondeuso', sql.Char, whereUse)
			.execute('PA_SELECT_INSCRIPTAS');

		return response;

	} catch(error) {
		throw new Error(error.message);

	}
};
const searchAcademicExceptions = async () => {
	try {
		const { recordset: response } = await pool.request()
			.input('Semestre', sql.TinyInt, 0)
			.input('Año', sql.Int, 0)
			.input('Ctro', sql.Char, 'co')
			.input('Modalidad', sql.Char, 'p')
			.execute('pa_BUSCO_ACTIV_CUAT_ESPECIAL');

		return getFirstElement(response);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getSubjectsExceptions = async (typeDni, dni) => {
	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_doc', sql.Char, dni)
			.input('Identificador', sql.Char, 'Y')
			.execute('PA_SELECT_ALU_EXCEP_ACADEMICAS');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getAcademicExceptionToConditionalCourse = async (typeDni, dni, idCareer, identification = 'M', semester = null, year = null) => {
	try {
		const { recordset: response } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_doc', sql.Char, dni)
			.input('Identificador', sql.Char, identification)
			.input('Semestre_SP', sql.TinyInt, semester)
			.input('Anio_SP', sql.Int, year)
			.input('Id_Carrera_o_SP', sql.Int, idCareer)
			.execute('PA_SELECT_ALU_EXCEP_ACADEMICAS');
		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getAcademicExceptionPermittedListeners = async ({ typeDni, dni, idCareer }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_CARRERA', sql.Int, idCareer)
			.execute('PA_SELECT_EXCEPCIONES_ACADEMICAS_PERMITIDAS_OYENTES');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getAcademicExceptionsSubjects = async ({
	semester, year, typeDni, dni, idSubject, idCareer, ident = 'O'
}) => {
	try {
		const { recordset } = await pool.request()
			.input('SEMESTRE', sql.TinyInt, semester)
			.input('ANIO', sql.Int, year)
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_MATERIA', sql.Int, idSubject)
			.input('ID_CARRERA', sql.TinyInt, idCareer)
			.input('IDENT', sql.Char, ident)
			.execute('PA_SELECT_MATERIAS_EXCEPCIONES_ACADEMICAS');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const matCursarPrueba = async ({ typeDni, dni, idCareer }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC_SP', sql.TinyInt, typeDni)
			.input('NUM_DOC_SP', sql.Char, dni)
			.input('ID_CARRERA_SP', sql.SmallInt, idCareer)
			.execute('Mat_cursar_PRUEBA');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const commissionSubject = async ({ idCareer, idSubject, idStudyPlan, idModality }) => {
	try {
		const { recordset } = await pool.request()
			.input('Id_Carrera_SP', sql.SmallInt, idCareer)
			.input('Id_Materia_SP', sql.Int, idSubject)
			.input('Id_Plan_Estudio_SP', sql.Char, idStudyPlan)
			.input('Id_Modalidad', sql.Char, idModality)
			.execute('PA_BUSCA_TyD_Cuatri');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getPaymentWay = async paymentType => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Pago', sql.Char, paymentType)
			.execute('PA_SELECT_RECARGO_PAGO');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const applySubjectSemesterInscription = async ({
	typeDni, dni, idCareer, idSubject, idExtensionCenter, idCommission, idModality
}) => {
	try {
		const request = pool.request();
		request.input('TIPO_DOC', sql.SmallInt, typeDni);
		request.input('NUM_DOC', sql.Char, dni);
		request.input('ID_CTROEXT', sql.Char, idExtensionCenter);
		request.input('ID_CARRERA', sql.SmallInt, idCareer);
		request.input('ID_MATERIA', sql.Int, idSubject);
		request.input('ID_COMISION', sql.Int, idCommission);
		request.input('ID_TURNOCUR', sql.Int, 0);
		request.input('ID_MODALIDAD', sql.Char, idModality);
		request.input('IDENTIF', sql.Char, 'B');
		request.output('SALIDA', sql.Char);

		const result = await request.execute('PA_INSERT_COMP_ALU_MATERIA');
		const response = result.output;

		const responseAnswer = response.SALIDA;

		return responseAnswer;

	} catch(error) {
		throw new Error(error.message);
	}
};

const getPaymentMethodByType = async paymentType => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_PAGO', sql.Char, paymentType)
			.execute('PA_SELECT_TIPO_PAGO');

		return getFirstElement(recordset);
	} catch(error) {
		throw new Error(error.message);
	}
};

const sendEmailForStudentWithDifficulties = async ({ typeDni, dni, idCareer, idSubject }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.input('ID_CARRERA', sql.Int, idCareer)
			.input('ID_MATERIA', sql.Int, idSubject)
			.input('IDENTIT', sql.Char, 'C')
			.input('IDENTIT1', sql.Char, 'Z')
			.execute('PA_SELECT_ALU_DIFICULTAD');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getCreditCardsTypes = async creditCardType => {
	try {
		const { recordset } = await pool.request()
			.input('descripcion', sql.Char, creditCardType)
			.execute('PA_SELECT_TARJETAS');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const sendAcademicException = async ({
	typeDni,
	dni,
	idSubject,
	originIdCareer,
	semester,
	year,
	destinationIdCareer,
	exceptionType,
	observations,
	exceptionStatus = 'P',
	idCatedra,
	idComision
}) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_doc', sql.Char, dni)
			.input('Id_materia', sql.Int, idSubject)
			.input('Id_carrera_o', sql.SmallInt, originIdCareer)
			.input('Semestre', sql.TinyInt, semester)
			.input('Año', sql.Int, year)
			.input('Id_carrera_d', sql.SmallInt, destinationIdCareer)
			.input('Id_catedra', sql.Int, idCatedra)
			.input('Id_comision', sql.TinyInt, idComision)
			.input('Tipo_excep', sql.Char, exceptionType)
			.input('Observaciones', sql.Char, observations)
			.input('Estado_excep', sql.Char, exceptionStatus)
			.execute('PA_INSERT_ALU_EXCEP_ACADEMICAS');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const updateSubjectSemesterInscription = async ({
	typeDni, dni, idCareer, idSubject, idExtensionCenter, idCommission, idModality
}) => {
	try {
		const request = pool.request();
		request.input('Tipo_Doc', sql.TinyInt, typeDni);
		request.input('Num_Doc', sql.Char, dni);
		request.input('Id_CtroExt', sql.Char, idExtensionCenter);
		request.input('Id_Carrera', sql.SmallInt, idCareer);
		request.input('Id_Materia', sql.Int, idSubject);
		request.input('Id_Comision', sql.Int, idCommission);
		request.input('Id_TurnoCur', sql.Int, 0);
		request.input('Id_Modalidad', sql.Char, idModality);
		request.input('Identif', sql.Char, 'B');
		request.output('Salida', sql.Char);

		const result = await request.execute('PA_UPDATE_COMP_ALU_MAT');
		const response = result.output;

		const responseAnswer = response.SALIDA;

		return responseAnswer;
	} catch(error) {
		throw new Error(error.message);
	}
};

const insertRegistration = async (typeDni, dni, idCareer) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_CARRERA', sql.SmallInt, idCareer)
			.execute('PA_INSERT_ALU_MATRICULA');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getModalityChangeAvailable = async (typeDni, dni) => {

	try {

		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.SmallInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.execute('pa_BUSCA_AUDITORIA_CAMBIOS_MODALIDAD');

		return response;

	} catch(error) {
		throw new Error(error.message);
	}
};

const getStudentName = async ({ typeDni, dni }) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_doc', sql.Char, dni)
			.execute('PA_verifica_ALUMNOS');

		return getFirstElement(recordset);
	} catch(error) {
		throw new Error(error.message);
	}
};

// const getMateriasCursar = async ({ typeDni, dni, idCareer }) => {
// 	try {
// 		const { recordset } = await pool.request()
// 			.input('Tipo_Doc', sql.TinyInt, typeDni)
// 			.input('Num_doc', sql.Char, dni)
// 			.execute('PA_verifica_ALUMNOS');

// 		return getFirstElement(recordset);
// 	} catch(error) {
// 		throw new Error(error.message);
// 	}
// };

const generatePromissoryNote = async ({
	dni, name, lastName, phone, address, location, promissoryNoteQuantity, applicantDni, typeDni
}) => {
	try {
		const { recordset } = await pool.request()
			.input('tipo_doc', sql.Int, typeDni)
			.input('num_doc', sql.Char, dni)
			.input('cantcuotas', sql.Char, promissoryNoteQuantity)
			.input('ctro', sql.Char, 'D')
			.input('dni_solicitante', sql.VarChar, applicantDni)
			.input('nombre', sql.VarChar, name)
			.input('apellido', sql.VarChar, lastName)
			.input('telefono', sql.VarChar, phone)
			.input('domicilio', sql.VarChar, address)
			.input('localidad', sql.VarChar, location)
			.execute('pa_GENERA_PAGARES_PROV_WEB');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getMidTermExams = async (typeDni, dni, identif) => {
	try {
		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.SmallInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.input('identificador', sql.Char, identif)
			.execute('PA_SELECT_ALU_MATERIA_PARCIALES');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const downloadMidTermExamsCorrected = async (idCatedra, semester, year, idMidTermExam, identif, typeDni, dni) => {
	try {
		const { recordset: response } = await pool.request()
			.input('idcatedra', sql.Int, idCatedra)
			.input('semestre', sql.Int, semester)
			.input('año', sql.Int, year)
			.input('idparciales', sql.Int, idMidTermExam)
			.input('parametro', sql.Char, identif)
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.Char, dni)
			.execute('PA_SELECT_CATEDRA_PARCIALES_ARCHIVOS');

		return getFirstElement(response);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getExamsFiles = async (dni, identif) => {
	try {
		const { recordset: response } = await pool.request()
			.input('Num_Doc_PROFE', sql.Char, dni)
			.input('Identit', sql.Char, identif)
			.execute('PA_SELECT_MESAS_PROFE_ARCHIVOS');

		return getFirstElement(response);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getParams = async idParameter => {
	try {
		const { recordset: response } = await pool.request()
			.input('Id_Parametro', sql.SmallInt, idParameter)
			.execute('PA_SELECT_PARAMETROS');

		return getFirstElement(response);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getExamFile = async (typeDni, dni, idTable, identit) => {
	try {
		const { recordset: response } = await pool.request()
			.input('TIPODOC', sql.SmallInt, typeDni)
			.input('NUMDOC', sql.Char, dni)
			.input('ID_MESA', sql.Int, idTable)
			.input('IDENTIFICADOR', sql.Char, identit)
			.execute('PA_SELECT_MESA_ARCHIVO');

		return getFirstElement(response);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getExamModel = async ({ typeDni, dni, idCareer, identit }) => {
	try {
		const { recordset: response } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.input('ID_CARRERA', sql.SmallInt, idCareer)
			.input('PARAM', sql.Char, identit)
			.execute('PA_SELECT_MODELO_EXAMEN');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getPreregisteredSubjects = async ({ typeDni, dni, idCareer, ident = 'p' }) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_doc', sql.SmallInt, typeDni)
			.input('Num_doc', sql.Char, dni)
			.input('Id_carrera', sql.Int, idCareer)
			.input('Ident', sql.Char, ident)
			.execute('pa_select_MATERIAS_CURSAR');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const insertTableFile = async ({
	typeDni, dni, idTable, idModel, nameFile, identit
}) => {
	try {
		const { recordset: response } = await pool.request()
			.input('tipo_doc', sql.SmallInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.input('Id_Mesa', sql.Int, idTable)
			.input('Id_Modelo', sql.Int, idModel)
			.input('Nombre_Archivo', sql.VarChar, nameFile)
			.input('parama', sql.Char, identit)
			.execute('PA_INSERT_MESA_ARCHIVO');

		return response;
	} catch(error) {
		throw new Error(error.message);
	}
};

const payWithCreditCard = async ({
	typeDni,
	dni,
	idCard,
	numberCard,
	cardExpiration,
	verificationCode,
	cardholder,
	paymentAmount,
	installments,
	phoneNumber
}) => {
	try {
		const { recordset } = await pool.request()
			.input('tipo_doc', sql.Int, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.input('id_tarjeta', sql.Int, idCard)
			.input('Numtarjeta', sql.VarChar, numberCard)
			.input('Fechavenc', sql.VarChar, cardExpiration)
			.input('Codverif', sql.VarChar, verificationCode)
			.input('Nombretitular', sql.VarChar, cardholder)
			.input('Importe', sql.Money, paymentAmount)
			.input('Cantcuotas', sql.Int, installments)
			.input('nrotelef', sql.VarChar, phoneNumber)
			.execute('PA_INSERT_ALU_VENTATEL');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getInfoRecivo = async ({
	tipoComp, num, tipo, fecha, nCuenta, pVta, tipoDoc, doc
}) => {
	try {
		const { recordset: response } = await pool.request()
			.input('TIPO_COMP', sql.Char, tipoComp)
			.input('NUM_COMP', sql.BigInt, num)
			.input('TIPO', sql.Char, tipo)
			.input('FECHA', sql.DateTime, fecha)
			.input('NUM_CUENTA', sql.SmallInt, nCuenta)
			.input('PTO_VTA', sql.SmallInt, pVta)
			.input('TIPO_DOC', sql.SmallInt, tipoDoc)
			.input('NUM_DOC', sql.Char, doc)
			.execute('PA_SELECT_COMP_TIPO_PAGO');

		return getFirstElement(response);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getCommissions = async ({
	ctroExt = 'CO', careerId, subjectId, modalityId, commissionId = 0
}) => {
	try {
		const { recordset } = await pool.request()
			.input('CtroExt', sql.Char, ctroExt)
			.input('Id_carrera', sql.TinyInt, careerId)
			.input('Id_materia', sql.Int, subjectId)
			.input('Id_modalidad', sql.Char, modalityId)
			.input('Id_comision', sql.Int, commissionId)
			.execute('PA_SELECT_MATER_MODULOS');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getProcessingPayments = async dni => {
	try {
		const { recordset } = await pool.request()
			.input('NUM_DOC', sql.Char, dni)
			.execute('PA_SELECT_ALUVENTATEL_PENDWEB');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getRejectedCards = async ({ dni, typeDni }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.execute('PA_SELECT_TARJETAS_RECHAZADAS');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getInfoPagare = async ({ dni, typeDni }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.Int, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.execute('pa_select_PAGARE_GENERADO_PARAWEB');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const healthcheck = async () => {
	try {
		const { recordset } = await pool.request()
			.input('Id_Parametro', sql.Int, 15)
			.execute('PA_SELECT_PARAMETROS');

		return getFirstElement(recordset);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getValorMatricula = async ({ typeDni, dni, idCareer }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.Char, dni)
			.input('ID_CARRERA', sql.TinyInt, idCareer)
			.input('IDENTIF', sql.Char, 'A')
			.execute('PA_SELECT_ALU_MATRICULA');

		return getFirstElement(recordset);
	} catch(error) {
		throw new Error(error.message);
	}
};

const generateRapipagoTicket = async ({ typeDni, dni }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.execute('PA_SELECT_CODIGO_BARRA');

		return getFirstElement(recordset);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getMessages = async ({ typeDni, dni }) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.execute('PA_SELECT_MENSAJES');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getPath = async type => {
	try {
		const { recordset } = await pool.request()
			.input('Id_Parametro', sql.SmallInt, type)
			.execute('PA_SELECT_PARAMETROS');

		return getFirstElement(recordset);
	} catch(error) {
		throw new Error(error.message);
	}
};

const getParcial = async ({ typeDni, dni }) => {
	try {
		const { recordset } = await pool.request()
			.input('tipo_doc', sql.TinyInt, typeDni)
			.input('num_doc', sql.Char, dni)
			.execute('pa_select_PARCIALES_WEB');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const insertParcialArchivo = async ({
	typeDni, dni, idCareer, idMateria, idPlanEstudio, semestre, anio, idParcial, idModParcial, nombreArchivo, parama
}) => {
	try {
		const { recordset } = await pool.request()
			.input('tipo_doc', sql.SmallInt, typeDni)
			.input('num_doc', sql.VarChar, dni)
			.input('id_carrera', sql.SmallInt, idCareer)
			.input('id_materia', sql.Int, idMateria)
			.input('id_plan_estudio', sql.Char, idPlanEstudio)
			.input('semestre', sql.Int, semestre)
			.input('anio', sql.Int, anio)
			.input('id_parcial', sql.Int, idParcial)
			.input('id_mod_parcial', sql.Int, idModParcial)
			.input('Nombre_Archivo', sql.VarChar, nombreArchivo)
			.input('parama', sql.Char, parama)
			.execute('PA_INSERT_PARCIAL_ARCHIVO');
		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getMateriasInscriptasCursillo = async ({
	idTurnoCursillo,
	idCarrera,
	idMateria,
	identit,
	idPlanEstudio,
	typeDni,
	dni
}) => {
	try {
		const { recordset } = await pool.request()
			.input('Id_Turno_Cursillo', sql.Int, idTurnoCursillo)
			.input('Id_Carrera', sql.Int, idCarrera)
			.input('Id_Materia', sql.Int, idMateria)
			.input('Identit', sql.Char, identit)
			.input('Id_Plan_Estudio_SP', sql.Char, idPlanEstudio)
			.input('Tipo_Doc_SP', sql.TinyInt, typeDni)
			.input('Num_Doc_SP', sql.Char, dni)
			.execute('PA_SELECT_FINALES_CURSILLO');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getModelosExamen = async dni => {
	try {
		const { recordset } = await pool.request()
			.input('num_doc', sql.VarChar, dni)
			.execute('pa_ALUMNOS_FINALES_VIRTUALES');
		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getMateriasInscripcionExamen = async ({
	typeDni,
	dni,
	idCareer
}) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Doc_sp', sql.Int, typeDni)
			.input('Num_Doc_sp', sql.Int, dni)
			.input('Id_Carrera_sp', sql.Int, idCareer)
			.execute('PA_MAT_RENDIR_PRUEBA');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getMateriasAInscribirCursillo = async ({
	typeDni,
	dni,
	idCareer
}) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC_SP', sql.Int, typeDni)
			.input('NUM_DOC_SP', sql.Int, dni)
			.input('ID_CARRERA_SP', sql.Int, idCareer)
			.execute('PA_MAT_RENDIR_CURSILLO');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getMesaExamenMateriaCursillo = async ({
	idMateria,
	idCarrera,
	idPlanEstudio,
	idCtroExt,
	idModalidad,
	identif,
	idComision,
	typeDni,
	dni
}) => {
	try {
		const { recordset } = await pool.request()
			.input('Id_Materia_SP1', sql.Int, idMateria)
			.input('Id_Carrera_SP1', sql.SmallInt, idCarrera)
			.input('Id_Plan_Estudio_SP1', sql.Char, idPlanEstudio)
			.input('Id_CtroExt1', sql.Char, idCtroExt)
			.input('Id_Modalidad1', sql.Char, idModalidad)
			.input('Identif1', sql.Char, identif)
			.input('Id_Comision1', sql.Int, idComision)
			.input('Tipo_doc1', sql.Int, typeDni)
			.input('Num_doc1', sql.Int, dni)
			.execute('PA_BUSCA_MESAS_X_MATERIA_CURSILLO');

		return recordset;

	} catch(error) {
		throw new Error(error.message);
	}
};

const getMesaExamenMateria = async ({
	idMateria,
	idCarrera,
	idPlanEstudio,
	idCtroExt,
	idModalidad,
	identif,
	idComision,
	ingreso
}) => {
	try {
		const { recordset } = await pool.request()
			.input('Id_Materia_SP', sql.Int, idMateria)
			.input('Id_Carrera_SP', sql.SmallInt, idCarrera)
			.input('Id_Plan_Estudio_SP', sql.Char, idPlanEstudio)
			.input('Id_CtroExt', sql.Char, idCtroExt)
			.input('Id_Modalidad', sql.Char, idModalidad)
			.input('Identif', sql.Char, identif)
			.input('Id_Comision', sql.Int, idComision)
			.input('Ingreso', sql.Int, ingreso)
			.execute('PA_BUSCA_MESAS_X_MATERIA');

		return recordset;

	} catch(error) {
		throw new Error(error.message);
	}
};

const controlPagareExamen = async ({
	typeDni,
	dni,
	fechaExamen
}) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Fecha_Examen', sql.DateTime, fechaExamen)
			.execute('PA_SELECT_CONTROL_PAGARES_EXAMEN');

		return recordset;

	} catch(error) {
		throw new Error(error.message);
	}
};

const insertFinalesExamenes = async ({
	typeDni,
	dni,
	idMesa,
	buscarValor,
	tipoFinal
}) => {
	try {
		const request = pool.request();
		request.input('Tipo_Doc_SP', sql.TinyInt, typeDni);
		request.input('Num_Doc_SP', sql.Char, dni);
		request.input('Id_Mesa', sql.Int, idMesa);
		request.input('tengoqbuscarvalor', sql.VarChar, buscarValor);
		request.input('tipofinal', sql.VarChar, tipoFinal);
		request.output('Control', sql.Char);

		const result = await request.execute('PA_INSERT_FINALES');
		const response = result.output;

		const res = response.Control.trim();

		return res;
	} catch(error) {
		throw new Error(error.message);
	}
};

const solicitarFechaTesis = async ({
	typeDni,
	dni,
	idCarrera,
	apellidos,
	nombres,
	fechaNac,
	lugarNac,
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
	idEmpresa,
	puesto,
	fechaTrabajo,
	observacion
}) => {
	try {
		const request = pool.request();
		request.input('Tipo_doc', sql.TinyInt, typeDni);
		request.input('Num_doc', sql.Char, dni);
		request.input('Id_Carrera', sql.SmallInt, idCarrera);
		request.input('Apellidos', sql.VarChar, apellidos);
		request.input('Nombres', sql.VarChar, nombres);
		request.input('Fecha_Nac', sql.DateTime, fechaNac);
		request.input('Lugar_Nac', sql.Int, lugarNac);
		request.input('Dpto_Nac', sql.VarChar, dptoNac);
		request.input('Mail', sql.VarChar, mail);
		request.input('Calle', sql.VarChar, calle);
		request.input('Torre', sql.VarChar, torre);
		request.input('Piso', sql.VarChar, piso);
		request.input('Dpto', sql.VarChar, dpto);
		request.input('Id_barrio', sql.Int, idBarrio);
		request.input('Cod_Postal', sql.VarChar, codPostal);
		request.input('Nro_Te_P', sql.VarChar, nroTP);
		request.input('Nro_Te_C', sql.VarChar, nroTC);
		request.input('id_empresa', sql.Int, idEmpresa);
		request.input('Puesto', sql.VarChar, puesto);
		request.input('Fecha_Trabajo', sql.DateTime, fechaTrabajo);
		request.input('Obs', sql.VarChar, observacion);
		request.output('Salida', sql.Char);

		const result = await request.execute('PA_UPDATE_ALU_DATOS_FECHATESIS');
		const response = result.output;

		const res = response.Salida.trim();

		return res;
	} catch(error) {
		throw new Error(error.message);
	}
};

const sendEmailForStudentWithDifficultiesCopy = async ({ typeDni, dni, idCareer, idSubject }) => {
	try {
		const { recordset } = await pool.request()
			.input('TIPO_DOC', sql.TinyInt, typeDni)
			.input('NUM_DOC', sql.VarChar, dni)
			.input('ID_CARRERA', sql.Int, idCareer)
			.input('ID_MATERIA', sql.Int, idSubject)
			.input('IDENTIT', sql.Char, 'E')
			.input('IDENTIT1', sql.Char, 'X')
			.execute('PA_SELECT_ALU_DIFICULTAD');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

const getDetalleInscripcionExamen = async ({ typeDni, dni, idCareer }) => {
	try {
		const { recordset } = await pool.request()
			.input('Tipo_Doc', sql.TinyInt, typeDni)
			.input('Num_Doc', sql.Char, dni)
			.input('Id_Carrera', sql.TinyInt, idCareer)
			.execute('PA_SELECT_MATERIAS_RENDIR');

		return recordset;
	} catch(error) {
		throw new Error(error.message);
	}
};

module.exports = {
	addNewEmailStudent,
	addNewPhoneStudent,
	applyInterviewDoa,
	applyReincorporation,
	cancelInterviewDoa,
	changePassword,
	checkBalance,
	checkCareer,
	checkCareers,
	checkDateDOAStudent,
	checkEmailActive,
	checkInhabilitation,
	checkInscription,
	checkNewStudent,
	checkPagaresWeb,
	checkPasswordExpiration,
	checkPin,
	checkReincorporationAvailable,
	checkScolarship,
	checkStudentRegulations,
	checkSurvey,
	deleteAddress,
	deletePhone,
	forwardEmailConfirmation,
	getAbsence,
	getAbsencePreInscription,
	getActualDate,
	getAddressAvailablesToInsert,
	getAddressInfo,
	getAnswers,
	getAreas,
	getBanner,
	getCoupons,
	getCountries,
	getDateAbsence,
	getDocumentationFile,
	getLocalities,
	getGroupQuestionsSurvey,
	getInterviewDoaAvailable,
	getNeighbours,
	getPrincipals,
	getProvinces,
	getQuestions,
	getRequestSoftware,
	getSemestralSchedule,
	getScolarshipHistory,
	getStatusDocumentationStudent,
	getStudentPhone,
	getVirtualLibrary,
	initialBalance,
	insertAddress,
	insertSurveyAnswer,
	insertSurveyData,
	postInitialBalance,
	requestSoftware,
	sendEmail,
	setPool,
	signRaiStudent,
	updateDateTime,
	updateExpireDatePassword,
	webAuditory,
	getStudent,
	getStudentCalendar,
	searchAcademicExceptions,
	gradeBook,
	getStudentScholarship,
	getSubjectsTaken,
	getTableTeacher,
	getEquivalencies,
	getUnbilledEquivalencies,
	getSubjectsInProgress,
	getRegularizedSubjects,
	getCorrelatives,
	getStudyPlan,
	getControlDataSemester,
	getControlHabilitationInscriptionSemester,
	getMaxValueRegister,
	getSubjectsAvailablesToCourse,
	getModalityCourse,
	getSubjectsPreEnrolled,
	getSubjectsEnrolled,
	getSubjectsExceptions,
	getAcademicExceptionToConditionalCourse,
	getAcademicExceptionPermittedListeners,
	getAcademicExceptionsSubjects,
	matCursarPrueba,
	commissionSubject,
	getPaymentWay,
	applySubjectSemesterInscription,
	sendEmailForStudentWithDifficulties,
	updateSubjectSemesterInscription,
	insertRegistration,
	getModalityChangeAvailable,
	sendAcademicException,
	getStudentName,
	getMidTermExams,
	downloadMidTermExamsCorrected,
	getPaymentMethodByType,
	getCreditCardsTypes,
	getExamsFiles,
	getParams,
	getExamFile,
	generatePromissoryNote,
	getExamModel,
	insertTableFile,
	getPreregisteredSubjects,
	payWithCreditCard,
	getInfoRecivo,
	getCommissions,
	getProcessingPayments,
	getRejectedCards,
	getInfoPagare,
	healthcheck,
	generateRapipagoTicket,
	getValorMatricula,
	getInfoBoletas,
	getMessages,
	getPath,
	getParcial,
	insertParcialArchivo,
	getModelosExamen,
	checkBalanceWeb,
	getMateriasInscriptasCursillo,
	getMateriasAInscribirCursillo,
	getMesaExamenMateriaCursillo,
	insertFinalesExamenes,
	sendEmailForStudentWithDifficultiesCopy,
	getCompanies,
	checkFechaTesis,
	solicitarFechaTesis,
	getMateriasInscripcionExamen,
	getMesaExamenMateria,
	controlPagareExamen,
	getDetalleInscripcionExamen
};

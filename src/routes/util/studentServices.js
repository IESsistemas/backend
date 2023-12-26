/* eslint-disable camelcase */
const procedures = require('../../services/procedures');
const { findCareerByID, getFirstElement } = require('./arrayUtil');

const onlyNum = (tex)=>{
	let res = '';
	const num = '0123456789'
	for (let i = 0; i < tex.length; i++) {
		if(num.indexOf(tex[i]) != -1) res+=tex[i]
	}
	return res;
}

const generateOrignalPassword = async dni => {
	const [student] = await procedures.checkPasswordExpiration(0, dni);

	const user = {
		doc: onlyNum(student.num_doc),
		birthday: student.Fecha_Nac,
		password: student.pin
	};

	const birthday = new Date(user.birthday);
	const day = ('0' + birthday.getUTCDate()).slice(-2);
	const month = ('0' + (birthday.getUTCMonth() + 1)).slice(-2);
	const last3Digits = user.doc.slice(-3);

	return day + last3Digits + month;
};

const changePassword = async user => {

	const {
		dni, tipoDni, newPassword, currentPassword, userIp
	} = user;

	return Promise.all([
		procedures.changePassword(tipoDni, dni, currentPassword, newPassword),
		procedures.updateExpireDatePassword(tipoDni, dni),
		procedures.updateDateTime(dni),
		procedures.webAuditory(tipoDni, dni, 'change-password', 'Cambio de password', userIp)
	]);
};

const parseSubjects = subjects => {

	return subjects.map(({
		Cuatrimestre, Materia, Fecha_Examen, HoraMesa, Calificacion_materia, Condicion_materia, Ctro_Ubica, Ctro_Ext, tribunal, Id_Modalidad
	}) => ({
		cuatrimestre: Cuatrimestre,
		materia: Materia,
		fecha: { horario: HoraMesa, fechaDeExamen: Fecha_Examen },
		calificacion: Calificacion_materia,
		condicionMateria: Condicion_materia,
		centroDeUbicacion: Ctro_Ubica,
		centroDeExtension: Ctro_Ext,
		tribunal,
		modalidad: Id_Modalidad
	}));

};

const getSurrenderedubjectsByEquivalencies = array => {

	return array.map(({
		CUATRIMESTRE, MATERIA, FECHA, TIPO, Calificacion_materia
	}) => ({

		cuatrimestre: CUATRIMESTRE,
		materia: MATERIA,
		fecha: FECHA,
		tipo: TIPO,
		colificacionMateria: Calificacion_materia
	}));

};

const getSubjectsInProgressFormatted = array => {

	if(!array.length)
		return [];

	return array.map(({
		CUATRIMESTRE, MATERIA, nota1_materia, nota2_materia,
		nota3_materia, recuperatorio_materia, fecha_cursado_materia,
		reg_materia
	}) => ({

		cuatrimestre: CUATRIMESTRE,
		materia: MATERIA,
		nota1Materia: nota1_materia,
		nota2Materia: nota2_materia,
		nota3Materia: nota3_materia,
		recuperatorioMateria: recuperatorio_materia,
		fechaCursadoMateria: fecha_cursado_materia,
		regMateria: reg_materia
	}));

};

const getRegularizedSubjectsFormatted = array => {
	if(!array.length)
		return [];

	let cantidadReguladas = 0;

	const formattedArray = array.map(
		({
			CUATRIMESTRE,
			MATERIA,
			FECHA_REGULARIDAD,
			CTRO_EXT,
			nota1_materia,
			nota2_materia,
			nota3_materia,
			recuperatorio_materia,
			REGULAR
		}) => {
			if(REGULAR === 'R') {
				cantidadReguladas++;
				return {
					cuatrimestre: CUATRIMESTRE,
					materia: MATERIA,
					fechaRegularidad: FECHA_REGULARIDAD,
					crtoExt: CTRO_EXT,
					nota1Materia: nota1_materia,
					nota2Materia: nota2_materia,
					nota3Materia: nota3_materia,
					recuperatorioMateria: recuperatorio_materia
				};
			}
			return null;

		}
	).filter(list => list !== null);

	return {
		cantidadReguladas,
		formattedArray
	};
};

const getPromotedSubjectsFormatted = array => {
	if(!array.length)
		return [];

	let cantidadPromocionadas = 0;
	const formattedPromotedSubjects = array.map(({
		CUATRIMESTRE,
		MATERIA,
		FECHA_REGULARIDAD,
		CTRO_EXT,
		nota1_materia,
		nota2_materia,
		nota3_materia,
		recuperatorio_materia,
		REGULAR
	}) => {
		if(REGULAR === 'R') {
			cantidadPromocionadas++;
			return {
				cuatrimestre: CUATRIMESTRE,
				materia: MATERIA,
				fechaRegularidad: FECHA_REGULARIDAD,
				crtoExt: CTRO_EXT,
				nota1Materia: nota1_materia,
				nota2Materia: nota2_materia,
				nota3Materia: nota3_materia,
				recuperatorioMateria: recuperatorio_materia
			};
		}
		return null;
	}).filter(list => list !== null);

	return {
		cantidadPromocionadas,
		formattedPromotedSubjects
	};
};

const getFreeSubjects = array => {
	if(!array.length)
		return [];

	let cantidadDeMateriasLibres = 0;
	const formattedPromotedSubjects = array.map(({
		CUATRIMESTRE,
		MATERIA,
		FECHA_REGULARIDAD,
		CTRO_EXT,
		nota1_materia,
		nota2_materia,
		nota3_materia,
		recuperatorio_materia,
		REGULAR,
		estado_materia
	}) => {
		if(REGULAR !== 'R' && REGULAR !== 'P') {
			cantidadDeMateriasLibres++;
			return {
				cuatrimestre: CUATRIMESTRE,
				materia: MATERIA,
				fechaRegularidad: FECHA_REGULARIDAD,
				crtoExt: CTRO_EXT,
				nota1Materia: nota1_materia,
				nota2Materia: nota2_materia,
				nota3Materia: nota3_materia,
				recuperatorioMateria: recuperatorio_materia,
				estadoMateria: estado_materia
			};
		}
		return null;
	}).filter(list => list !== null);

	return {
		cantidadDeMateriasLibres,
		formattedPromotedSubjects
	};
};

const getDataCareerFormatted = array => {
	return array.map(({ Modalidad, Resolucion }) => ({
		modalidad: Modalidad,
		resolucion: Resolucion
	}));
};

const getCorrelativesFormatted = array => {
	return array.map(({ Cuatrimestre, MATERIA, Descripcion }) => ({
		cuatrimestre: Cuatrimestre,
		materia: MATERIA,
		descripcion: Descripcion
	}));
};

const getStudyPlanFormatted = array => {
	return array.map(({ Cuatrimestre, Descripcion, Programa }) => ({
		cuatrimestre: Cuatrimestre,
		descripcion: Descripcion,
		programa: Programa
	}));

};

const groupBySemester = array => {

	return array.reduce((accum, current) => {
		const { cuatrimestre } = current;
		if(!accum[cuatrimestre])
			accum[cuatrimestre] = [];

		accum[cuatrimestre].push(current);
		return accum;
	}, {});

};

const countApprovedSubjects = array => {
	return array.reduce((newItem, currentValue) => {
		if(currentValue.condicionMateria === 'APROB')
			newItem.aprobadas += 1;
		if(currentValue.condicionMateria === 'Equiv.')
			newItem.equivalentes += 1;

		return newItem;
	}, { aprobadas: 0, equivalentes: 0, aplazadas: 0 });

};

const subjectCounterEquiv = array => {
	return array.reduce((newItem, currentValue) => {

		if(currentValue.tipo === 'Equiv.')
			newItem.equivalentes += 1;

		return newItem;
	}, { aprobadas: 0, equivalentes: 0, aplazadas: 0 });

};

const getStudentInformation = async ({ typeDni, dni, idCareer }) => {
	const careers = await procedures.checkCareer(typeDni, dni);
	const career = findCareerByID(careers, idCareer);
	const years = getFirstElement(career).Años;
	const careerInformation = await procedures.gradeBook({ typeDni, dni, idCareer, years });
	const { Semestre } = getFirstElement(careerInformation);
	const data = getFirstElement(await procedures.getStudentScholarship({ dni, Semestre, years }));

	return {
		years,
		careerInformation: getDataCareerFormatted(careerInformation),
		PorcentajeBeca: data?.PorcentajeBeca
	};
};

const getPerformedSubjects = async ({ typeDni, dni, idCareer }) => {
	const performedSubjects = await procedures.getSubjectsTaken({ typeDni, dni, idCareer });
	const idsGroupTable = performedSubjects.map(({ Id_GrupoMesa }) => Id_GrupoMesa);
	const teachers = await Promise.all(idsGroupTable.map(id => procedures.getTableTeacher(id)));

	const tearchersWithIdGroupTable = idsGroupTable.map((id, index) => teachers[index].map(teacher => ({ ...teacher, idGroupTable: id }))).flat();

	const subjectWithTribunal = performedSubjects.map(element => ({
		...element,
		tribunal: tearchersWithIdGroupTable
			.filter(({ idGroupTable }) => element.Id_GrupoMesa === idGroupTable)
			.map(({ PROFE, AULA }) => ({ PROFE, AULA }))
	}));

	const parsedSubjects = parseSubjects(subjectWithTribunal);

	const approvedSubjects = countApprovedSubjects(parsedSubjects);

	// parsedSubjects.push(approvedSubjects);

	return { parsedSubjects, stats: countApprovedSubjects(parsedSubjects) };
};

const getAllSubjectsByStudent = async ({ typeDni, dni, idCareer, years }) => Promise.all([
	getPerformedSubjects({ typeDni, dni, idCareer }),
	procedures.getSubjectsInProgress({ typeDni, dni, idCareer, years }),
	procedures.getRegularizedSubjects({ typeDni, dni, idCareer }),
	procedures.getCorrelatives({ idCareer, dni }),
	procedures.getStudyPlan({ idCareer, typeDni, dni }),
	procedures.getSubjectsPreEnrolled({
		typeDni, dni, idCareer, shortCourse: null, whereUse: 'W'
	})
]);

const getCareersByDni = async (typeDni, dni) => procedures.checkCareer(typeDni, dni);

module.exports = {
	generateOrignalPassword,
	changePassword,
	parseSubjects,
	getSurrenderedubjectsByEquivalencies,
	countApprovedSubjects,
	subjectCounterEquiv,
	getSubjectsInProgressFormatted,
	getRegularizedSubjectsFormatted,
	getPromotedSubjectsFormatted,
	getFreeSubjects,
	getDataCareerFormatted,
	getCorrelativesFormatted,
	getStudyPlanFormatted,
	groupBySemester,
	getStudentInformation,
	getPerformedSubjects,
	getAllSubjectsByStudent,
	getCareersByDni
};

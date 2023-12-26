/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const app = express.Router();

const authenticate = require('../../util/authentication/index');
const validateBody = require('../../util/structures/models/academicTranscripts');
const procedures = require('../../../services/procedures');
const { groupByCriteria, getFirstElement } = require('../../util/arrayUtil');
const {cambiarDiaPorMes, formatearFecha} = require('../../util/dateUtil')

const handler = async (req, res) => {
	try {
		const { idCareer } = req.body;
		const { tipoDni: typeDni, dni } = req.body._login;

		const data = getFirstElement(await procedures.gradeBook({
			typeDni, dni, idCareer
		}));

		// const { Resolucion, Id_Modalidad } = data;

		const beca = getFirstElement(await procedures.getStudentScholarship({ dni }));

		// RENDIDAS
		const materiasRendidas = [];
		const dataRendidas = await procedures.getSubjectsTaken({ typeDni, dni, idCareer });

		for(const obj of dataRendidas) {
			const {
				Cuatrimestre, id_materia, Materia, Fecha_Examen, Calificacion_materia, Condicion_materia, Id_GrupoMesa, HoraMesa
			} = obj;

			const fechaExamen = new Date(Fecha_Examen);
			fechaExamen.setHours(fechaExamen.getHours() + 12);
			const fecha = { fechaExamen, horaExamen: HoraMesa };

			const dataTribunal = await procedures.getTableTeacher(Id_GrupoMesa, 'w');

			materiasRendidas.push({
				cuatrimestre: Cuatrimestre,
				materia: { id: id_materia, nombre: Materia },
				calificacionMateria: Calificacion_materia,
				condicionMateria: Condicion_materia,
				fecha,
				tribunal: dataTribunal.map(({ PROFE }) => PROFE)
			});
		}

		// EQUIVALENCIAS
		const equivalencias = await procedures.getEquivalencies({ typeDni, dni, idCareer });

		// EQUIVALENCIAS SIN FACTURAR
		const equivalenciasSinFacturar = await procedures.getUnbilledEquivalencies({ typeDni, dni, idCareer });

		// EN CURSO
		const dataMateriasEnCurso = await procedures.getSubjectsInProgress({ typeDni, dni, idCareer });
		const materiasEnCurso = dataMateriasEnCurso.length ?
			dataMateriasEnCurso.map(({
				CUATRIMESTRE, MATERIA, ID_MODALIDAD, NOTA1, NOTA2, NOTA3, recuperatorio_materia, fecha_cursado_materia, reg_materia
			}) => ({
				cuatrimestre: CUATRIMESTRE,
				materia: MATERIA,
				idModalidad: ID_MODALIDAD,
				nota1: NOTA1,
				nota2: NOTA2,
				nota3: NOTA3,
				recuperatorioMateria: recuperatorio_materia,
				fechaCursadoMateria: fecha_cursado_materia,
				regMateria: reg_materia
			})) :
			[];

		// REGULARIZADAS, PROMOCIONADAS Y LIBRES
		const dataMaterias = await procedures.getRegularizedSubjects({ typeDni, dni, idCareer });
		console.log("🚀 ~ file: academicTranscripts.js:77 ~ handler ~ dataMaterias:", dataMaterias)

		const materiasRegularizadas = dataMaterias.filter(currentMateria => currentMateria.REGULAR === 'R ' || currentMateria.CUATRIMESTRE === 0);
		console.log("🚀 ~ file: academicTranscripts.js:79 ~ handler ~ materiasRegularizadas:", materiasRegularizadas)
		const materiasPromocionadas = dataMaterias.filter(currentMateria => currentMateria.REGULAR === 'P ');
		const materiasLibres = dataMaterias.filter(currentMateria => currentMateria.REGULAR === 'L ');

		// CORRELATIVAS
		const dataCorrelativas = await procedures.getCorrelatives({ dni, idCareer });
		const correlativas = dataCorrelativas.map(({ Cuatrimestre, Descripcion, MATERIA, ID_MATERIA }) => ({
			cuatrimestre: Cuatrimestre, descripćion: Descripcion, materia: MATERIA, idMateria: ID_MATERIA
		}));

		// PRE INSCRIPTAS
		const materiasPreinscriptas = await procedures.getSubjectsPreEnrolled({
			typeDni, dni, idCareer, shortCourse: null, whereUse: 'W'
		})

		// PLAN DE ESTUDIO
		const dataPlanDeEstudio = await procedures.getStudyPlan({ idCareer, typeDni, dni });
		const planDeEstudio = groupByCriteria(dataPlanDeEstudio, 'Cuatrimestre');

		// TOTALES
		const materiasRendidasAprobadas = materiasRendidas.filter(({ condicionMateria, cuatrimestre }) => condicionMateria === 'APROB' && cuatrimestre !== 0);
		const materiasEquivalentesAprobadas = equivalencias.filter(({ CALIFICACION, CUATRIMESTRE }) => CALIFICACION > 3 && CUATRIMESTRE !== 0);

		const aprobadas = materiasRendidasAprobadas.length + materiasEquivalentesAprobadas.length;
		const totalAplazos = materiasRendidas.filter(({ condicionMateria, cuatrimestre }) => condicionMateria === 'N/APROB' && cuatrimestre !== 0);

		const calificacionesSinAplazos = [...materiasRendidasAprobadas, ...materiasEquivalentesAprobadas];
		const sumaMateriasRendidasSinAplazo = calificacionesSinAplazos
			.map(({ calificacionMateria, CALIFICACION }) => calificacionMateria || CALIFICACION)
			.reduce((acc, numero) => acc + numero, 0);

		const promedioSinAplazos = sumaMateriasRendidasSinAplazo / calificacionesSinAplazos.length;

		const materiasRendidasCompletas = [...calificacionesSinAplazos, ...totalAplazos];
		const materiasEquivalentesCompletas = equivalencias.filter(({ CALIFICACION, CUATRIMESTRE }) => CALIFICACION > 3 && CUATRIMESTRE !== 0);

		const calificacionesConAplazos = [...materiasRendidasCompletas, ...materiasEquivalentesCompletas];
		const sumaMateriasRendidasConAplazo = calificacionesConAplazos
			.map(({ calificacionMateria, CALIFICACION }) => calificacionMateria || CALIFICACION)
			.reduce((acc, numero) => {
				const numeroASumar = numero ?? 0;
				return acc + numeroASumar
			}, 0);

		const promedioConAplazos = sumaMateriasRendidasConAplazo / calificacionesConAplazos.length;

		const totales = {
			totalEquivaliencias: equivalencias.length,
			aprobadas,
			totalAplazos: totalAplazos.length,
			promedioSinAplazos,
			promedioConAplazos,
			totalEnCurso: materiasEnCurso.length,
			totalLibres: materiasLibres.length
		};

		const datosBeca = {
			porcentaje: beca?.PorcentajeBeca,
			semestre: beca?.Semestre,
			anio: beca?.año,
		}

		return res.json({
			materiasRendidas,
			equivalencias,
			equivalenciasSinFacturar,
			materiasEnCurso,
			materiasRegularizadas,
			materiasPromocionadas,
			materiasLibres,
			correlativas,
			materiasPreinscriptas,
			planDeEstudio,
			totales,
			datosBeca
		});
	} catch(error) {
		return res.status(500).json({ message: error.toString() });
	}
};

app.post('/', validateBody, authenticate, handler);

module.exports = { app, handler };

// const {
// 	getUnbilledEquivalencies
// } = require('../../../services/procedures');
// const validateBody = require('../../util/structures/models/academicTranscripts');

// const {
// 	getSubjectsInProgressFormatted,
// 	getRegularizedSubjectsFormatted,
// 	getPromotedSubjectsFormatted,
// 	getFreeSubjects,
// 	getCorrelativesFormatted,
// 	getStudyPlanFormatted,
// 	groupBySemester,
// 	getStudentInformation,
// 	getAllSubjectsByStudent
// } = require('../../util/studentServices');

// const handler = async (req, res) => {

// 	const { dni, tipoDni: typeDni } = req.body._login;

// 	const { idCareer } = req.body;

// 	try {

// 		const {
// 			years,
// 			careerInformation,
// 			PorcentajeBeca
// 		} = await getStudentInformation({ typeDni, dni, idCareer });

// 		const [
// 			performedSubjects,
// 			subjectsInProgress,
// 			regularizedSubjects,
// 			correlatives,
// 			studyPlan,
// 			subjectsPreEnrolled
// 		] = await getAllSubjectsByStudent({ typeDni, dni, idCareer, years });

// 		const studyPlanFormatted = getStudyPlanFormatted(studyPlan);

// 		const subjects = {
// 			career: careerInformation,
// 			studentScholarship: { porcentaje: PorcentajeBeca },
// 			performed: { performedSubjects, performedSubjectsQuantity: performedSubjects.length },
// 			UninvoicedEquivalencies: await getUnbilledEquivalencies({ typeDni, dni, idCareer, years }),
// 			regularized: getRegularizedSubjectsFormatted(regularizedSubjects),
// 			inProgress: getSubjectsInProgressFormatted(subjectsInProgress),
// 			promoted: getPromotedSubjectsFormatted(regularizedSubjects),
// 			free: getFreeSubjects(regularizedSubjects),
// 			correlative: getCorrelativesFormatted(correlatives),
// 			studyPlan: groupBySemester(studyPlanFormatted),
// 			subjectsPreEnrolled: { subjectsPreEnrolled, subjectsPreEnrolledQuantity: subjectsPreEnrolled.lenth }
// 		};
// 		return res.status(200).json(subjects);
// 	} catch(error) {
// 		return res.status(500).json({ message: error.message });
// 	}
// };

// app.post('/', validateBody, authenticate, handler);

// module.exports = { app, handler };

const {
	getAcademicExceptionToConditionalCourse,
	getAcademicExceptionPermittedListeners,
	getAcademicExceptionsSubjects,
	matCursarPrueba
} = require('../../services/procedures');

const getAcademicExceptionForStudyngAsAListener = async ({
	semester, year, typeDni, dni, idCareer
}) => {

	const academicExceptionsPermitted = await getAcademicExceptionPermittedListeners({ typeDni, dni, idCareer });
	const idsSubjects = academicExceptionsPermitted.map(({ ID_MATERIA }) => ID_MATERIA);

	const academicExceptionsSubjects = [];
	for(const idSubject of idsSubjects) {
		const academicExceptionSubject = await getAcademicExceptionsSubjects({
			semester, year, typeDni, dni, idSubject, idCareer
		});

		academicExceptionsSubjects.push(academicExceptionSubject);
	}

	return academicExceptionsSubjects.flat();
};

const getAcademicExceptionForStudyngInOtherCareer = async ({
	semester, year, typeDni, dni, idCareer
}) => {

	const responseMatCursarPrueba = await matCursarPrueba({ typeDni, dni, idCareer });
	const idsSubjects = responseMatCursarPrueba.map(({ ID_MATERIA }) => ID_MATERIA);

	const academicExceptionsSubjects = [];
	for(const idSubject of idsSubjects) {
		const academicExceptionSubject = await getAcademicExceptionsSubjects({
			semester, year, typeDni, dni, idSubject, idCareer, ident: 'C'
		});

		academicExceptionsSubjects.push(academicExceptionSubject);
	}

	return academicExceptionsSubjects.flat();
};

const getAcademicExceptionsByType = {
	1: ({ typeDni, dni, idCareer }) => getAcademicExceptionToConditionalCourse(typeDni, dni, idCareer),
	2: ({
		semester, year, typeDni, dni, idCareer
	}) => getAcademicExceptionForStudyngAsAListener({
		semester, year, typeDni, dni, idCareer
	}),
	3: ({
		semester, year, typeDni, dni, idCareer
	}) => getAcademicExceptionForStudyngInOtherCareer({
		semester, year, typeDni, dni, idCareer
	})
};

module.exports = { getAcademicExceptionsByType };

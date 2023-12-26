const bodyToSend = ({
	dni, nameCareer
}) => `El Alumno, dni: ${dni}, Carrera: ${nameCareer} -> Solicitó realizar un cambio de Modalidad desde la web de inscripción`;

module.exports = { bodyToSend };

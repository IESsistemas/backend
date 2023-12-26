const getRequestSoftware1 = ({
	dni, name, lastname, email
}) => {

	return	`Dni: ${dni}, Alumno: ${lastname}, ${name}, E_mail: ${email}`;
};

const getRequestSoftware2 = ({
	dni, name, lastname, email, message
}) => {

	return	`Dni: ${dni}, Alumno: ${lastname}, ${name}, E_mail: ${email}, Consulta: ${message}`;
};

module.exports = { getRequestSoftware1, getRequestSoftware2 };

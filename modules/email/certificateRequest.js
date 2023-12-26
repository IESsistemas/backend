const template = ({
	student, dni, career, phone, email, dispatchPlace, formalities, other
}) => {

	return `Solicitud de trámite & Alumno: & ${student} & <br><br> DNI: & ${dni} &
	<b></b> Carrera: &  ${career} & <br><br> Telefono: & ${phone}& <br><br> Correo
	Electronico: & ${email} <br><br> Lugar de retiro & ${dispatchPlace} & <br><br> Tramite &
    ${formalities} & <br><br> Otro: ${other}`;
};

module.exports = template;

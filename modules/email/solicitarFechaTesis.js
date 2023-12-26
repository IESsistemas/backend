const bodyToSend = ({
	dni, apellidos, nombres, puesto, fechaTrabajo, observacion
}) => `Dni : ${dni} Alumno: ${apellidos} ${nombres} Puesto: ${puesto} Fecha Inicio: ${fechaTrabajo} Observacion: ${observacion}`;

module.exports = { bodyToSend };

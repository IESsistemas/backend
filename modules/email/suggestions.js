const complaintsSuggestions = ({
	idArea, descriptionArea, dni, name, lastname, typePhone, phone, message, page
}) => {

	return	`<b>Área : </b>${idArea}-${descriptionArea}<br>
	<b>Dni Alumno : </b> ${dni}<br>
	<b>Nombre Alumno : </b> ${name} - ${lastname}<br>

	<b> ${typePhone} Alumno : </b> ${phone}<br>

	<b>Reclamo y/o sugerencia : ${message}<br>
	<b>Procedencia : </b> ${page} <br>
	<br><br>`;
};

module.exports = complaintsSuggestions;

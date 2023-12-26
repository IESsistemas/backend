/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const {
	parseISO, subHours, addHours, parse, isBefore
} = require('date-fns');

const { format, zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');

const convertUtcToGmt3 = utcDateStr => subHours(parseISO(utcDateStr), 3);

const getTodayInGMT = () => convertUtcToGmt3((new Date().toISOString()));

const formatDateTypeAndSplice = date => {
	const timeZone = 'America/Santiago'; // Zona horaria GMT-3 (Santiago, Chile)

	// Sumar 3 horas a la fecha
	const dateWithOffset = addHours(date, 3);

	// Convertir a UTC 00
	const zonedDate = utcToZonedTime(dateWithOffset, timeZone);
	const utcDate = zonedTimeToUtc(zonedDate, timeZone);

	return format(utcDate, 'dd-MM-yyyy', { timeZone: 'UTC' });
};

const isAnExpiredDate = date => {
	const fechaActual = new Date();

	const fechaCaducidadParsed = parse(date, 'MM/yy', new Date());

	if(isNaN(fechaCaducidadParsed))
		return false;

	if(isBefore(fechaCaducidadParsed, fechaActual))
		return true;

	return false;
};

const parseDay = {
	LUNES: 'DOMINGO',
	MARTES: 'LUNES',
	MIERCOLES: 'MARTES',
	JUEVES: 'MIERCOLES',
	VIERNES: 'JUEVES',
	SABADO: 'VIERNES',
	DOMINGO: 'SABADO'
};

const cambiarDiaPorMes = fechaOriginal => {
	const fecha = new Date(fechaOriginal);

	const year = fecha.getFullYear();
	const month = fecha.getMonth() + 1;
	const day = fecha.getDate() + 1;

	const nuevaFecha = new Date(`${year}-${day}-${month}`);

	const fechaFormateada = nuevaFecha.toISOString();

	return fechaFormateada;
};

const formatearFecha = fecha => {
	const year = fecha.getFullYear();
	const month = fecha.getMonth();
	const day = fecha.getDate() + 1;

	// Crea la cadena de fecha en el formato "dd/mm/aaaa"
	const fechaFormateada = `${month}/${day}/${year}`;
	return fechaFormateada;
};

const parseDate = (date, hour) => {
	const fechaSplit = date.split('-');
	const day = parseInt(fechaSplit[0], 10);
	const month = parseInt(fechaSplit[1], 10) - 1;
	const year = parseInt(fechaSplit[2], 10);

	const hoursSplit = hour.split(':');
	const hours = parseInt(hoursSplit[0], 10);
	const minutes = parseInt(hoursSplit[1], 10);

	return new Date(year, month, day, hours, minutes);
};

module.exports = {
	getTodayInGMT, formatDateTypeAndSplice, isAnExpiredDate, parseDay, cambiarDiaPorMes, formatearFecha, parseDate
};

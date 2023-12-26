function Extrae(Cadena, Posic, Largo) {
	Posic %= Cadena.length;

	let Salida = '';
	const i = Posic;
	let d = 0;
	for(let c = 0; c < Largo; c++) {
		if((i + 1) + d > Cadena.length)
			d = -i;

		const position = (i + 1) + d === Cadena.length ? ((i + 1) + d) - 1 : (i + 1) + d;
		Salida += Cadena[position];

		d++;
	}

	return Salida;
}

function encript(Cadena, Offset) {
	const Fecha = new Date();
	const Semilla =
        Fecha.getFullYear() * 65498765 +
        (Fecha.getMonth() + 1) * 15461234455 +
        Fecha.getDate() * 1541354561 +
        Fecha.getHours() * 6163513245 +
        Fecha.getMinutes() * 3216546981 +
        Fecha.getSeconds() * 3213564551;

	let Clave = Semilla.toString();
	Clave = Clave.replace(/0/g, '1');

	let Salida = '';
	for(let i = 0; i < Cadena.length; i++) {
		const A = Cadena.charCodeAt(i);
		const B = parseInt(Extrae(Clave, i + Offset, 3), 10);
		// console.log('🚀 ~ file: encriptUtil.js:35 ~ encript ~ Extrae(Clave, i + Offset, 3):', Extrae(Clave, i + Offset, 3));
		// console.log('🚀 ~ file: encriptUtil.js:35 ~ encript ~ B:', B);
		const Aux = (A * B).toString().padStart(6, '0');
		Salida += Aux;
	}

	Salida += Clave;

	return Salida;
}

module.exports = encript;

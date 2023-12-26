let app = null;

const students = require('./students');

const defineRoute = (ruta, requests) => {
	const baseRequest = '/api/';
	const route = baseRequest + ruta;
	app.use(route, requests);
};

module.exports = aplication => {
	app = aplication;

	students(defineRoute);

};

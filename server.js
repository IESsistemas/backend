require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const history = require('connect-history-api-fallback');

const routes = require('./src/routes/index');
const { setPool } = require('./src/services/procedures');

const app = express();

const { getConnection } = require('./modules/database/db');

const initialize = async () => {
	const connection = await getConnection();
	setPool(connection);
};

initialize();

app.use(morgan('dev'));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, name, root'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* eslint-disable */

app.use('/archivosParciales', express.static(`${process.env.FILES_PATH}/mnt/Archivosparciales/20231/`));
app.use('/archivosParciales', express.static(`${process.env.FILES_PATH}/mnt/Archivosparciales/20232/`));
app.use('/archivosParciales', express.static(`${process.env.FILES_PATH}/mnt/Archivosparciales/20241/`));
app.use('/archivosParciales', express.static(`${process.env.FILES_PATH}/mnt/Archivosparciales/20242/`));
app.use('/archivosParciales', express.static(`${process.env.FILES_PATH}/mnt/Archivosparciales/20251/`));
app.use('/archivosParciales', express.static(`${process.env.FILES_PATH}/mnt/Archivosparciales/20252/`));

app.use('/modelosExamen', express.static(`${process.env.FILES_PATH}/mnt/ModelosExamen/`));

app.use(history());

app.listen(process.env.PORT, () => {
	console.log('listening to port:', process.env.PORT);
});
routes(app);

module.exports = app;
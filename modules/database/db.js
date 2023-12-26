const sql = require('mssql');

let connect = null;

const CONNECTION = sql.connect(
	'Server='
    + process.env.SQL_SERVER
    + ','
    + process.env.PORT_DATABASE
    + ';Database='
    + process.env.SQL_DATABASE
    + ';User Id='
    + process.env.SQL_UID
    + ';Password='
    + process.env.SQL_PWD
    + ';Encrypt=false'
	// + ';Timezone='
	// + process.env.SQL_TZ
);

const getConnection = async () => {
	try {

		if(connect == null) {
			connect = await CONNECTION;
			/* eslint-disable-next-line*/
			console.log('Running database');
		} else if(!connect.connected)
			connect = await CONNECTION;

		return connect;

	} catch(err) {
		/* eslint-disable-next-line*/
		return console.log(err);
	}
};

module.exports = {
	getConnection, sql
};

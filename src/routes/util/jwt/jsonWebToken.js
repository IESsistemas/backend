// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const encode = data => jwt.sign(data, process.env.KEY_PRELOGIN);

const decode = data => {
	try {
		const decoded = jwt.verify(data, process.env.KEY_PRELOGIN);
		return decoded;
	} catch(err) {
		return null;
	}
};

module.exports = { encode, decode };

const { decode } = require('../jwt/jsonWebToken');

module.exports = async (req, res, next) => {

	if(req.headers.authorization) {
		try {
			const token = req.headers.authorization.replace('Bearer ', '');

			try {
				const tokenDecoded = decode(token);

				if(tokenDecoded !== null) {
					// eslint-disable-next-line no-underscore-dangle
					req.body._login = tokenDecoded;
					next();
				} else {
					res.status(401).json({
						message: 'Autenticación fallida.',
						code: 'INVALID_TOKEN'
					});
				}
			} catch(e) {
				res.status(401).json({
					message: 'Error: token inválido',
					code: 'INVALID_TOKEN'
				});
			}
		} catch(error) {
			res.status(401).json({
				message: 'Error: token inválido',
				code: 'INVALID_TOKEN'
			});
		}
	} else {
		res.status(401).json({
			message: 'Error: no se proporcionó ningún token',
			code: 'INVALID_TOKEN'
		});
	}
};

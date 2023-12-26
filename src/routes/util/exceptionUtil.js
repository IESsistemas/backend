const getParametersByExceptionType = {
	1: ({ originIdCareer }) => ({
		idCatedra: null,
		idCommission: null,
		exceptionType: 'CC',
		originIdCareer,
		destinationIdCareer: originIdCareer
	}),
	2: ({ originIdCareer, idCatedra, idCommission }) => ({
		idCatedra,
		idCommission,
		exceptionType: 'CO',
		originIdCareer,
		destinationIdCareer: originIdCareer
	}),
	3: ({ originIdCareer, destinationIdCareer, idCatedra, idCommission }) => ({
		idCatedra,
		idCommission,
		exceptionType: 'OC',
		originIdCareer,
		destinationIdCareer
	})
};

module.exports = { getParametersByExceptionType };

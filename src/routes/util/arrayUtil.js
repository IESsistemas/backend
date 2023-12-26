const getFirstElement = array => array?.[0];

const groupByDays = array => {
	return array.reduce((newItems, item) => {
		if(!newItems[item.DIA]) {
			newItems[item.DIA] = [item];
			return newItems;
		}
		newItems[item.DIA].push(item);
		return newItems;
	}, {});
};

const sortByHours = (a, b) => {

	if(a.HORA_FIN < b.HORA_COMIENZO)
		return -1;

	if(a.HORA_FIN > b.HORA_COMIENZO)
		return 1;

	return 0;

};

const sortByName = (a, b) => {
	if(a.NOMBRE_MAT < b.NOMBRE_MAT)
		return -1;

	if(a.NOMBRE_MAT > b.NOMBRE_MAT)

		return 1;

	return 0;
};

const sortSubject = list => {
	Object.keys(list).forEach(key => {
		if(['P', 'S'].includes(list[key].ID_MODALIDAD))
			list[key].sort((c1, c2) => sortByHours(c1, c2));

		else list[key].sort((c1, c2) => sortByName(c2, c1));
	});

};

const findCareerByID = (careers, id) => careers.filter(career => career.ID_CARRERA === id);

const changeKeys = (items, newKey) => {
	return items.reduce((newItems, item) => {
		if(item[newKey])
			newItems[item[newKey]] = item;
		return newItems;
	}, {});
};

const groupByCriteria = (array, field) => {

	return array.reduce((accum, current) => {
		const fieldToGroup = current[field];
		if(!accum[fieldToGroup])
			accum[fieldToGroup] = [];

		accum[fieldToGroup].push(current);
		return accum;
	}, {});

};

module.exports = {
	getFirstElement, groupByDays, sortByHours, sortByName, sortSubject, findCareerByID, changeKeys, groupByCriteria
};

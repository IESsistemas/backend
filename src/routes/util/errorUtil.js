/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const DUPLICATE_ERROR = 'Violation of PRIMARY KEY constraint \'PK_ALU_EXCEP_ACADEMICAS\'. Cannot insert duplicate key in object \'dbo.ALU_EXCEP_ACADEMICAS\'. The duplicate key value is';

const handdleDuplicateError = error => error.message.includes(DUPLICATE_ERROR);

module.exports = { handdleDuplicateError };

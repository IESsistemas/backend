const nameModule = 'students/';

const { app: accountStatement } = require('./src/accountStatement');
const { app: addAnswerSurvey } = require('./src/addAnswerSurvey');
const { app: addNewAddress } = require('./src/addNewAddress');
const { app: addNewEmailStudent } = require('./src/addNewEmail');
const { app: addNewPhoneStudent } = require('./src/addNewPhone');
const { app: applyInterviewDoa } = require('./src/applyInterviewDoa');
const { app: cancelInterviewDoa } = require('./src/cancelInterviewDoa');
const { app: checkInterviewDOA } = require('./src/checkInterviewDOA');
const { app: confirmPersonalInfo } = require('./src/confirmPersonalInfo');
const { app: deleteAddress } = require('./src/deleteAddress');
const { app: deletePhone } = require('./src/deletePhone');
const { app: forgotPassword } = require('./src/forgotPassword');
const { app: forwardEmailConfirmation } = require('./src/forwardEmailConfirmation');
const { app: getAreas } = require('./src/getAreas');
const { app: getCountries } = require('./src/getCountries');
const { app: getCredential } = require('./src/credential');
const { app: getDocumentationFile } = require('./src/getDocumentationFile');
const { app: getInterviewDoaAvailable } = require('./src/getInterviewDoaAvailable');
const { app: getLocalities } = require('./src/getLocalities');
const { app: getNeighbours } = require('./src/getNeighbours');
const { app: getProvinces } = require('./src/getProvinces');
const { app: getRequestSoftware } = require('./src/getRequestSoftware');
const { app: getStatusRegulationStudent } = require('./src/getStatusRAI');
const { app: getSurveys } = require('./src/getSurveys');
const { app: getSurveysQuestions } = require('./src/getSurveyQuestions');
const { app: home } = require('./src/home');
const { app: login } = require('./src/login');
const { app: fetchMe } = require('./src/fetchMe');
const { app: personalInfo } = require('./src/personalInfo');
const { app: sendEmailRequestSoftware } = require('./src/sendEmailRequestSoftware');
const { app: signRaiStudent } = require('./src/signRAIStudent');
const { app: suggestions } = require('./src/suggestions');
const { app: updateAddress } = require('./src/updateAddress');
const { app: updatePhoneNumber } = require('./src/updatePhone');
const { app: changePassword } = require('./src/changePassword');
const { app: certificateRequest } = require('./src/certificateRequest');
const { app: academicExceptionsProcessed } = require('./src/academicExceptionsProcessed');
const { app: academicExceptionsByType } = require('./src/academicExceptionsByType');
const { app: sendAcademicException } = require('./src/sendAcademicException');
const { app: printAcademicException } = require('./src/printAcademicException');
const { app: getAbsense } = require('./src/getAbsense');
const { app: getReincorporationInfo } = require('./src/getReincorporationInfo');
const { app: subjectSchedule } = require('./src/subjectSchedule');
const { app: academicTranscripts } = require('./src/academicTranscripts');
const { app: applyReincorporation } = require('./src/applyReincorporation');
const { app: getScolarshipData } = require('./src/getScolarshipData');
const { app: getVirtualLibrary } = require('./src/getVirtualLibrary');
const { app: getSemestralSchedule } = require('./src/getSemestralSchedule');
const { app: semesterInscriptionInformation } = require('./src/semesterInscriptionInformation');
const { app: getCommissionsSubjects } = require('./src/getCommissionsSubjects');
const { app: getPaymentWay } = require('./src/getPaymentWay');
const { app: applySubjectSemesterInscription } = require('./src/applySubjectSemesterInscription');
const { app: updateSubjectSemesterIncription } = require('./src/updateSubjectSemesterInscription');
const { app: applyChangeModality } = require('./src/applyChangeModality');
const { app: getMidTermExams } = require('./src/getMidTermExams');
const { app: paymentMethods } = require('./src/paymentMethods');
const { app: getExamsCies } = require('./src/examsCies');
const { app: surchasePromissoryNote } = require('./src/surchasePromissoryNote');
const { app: generatePromissoryNote } = require('./src/generatePromissoryNote');
const { app: downloadExamCies } = require('./src/downloadExamCies');
const { app: getPreregisteredSubjects } = require('./src/getPreregisteredSubjects');
const { app: payWithCreditCard } = require('./src/payWithCreditCard');
const { app: getInfoRecibo } = require('./src/getInfoRecibo');
const { app: getCommissions } = require('./src/getCommissions');
const { app: getPostedPaymentsPendingProcessing } = require('./src/getPostedPaymentsPendingProcessing');
const { app: getRejectedCards } = require('./src/getRejectedCards');
const { app: getInfoPagares } = require('./src/getInfoPagares');
const { app: getInfoBoletas } = require('./src/getInfoBoletas');
const { app: healthcheck } = require('./src/healthcheck');
const { app: generateRapipagoTicket } = require('./src/generateRapipagoTicket');
const { app: getRapipagoData } = require('./src/getRapipagoData');
const { app: getMessages } = require('./src/getMessages');
const { app: uploadParcial } = require('./src/uploadParcial');
const { app: getParcial } = require('./src/getParcial');
const { app: downloadParcial } = require('./src/downloadParcial');
const { app: getModelosExamen } = require('./src/getModelosExamen');
const { app: downloadModeloExamen } = require('./src/downloadModeloExamen');
const { app: getInfoInscripcionCursillo } = require('./src/getInfoInscripcionCursillo');
const { app: inscripcionExamenCursillo } = require('./src/inscripcionExamenCursillo');
const { app: getCompanies } = require('./src/getCompanies');
const { app: solicitarFechaTesis } = require('./src/solicitarFechaTesis');
const { app: getInfoInscripcionExamenMaterias } = require('./src/getInfoInscripcionExamenMateria');
const { app: inscripcionExamenMateria } = require('./src/inscripcionExamenMateria');
const { app: getDetailInscripcionMateria } = require('./src/getDetailInscripcionExamen');
const { app: macroBank } = require('./src/macroBank');
const { app: uploadExamCies } = require('./src/uploadExamCies');
const { app: getCiesExamsV2 } = require('./src/getCiesExamsV2');
const { app: downloadCiesExamV2 } = require('./src/downloadCiesExamV2');
const { app: uploadCiesExamV2 } = require('./src/uploadCiesExamV2');

module.exports = define => {
	define(nameModule + 'account-statement/', accountStatement);
	define(nameModule + 'add-answer-survey/', addAnswerSurvey);
	define(nameModule + 'add-new-address/', addNewAddress);
	define(nameModule + 'add-new-email-student/', addNewEmailStudent);
	define(nameModule + 'add-new-phone-student/', addNewPhoneStudent);
	define(nameModule + 'apply-interview-doa/', applyInterviewDoa);
	define(nameModule + 'cancel-interview-doa/', cancelInterviewDoa);
	define(nameModule + 'check-interview-doa/', checkInterviewDOA);
	define(nameModule + 'complaints-suggestions/', suggestions);
	define(nameModule + 'confirm-personal-info/', confirmPersonalInfo);
	define(nameModule + 'delete-address/', deleteAddress);
	define(nameModule + 'delete-phone/', deletePhone);
	define(nameModule + 'forgot-password/', forgotPassword);
	define(nameModule + 'forward-email-confirmation/', forwardEmailConfirmation);
	define(nameModule + 'get-areas/', getAreas);
	define(nameModule + 'get-countries/', getCountries);
	define(nameModule + 'get-credential/', getCredential);
	define(nameModule + 'get-documentation-file/', getDocumentationFile);
	define(nameModule + 'get-interview-doa-available/', getInterviewDoaAvailable);
	define(nameModule + 'get-localities/', getLocalities);
	define(nameModule + 'get-companies/', getCompanies);
	define(nameModule + 'get-neighbours/', getNeighbours);
	define(nameModule + 'get-provinces/', getProvinces);
	define(nameModule + 'get-request-software/', getRequestSoftware);
	define(nameModule + 'get-surveys/', getSurveys);
	define(nameModule + 'get-surveys-questions/', getSurveysQuestions);
	define(nameModule + 'home/', home);
	define(nameModule + 'login/', login);
	define(nameModule + 'fetch-me/', fetchMe);
	define(nameModule + 'personal-info/', personalInfo);
	define(nameModule + 'rai-sign/', signRaiStudent);
	define(nameModule + 'rai-statement/', getStatusRegulationStudent);
	define(nameModule + 'send-email-request-software/', sendEmailRequestSoftware);
	define(nameModule + 'update-address/', updateAddress);
	define(nameModule + 'update-phone/', updatePhoneNumber);
	define(nameModule + 'certificate-request/', certificateRequest);
	define(nameModule + 'academic-exceptions-processed/', academicExceptionsProcessed);
	define(nameModule + 'academic-exceptions/send/', sendAcademicException);
	define(nameModule + 'academic-exceptions/print/', printAcademicException);
	define(nameModule + 'academic-exceptions/', academicExceptionsByType);
	define(nameModule + 'get-absense/', getAbsense);
	define(nameModule + 'get-reincorporation-info/', getReincorporationInfo);
	define(nameModule + 'change-password/', changePassword);
	define(nameModule + 'subject-schedule/', subjectSchedule);
	define(nameModule + 'academic-transcripts/', academicTranscripts);
	define(nameModule + 'apply-reincorporation/', applyReincorporation);
	define(nameModule + 'get-scolarship-data/', getScolarshipData);
	define(nameModule + 'get-virtual-library/', getVirtualLibrary);
	define(nameModule + 'get-semestral-schedule/', getSemestralSchedule);
	define(nameModule + 'semester-inscription/', semesterInscriptionInformation);
	define(nameModule + 'commissions-subjects/', getCommissionsSubjects);
	define(nameModule + 'payment-way/', getPaymentWay);
	define(nameModule + 'apply-subject-semester-inscription/', applySubjectSemesterInscription);
	define(nameModule + 'update-subject-semester-inscription/', updateSubjectSemesterIncription);
	define(nameModule + 'apply-change-modality/', applyChangeModality);
	define(nameModule + 'mid-term-exams/', getMidTermExams);
	define(nameModule + 'paymentMethods/', paymentMethods);
	define(nameModule + 'exams-cies/', getExamsCies);
	define(nameModule + 'paymentMethods/surchase-promissory-note', surchasePromissoryNote);
	define(nameModule + 'paymentMethods/promissory-note', generatePromissoryNote);
	define(nameModule + 'exams-cies/download/', downloadExamCies);
	define(nameModule + 'preregistered-subjects', getPreregisteredSubjects);
	define(nameModule + 'paymentMethods/credit-card', payWithCreditCard);
	define(nameModule + 'getInfoRecibo', getInfoRecibo);
	define(nameModule + 'get-commissions', getCommissions);
	define(nameModule + 'payments-pending-processing', getPostedPaymentsPendingProcessing);
	define(nameModule + 'rejected-cards', getRejectedCards);
	define(nameModule + 'info-pagares', getInfoPagares);
	define(nameModule + 'get-info-boleta', getInfoBoletas);
	define(nameModule + 'health-check', healthcheck);
	define(nameModule + 'rapipago', generateRapipagoTicket);
	define(nameModule + 'rapipago', getRapipagoData);
	define(nameModule + 'messages', getMessages);
	define(nameModule + 'upload-parcial', uploadParcial);
	define(nameModule + 'get-parcial', getParcial);
	define(nameModule + 'download-parcial', downloadParcial);
	define(nameModule + 'modelos-examen', getModelosExamen);
	define(nameModule + 'download-modelos-examen', downloadModeloExamen);
	define(nameModule + 'info-inscripcion-cursillo/', getInfoInscripcionCursillo);
	define(nameModule + 'inscripcion-cursillo/', inscripcionExamenCursillo);
	define(nameModule + 'solicitar-fecha-tesis/', solicitarFechaTesis);
	define(nameModule + 'info-inscripcion-examen-materia/', getInfoInscripcionExamenMaterias);
	define(nameModule + 'inscripcion-examen-materia/', inscripcionExamenMateria);
	define(nameModule + 'detalle-inscripcion-examen-materia/', getDetailInscripcionMateria);
	define(nameModule + 'macro-bank/', macroBank);
	define(nameModule + 'exams-cies/upload', uploadExamCies);
	define(nameModule + 'v2/exams-cies', getCiesExamsV2);
	define(nameModule + 'v2/exams-cies/download', downloadCiesExamV2);
	define(nameModule + 'v2/exams-cies/upload', uploadCiesExamV2);
};

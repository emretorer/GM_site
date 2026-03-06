import { apiGet, apiPost } from "./httpClient.js";
import { authTokenStore } from "./authTokenStore.js";

const backendApi = {
  health() {
    return apiGet("/health", { auth: false });
  },

  verifyToken() {
    return apiPost("/verifyToken");
  },
  register(payload) {
    return apiPost("/register", payload);
  },

  purchasePremiumCredits(creditsToAdd) {
    return apiPost("/purchasePremiumCredits", { creditsToAdd });
  },
  fetchChildren() {
    return apiPost("/fetchChildren");
  },
  removeChild(childId) {
    return apiPost("/removeChild", { childId });
  },
  sendVerificationCode(childEmail) {
    return apiPost("/sendVerificationCode", { childEmail });
  },
  verifyCodeAndLink(codeId, enteredCode) {
    return apiPost("/verifyCodeAndLink", { codeId, enteredCode });
  },

  createInstitution(payload) {
    return apiPost("/api/admin/create-institution", payload);
  },

  fetchClasses(institutionId) {
    return apiPost("/fetchClasses", { institutionId });
  },
  updateInstitution(payload) {
    return apiPost("/updateInstitution", payload);
  },
  fetchTeachers(institutionId) {
    return apiPost("/fetchTeachers", { institutionId });
  },
  fetchInstitutionData() {
    return apiPost("/fetchInstitutionData");
  },
  generateInvitationCode(institutionId) {
    return apiPost("/generateInvitationCode", { institutionId });
  },
  generateTeacherInvitationCode(institutionId) {
    return apiPost("/generateTeacherInvitationCode", { institutionId });
  },

  fetchClassStudents(institutionId, classId) {
    return apiPost("/fetchClassStudents", { institutionId, classId });
  },
  fetchClassTeachers(institutionId, classId) {
    return apiPost("/fetchClassTeachers", { institutionId, classId });
  },
  removeTeacherFromClass(institutionId, classId, teacherId) {
    return apiPost("/removeTeacherFromClass", { institutionId, classId, teacherId });
  },
  createClass(institutionId, className) {
    return apiPost("/createClass", { institutionId, className });
  },
  deleteClass(institutionId, classId) {
    return apiPost("/deleteClass", { institutionId, classId });
  },
  addStudentToClass(institutionId, classId, studentId) {
    return apiPost("/addStudentToClass", { institutionId, classId, studentId });
  },
  removeStudentFromClass(institutionId, classId, studentId) {
    return apiPost("/removeStudentFromClass", { institutionId, classId, studentId });
  },
  editClassName(institutionId, classId, newClassName) {
    return apiPost("/editClassName", { institutionId, classId, newClassName });
  },
  assignTeacherToClass(institutionId, classId, teacherId) {
    return apiPost("/assignTeacherToClass", { institutionId, classId, teacherId });
  },

  fetchTeacherClasses() {
    return apiPost("/fetchTeacherClasses");
  },
  fetchTeacherClassStudents(classId, institutionId) {
    return apiPost("/fetchTeacherClassStudents", { classId, institutionId });
  },
  removeTeacherFromInstitution(institutionId, teacherId) {
    return apiPost("/removeTeacherFromInstitution", { institutionId, teacherId });
  },

  fetchStudentPlayerMetrics(studentId) {
    return apiPost("/fetchStudentPlayerMetrics", { studentId });
  },
  fetchOwnStudentPanelData() {
    return apiPost("/fetchOwnStudentPanelData");
  },
  fetchAllStudents(payload) {
    return apiPost("/fetchAllStudents", payload);
  },
  removeStudentFromInstitution(institutionId, studentId) {
    return apiPost("/removeStudentFromInstitution", { institutionId, studentId });
  },
};

export { backendApi, authTokenStore };

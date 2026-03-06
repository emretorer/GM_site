import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middleware/auth.js";
import { batchGetPlayerMetrics } from "../utils/playerMetrics.js";
import { hasRole } from "../utils/accountRole.js";

const router = Router();
router.use(authMiddleware);

router.post("/fetchClassStudents", async (req, res) => {
  const { institutionId, classId } = req.body;
  if (!institutionId || !classId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // KullanÃ„Â±cÃ„Â± yetki kontrolÃƒÂ¼ (sadece kurum admini)
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f bilgisi ÃƒÂ§ek
    const instDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();
    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();
    if (!instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bulunamadÃ„Â±" });

    const classData = instData.classes[classId];
    const studentIds = classData.student_ids || [];

    // Ãƒâ€“Ã„Å¸renci bilgilerini ve PlayerMetrics verilerini ÃƒÂ§ek
    const students = await Promise.all(
      studentIds.map(async (studentId) => {
        try {
          const studentDoc = await admin
            .firestore()
            .collection("Account")
            .doc(studentId)
            .get();
          if (!studentDoc.exists) return null;
          const studentData = { id: studentDoc.id, ...studentDoc.data() };

          // PlayerMetrics'i ÃƒÂ§ek
          const playerMetricsDoc = await admin
            .firestore()
            .collection("PlayerMetrics")
            .doc(studentId)
            .get();
          if (playerMetricsDoc.exists) {
            studentData.playerMetrics = playerMetricsDoc.data();
          }
          return studentData;
        } catch (e) {
          return null;
        }
      })
    );

    // null olanlarÃ„Â± filtrele
    const studentsWithMetrics = students.filter((s) => s);

    res.json({ students: studentsWithMetrics });
  } catch (error) {
    console.error("fetchClassStudents hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - SÃ„Â±nÃ„Â±f ÃƒÂ¶Ã„Å¸retmenlerini getir

router.post("/fetchClassTeachers", async (req, res) => {
  const { institutionId, classId } = req.body;
  if (!institutionId || !classId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // KullanÃ„Â±cÃ„Â± yetki kontrolÃƒÂ¼ (sadece kurum admini)
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f bilgisi ÃƒÂ§ek
    const instDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();
    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();
    if (!instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bulunamadÃ„Â±" });

    const classData = instData.classes[classId];
    const teacherIds = classData.teacher_ids || [];

    // Ãƒâ€“Ã„Å¸retmen bilgilerini ÃƒÂ§ek
    const teachers = await Promise.all(
      teacherIds.map(async (teacherId) => {
        try {
          const teacherDoc = await admin
            .firestore()
            .collection("Account")
            .doc(teacherId)
            .get();
          if (!teacherDoc.exists) return null;
          return { uid: teacherDoc.id, ...teacherDoc.data() };
        } catch (e) {
          return null;
        }
      })
    );

    // null olanlarÃ„Â± filtrele
    const teachersFiltered = teachers.filter((t) => t);

    res.json({ teachers: teachersFiltered });
  } catch (error) {
    console.error("fetchClassTeachers hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k  - SÃ„Â±nÃ„Â±ftan ÃƒÂ¶Ã„Å¸retmen ÃƒÂ§Ã„Â±kar

router.post("/removeTeacherFromClass", async (req, res) => {
  const { institutionId, classId, teacherId } = req.body;
  if (!institutionId || !classId || !teacherId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // KullanÃ„Â±cÃ„Â± yetki kontrolÃƒÂ¼ (sadece kurum admini)
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f bilgisi ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();
    if (!instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bulunamadÃ„Â±" });

    const classData = instData.classes[classId];
    const teacherIds = classData.teacher_ids || [];

    // Ãƒâ€“Ã„Å¸retmeni teacher_ids listesinden ÃƒÂ§Ã„Â±kar
    const updatedTeacherIds = teacherIds.filter((id) => id !== teacherId);

    // SÃ„Â±nÃ„Â±fÃ„Â± gÃƒÂ¼ncelle
    await instRef.update({
      [`classes.${classId}.teacher_ids`]: updatedTeacherIds,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("removeTeacherFromClass hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - SÃ„Â±nÃ„Â±f oluÃ…Å¸turma

router.post("/createClass", async (req, res) => {
  const { institutionId, className } = req.body;
  if (!institutionId || !className)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama ve kurum admini kontrolÃƒÂ¼
    const decodedToken = req.user;
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum verisini ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    const instData = instDoc.data();
    if (!instData)
      return res.status(404).json({ error: "Kurum verisi bulunamadÃ„Â±" });

    const updatedClasses = { ...instData.classes };

    // AynÃ„Â± isimde sÃ„Â±nÃ„Â±f var mÃ„Â± kontrol et
    const existingClassWithName = Object.values(updatedClasses).find(
      (cls) => cls.name === className
    );
    if (existingClassWithName) {
      return res
        .status(400)
        .json({ error: "Bu sÃ„Â±nÃ„Â±f adÃ„Â± zaten bu kurumda kullanÃ„Â±lÃ„Â±yor!" });
    }

    // Yeni sÃ„Â±nÃ„Â±f anahtarÃ„Â± oluÃ…Å¸tur (class_01, class_02, ...)
    const existingClassKeys = Object.keys(updatedClasses);
    const classNumbers = existingClassKeys
      .filter((key) => key.startsWith("class_"))
      .map((key) => parseInt(key.split("_")[1]))
      .filter((num) => !isNaN(num));
    const nextClassNumber =
      classNumbers.length > 0 ? Math.max(...classNumbers) + 1 : 1;
    const newClassKey = `class_${nextClassNumber.toString().padStart(2, "0")}`;

    updatedClasses[newClassKey] = {
      name: className,
      student_ids: [],
      teacher_ids: [],
      createdAt: new Date(),
    };

    // Firestore'da gÃƒÂ¼ncelle
    await instRef.update({ classes: updatedClasses });

    res.json({
      success: true,
      message: "SÃ„Â±nÃ„Â±f baÃ…Å¸arÃ„Â±yla oluÃ…Å¸turuldu!",
      classKey: newClassKey,
      classData: updatedClasses[newClassKey],
    });
  } catch (error) {
    console.error("SÃ„Â±nÃ„Â±f oluÃ…Å¸turma hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "SÃ„Â±nÃ„Â±f oluÃ…Å¸turulurken hata: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - SÃ„Â±nÃ„Â±f silme

router.post("/deleteClass", async (req, res) => {
  const { institutionId, classId } = req.body;
  if (!institutionId || !classId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // KullanÃ„Â±cÃ„Â± yetki kontrolÃƒÂ¼ (sadece kurum admini)
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f bilgisi ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();
    if (!instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bulunamadÃ„Â±" });

    // SÃ„Â±nÃ„Â±fÃ„Â± sil
    const updatedClasses = { ...instData.classes };
    delete updatedClasses[classId];

    // Firestore'u gÃƒÂ¼ncelle
    await instRef.update({ classes: updatedClasses });

    res.json({ success: true });
  } catch (error) {
    console.error("deleteClass hatasÃ„Â±:", error);
    res.status(500).json({ error: "SÃ„Â±nÃ„Â±f silinemedi: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - SÃ„Â±nÃ„Â±fa ÃƒÂ¶Ã„Å¸renci ekleme

router.post("/addStudentToClass", async (req, res) => {
  const { institutionId, classId, studentId } = req.body;
  if (!institutionId || !classId || !studentId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama ve kurum admini kontrolÃƒÂ¼
    const decodedToken = req.user;
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f verisini ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    const instData = instDoc.data();
    if (!instData || !instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bilgisi bulunamadÃ„Â±" });

    // AynÃ„Â± ÃƒÂ¶Ã„Å¸renci zaten ekli mi kontrol et
    const currentStudentIds = instData.classes[classId].student_ids || [];
    if (currentStudentIds.includes(studentId)) {
      return res.status(400).json({ error: "Bu ÃƒÂ¶Ã„Å¸renci zaten sÃ„Â±nÃ„Â±fta mevcut" });
    }

    // Ãƒâ€“Ã„Å¸renciyi ekle
    const updatedStudentIds = [...currentStudentIds, studentId];
    instData.classes[classId].student_ids = updatedStudentIds;

    // Firestore'da gÃƒÂ¼ncelle
    await instRef.update({ classes: instData.classes });

    res.json({
      success: true,
      message: "Ãƒâ€“Ã„Å¸renci baÃ…Å¸arÃ„Â±yla sÃ„Â±nÃ„Â±fa eklendi!",
      updatedStudentIds,
    });
  } catch (error) {
    console.error("Ãƒâ€“Ã„Å¸renci ekleme hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "Ãƒâ€“Ã„Å¸renci eklenirken hata: " + error.message });
  }
});
// useKurumsalAdminLogic de kullandÃ„Â±k - SÃ„Â±nÃ„Â±ftan ÃƒÂ¶Ã„Å¸renci ÃƒÂ§Ã„Â±karma

router.post("/removeStudentFromClass", async (req, res) => {
  const { institutionId, classId, studentId } = req.body;
  if (!institutionId || !classId || !studentId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama ve kurum admini kontrolÃƒÂ¼
    const decodedToken = req.user;
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f verisini ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    const instData = instDoc.data();
    if (!instData || !instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bilgisi bulunamadÃ„Â±" });

    // Ãƒâ€“Ã„Å¸renciyi ÃƒÂ§Ã„Â±kar
    const currentStudentIds = instData.classes[classId].student_ids || [];
    const updatedStudentIds = currentStudentIds.filter(
      (id) => id !== studentId
    );
    instData.classes[classId].student_ids = updatedStudentIds;

    // Firestore'da gÃƒÂ¼ncelle
    await instRef.update({ classes: instData.classes });

    res.json({
      success: true,
      message: "Ãƒâ€“Ã„Å¸renci baÃ…Å¸arÃ„Â±yla sÃ„Â±nÃ„Â±ftan ÃƒÂ§Ã„Â±karÃ„Â±ldÃ„Â±!",
      updatedStudentIds,
    });
  } catch (error) {
    console.error("Ãƒâ€“Ã„Å¸renci silme hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "Ãƒâ€“Ã„Å¸renci silinirken hata: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - SÃ„Â±nÃ„Â±f adÃ„Â±nÃ„Â± gÃƒÂ¼ncelleme 
//Bu endpoint ÃƒÂ§alÃ„Â±Ã…Å¸mÃ„Â±yor bozuldu

router.post("/editClassName", async (req, res) => {
  const { institutionId, classId, newClassName } = req.body;
  if (!institutionId || !classId || !newClassName)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // KullanÃ„Â±cÃ„Â± yetki kontrolÃƒÂ¼ (sadece kurum admini)
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f bilgisi ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();
    if (!instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bulunamadÃ„Â±" });

    // SÃ„Â±nÃ„Â±f adÃ„Â±nÃ„Â± gÃƒÂ¼ncelle
    instData.classes[classId].name = newClassName.trim();

    // Firestore'u gÃƒÂ¼ncelle
    await instRef.update({ classes: instData.classes });

    res.json({ success: true, message: "SÃ„Â±nÃ„Â±f adÃ„Â± baÃ…Å¸arÃ„Â±yla gÃƒÂ¼ncellendi!" });
  } catch (error) {
    console.error("editClassName hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "SÃ„Â±nÃ„Â±f adÃ„Â± gÃƒÂ¼ncellenemedi: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸retmeni sÃ„Â±nÃ„Â±fa atama

router.post("/assignTeacherToClass", async (req, res) => {
  const { institutionId, classId, teacherId } = req.body;
  if (!institutionId || !classId || !teacherId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama ve kurum admini kontrolÃƒÂ¼
    const decodedToken = req.user;
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurum ve sÃ„Â±nÃ„Â±f verisini ÃƒÂ§ek
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    const instDoc = await instRef.get();
    const instData = instDoc.data();
    if (!instData || !instData.classes || !instData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bilgisi bulunamadÃ„Â±" });

    // AynÃ„Â± ÃƒÂ¶Ã„Å¸retmen zaten ekli mi kontrol et
    const currentTeacherIds = instData.classes[classId].teacher_ids || [];
    if (currentTeacherIds.includes(teacherId)) {
      return res
        .status(400)
        .json({ error: "Bu ÃƒÂ¶Ã„Å¸retmen zaten bu sÃ„Â±nÃ„Â±fa atanmÃ„Â±Ã…Å¸" });
    }

    // Ãƒâ€“Ã„Å¸retmeni ekle
    const updatedTeacherIds = [...currentTeacherIds, teacherId];
    instData.classes[classId].teacher_ids = updatedTeacherIds;

    // Firestore'da gÃƒÂ¼ncelle
    await instRef.update({ classes: instData.classes });

    res.json({
      success: true,
      message: "Ãƒâ€“Ã„Å¸retmen baÃ…Å¸arÃ„Â±yla sÃ„Â±nÃ„Â±fa atandÃ„Â±!",
      updatedTeacherIds,
    });
  } catch (error) {
    console.error("Ãƒâ€“Ã„Å¸retmen atama hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "Ãƒâ€“Ã„Å¸retmen atama iÃ…Å¸lemi baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸renci PlayerMetrics verilerini ÃƒÂ§ekme 
//Ãƒâ€“Ã„Å¸rencinin ÃƒÂ¼stÃƒÂ¼ne tÃ„Â±klayÃ„Â±nca sadece o ÃƒÂ¶Ã„Å¸rencinin PlayerMetrics verilerini ÃƒÂ§ekiyoruz

export default router;


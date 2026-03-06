import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middleware/auth.js";
import { batchGetPlayerMetrics } from "../utils/playerMetrics.js";
import { hasRole } from "../utils/accountRole.js";

const router = Router();
router.use(authMiddleware);

router.post("/fetchTeacherClasses", async (req, res) => {
  
  

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // Ãƒâ€“Ã„Å¸retmen hesabÃ„Â±nÃ„Â± bul
    const teacherDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!teacherDoc.exists)
      return res.status(404).json({ error: "Ãƒâ€“Ã„Å¸retmen hesabÃ„Â± bulunamadÃ„Â±." });

    const teacherData = teacherDoc.data();
    if (!hasRole(teacherData, "teacher"))
      return res.status(403).json({ error: "Yetkiniz bulunmuyor." });

    const institutionId = teacherData.institution_id;
    if (!institutionId)
      return res.status(404).json({ error: "Kurum bilgisi bulunamadÃ„Â±." });

    // Kurum bilgilerini al
    const institutionDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();
    if (!institutionDoc.exists)
      return res.status(404).json({ error: "Kurum bilgileri bulunamadÃ„Â±." });

    const institutionData = institutionDoc.data();

    // Ãƒâ€“Ã„Å¸retmenin atandÃ„Â±Ã„Å¸Ã„Â± sÃ„Â±nÃ„Â±flarÃ„Â± filtrele
    const teacherClasses = [];
    if (institutionData.classes) {
      Object.entries(institutionData.classes).forEach(
        ([classKey, classData]) => {
          if (
            classData.teacher_ids &&
            classData.teacher_ids.includes(decodedToken.uid)
          ) {
            teacherClasses.push({
              id: classKey,
              name: classData.name,
              classCode: classKey,
              student_ids: classData.student_ids || [],
              teacher_ids: classData.teacher_ids || [],
              institution_id: institutionId,
            });
          }
        }
      );
    }

    res.json({ classes: teacherClasses });
  } catch (error) {
    console.error("fetchTeacherClasses hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "SÃ„Â±nÃ„Â±flar yÃƒÂ¼klenirken hata oluÃ…Å¸tu: " + error.message });
  }
});

// useTeacherLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸retmenin atandÃ„Â±Ã„Å¸Ã„Â± sÃ„Â±nÃ„Â±ftaki ÃƒÂ¶Ã„Å¸rencileri ve PlayerMetrics verilerini getir

router.post("/fetchTeacherClassStudents", async (req, res) => {
  const { classId, institutionId } = req.body;
  if (!classId || !institutionId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // Ãƒâ€“Ã„Å¸retmen hesabÃ„Â± ve sÃ„Â±nÃ„Â±f kontrolÃƒÂ¼
    const teacherDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();
    if (!teacherDoc.exists)
      return res.status(404).json({ error: "Ãƒâ€“Ã„Å¸retmen hesabÃ„Â± bulunamadÃ„Â±." });

    const teacherData = teacherDoc.data();
    if (!hasRole(teacherData, "teacher"))
      return res.status(403).json({ error: "Yetkiniz bulunmuyor." });

    // Kurum ve sÃ„Â±nÃ„Â±fÃ„Â± bul
    const institutionDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();
    if (!institutionDoc.exists)
      return res.status(404).json({ error: "Kurum bilgisi bulunamadÃ„Â±." });

    const institutionData = institutionDoc.data();
    if (!institutionData.classes || !institutionData.classes[classId])
      return res.status(404).json({ error: "SÃ„Â±nÃ„Â±f bilgisi bulunamadÃ„Â±." });

    // Ãƒâ€“Ã„Å¸retmenin bu sÃ„Â±nÃ„Â±fa atanmÃ„Â±Ã…Å¸ olmasÃ„Â± kontrolÃƒÂ¼
    const classData = institutionData.classes[classId];
    if (
      !classData.teacher_ids ||
      !classData.teacher_ids.includes(decodedToken.uid)
    )
      return res.status(403).json({ error: "Bu sÃ„Â±nÃ„Â±fa eriÃ…Å¸im izniniz yok." });

    const studentIds = classData.student_ids || [];
    if (studentIds.length === 0) return res.json({ students: [] });

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
    console.error("fetchTeacherClassStudents hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "Ãƒâ€“Ã„Å¸renciler yÃƒÂ¼klenirken hata oluÃ…Å¸tu: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - Kurumdaki tÃƒÂ¼m ÃƒÂ¶Ã„Å¸rencileri ve PlayerMetrics verilerini getir
// Sayfada daha aoptimize olmasÃ„Â± iÃƒÂ§in limit, arama ve sayfalama ekledik
// AyrÃ„Â±ca 'direction' ve 'cursor' parametreleri ile ileri ve geri sayfalama
// Bu sayede daha az veri ÃƒÂ§ekip daha hÃ„Â±zlÃ„Â± sonuÃƒÂ§ alabiliriz
// ÃƒÂ§ektiÃ„Å¸imiz verileri state'e kaydediyoruz ve sayfalama yapÃ„Â±yoruz ve bidaha veritabanÃ„Â±na gitmiyoruz

router.post("/removeTeacherFromInstitution", async (req, res) => {
  const { institutionId, teacherId } = req.body;
  if (!institutionId || !teacherId) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;
    const uid = decodedToken.uid;

    // KullanÃ„Â±cÃ„Â± yetki kontrolÃƒÂ¼ (sadece kurum admini)
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(uid)
      .get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });
    }

    const userData = userDoc.data();
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Ãƒâ€“Ã„Å¸retmen belgesini kontrol et
    const teacherDoc = await admin
      .firestore()
      .collection("Account")
      .doc(teacherId)
      .get();

    if (!teacherDoc.exists) {
      return res.status(404).json({ error: "Ãƒâ€“Ã„Å¸retmen bulunamadÃ„Â±" });
    }

    const teacherData = teacherDoc.data();
    if (teacherData.institution_id !== institutionId) {
      return res
        .status(403)
        .json({ error: "Bu ÃƒÂ¶Ã„Å¸retmen sizin kurumunuza ait deÃ„Å¸il" });
    }

    // Ãƒâ€“Ã„Å¸retmenin institution_id'sini temizle
    await admin.firestore().collection("Account").doc(teacherId).update({
      institution_id: "",
    });

    // Kurum belgesindeki sÃ„Â±nÃ„Â±flardan da ÃƒÂ¶Ã„Å¸retmeni ÃƒÂ§Ã„Â±kar
    const instDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();

    if (instDoc.exists) {
      const instData = instDoc.data();
      let classesUpdated = false;

      console.log(
        `ÄŸÅ¸â€Â Ãƒâ€“Ã„Å¸retmen ${teacherId} iÃƒÂ§in sÃ„Â±nÃ„Â±f kontrolÃƒÂ¼ baÃ…Å¸latÃ„Â±lÃ„Â±yor...`
      );
      console.log(
        `ÄŸÅ¸â€œÅ¡ Toplam sÃ„Â±nÃ„Â±f sayÃ„Â±sÃ„Â±: ${Object.keys(instData.classes || {}).length}`
      );

      // TÃƒÂ¼m sÃ„Â±nÃ„Â±flarda bu ÃƒÂ¶Ã„Å¸retmeni ara ve ÃƒÂ§Ã„Â±kar
      if (instData.classes) {
        Object.keys(instData.classes).forEach((classId) => {
          const classData = instData.classes[classId];

          if (classData.teacher_ids && Array.isArray(classData.teacher_ids)) {
            const teacherIndex = classData.teacher_ids.indexOf(teacherId);
            if (teacherIndex > -1) {
              classData.teacher_ids.splice(teacherIndex, 1);
              classesUpdated = true;
            } else {
            }
          } else {
          }
        });

        // EÃ„Å¸er sÃ„Â±nÃ„Â±flarda deÃ„Å¸iÃ…Å¸iklik olduysa gÃƒÂ¼ncelle
        if (classesUpdated) {
          console.log(`ÄŸÅ¸â€™Â¾ SÃ„Â±nÃ„Â±flar gÃƒÂ¼ncelleniyor...`);
          await admin
            .firestore()
            .collection("Institutions")
            .doc(institutionId)
            .update({
              classes: instData.classes,
            });
        } else {
        }
      } else {
      }
    } else {
    }

    // Ãƒâ€“Ã„Å¸retmen davet kodunu yeniden generate et
    const generateTeacherInvitationCode = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    let newTeacherInvitationCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Benzersiz kod oluÃ…Å¸turmak iÃƒÂ§in dÃƒÂ¶ngÃƒÂ¼
    while (!isUnique && attempts < maxAttempts) {
      newTeacherInvitationCode = generateTeacherInvitationCode();

      // AynÃ„Â± kodun baÃ…Å¸ka bir kurumda kullanÃ„Â±lÃ„Â±p kullanÃ„Â±lmadÃ„Â±Ã„Å¸Ã„Â±nÃ„Â± kontrol et
      const existingInstitution = await admin
        .firestore()
        .collection("Institutions")
        .where("invitation_code_teacher", "==", newTeacherInvitationCode)
        .limit(1)
        .get();

      if (existingInstitution.empty) {
        isUnique = true;
      }
      attempts++;
    }

    if (isUnique) {
      // Kurum belgesini yeni ÃƒÂ¶Ã„Å¸retmen kodu ile gÃƒÂ¼ncelle
      await admin
        .firestore()
        .collection("Institutions")
        .doc(institutionId)
        .update({
          invitation_code_teacher: newTeacherInvitationCode,
          invitation_code_teacher_updated_at:
            admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    res.json({
      success: true,
      message:
        "Ãƒâ€“Ã„Å¸retmen baÃ…Å¸arÃ„Â±yla kurumdan ÃƒÂ§Ã„Â±karÃ„Â±ldÃ„Â± ve ÃƒÂ¶Ã„Å¸retmen davet kodu yenilendi",
      newTeacherCode: isUnique ? newTeacherInvitationCode : null,
    });
  } catch (error) {
    console.error("removeTeacherFromInstitution hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

export default router;


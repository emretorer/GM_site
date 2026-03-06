import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middleware/auth.js";
import { batchGetPlayerMetrics } from "../utils/playerMetrics.js";
import { hasRole } from "../utils/accountRole.js";
import { getAccountDocByUid } from "../utils/accountStore.js";
import { buildPanelGameData } from "../utils/gameDataMapper.js";

const router = Router();
router.use(authMiddleware);

function getComparableTimestamp(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }
  return 0;
}

router.post("/fetchStudentPlayerMetrics", async (req, res) => {
  const { studentId } = req.body;
  if (!studentId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    

    // PlayerMetrics verisini ÃƒÂ§ek
    const playerMetricsDoc = await admin
      .firestore()
      .collection("PlayerMetrics")
      .doc(studentId)
      .get();

    if (!playerMetricsDoc.exists) {
      return res.status(404).json({ error: "PlayerMetrics bulunamadÃ„Â±" });
    }

    res.json({ playerMetrics: playerMetricsDoc.data() });
  } catch (error) {
    console.error("PlayerMetrics ÃƒÂ§ekme hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "PlayerMetrics yÃƒÂ¼klenirken hata: " + error.message });
  }
});

router.post("/fetchOwnStudentPanelData", async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "Geçersiz token" });
    }

    const { doc: accountDoc, source } = await getAccountDocByUid(uid);
    if (!accountDoc?.exists) {
      return res.status(404).json({ error: "Öğrenci hesabı bulunamadı" });
    }

    const accountData = accountDoc.data() || {};
    if (!hasRole(accountData, "child")) {
      return res.status(403).json({ error: "Bu hesap öğrenci hesabı değil" });
    }

    const gameData = await buildPanelGameData({
      uid,
      sourceCollection: source,
      accountData,
    });

    let playerMetrics = null;
    try {
      const playerMetricsDoc = await admin
        .firestore()
        .collection("PlayerMetrics")
        .doc(uid)
        .get();
      if (playerMetricsDoc.exists) {
        playerMetrics = playerMetricsDoc.data();
      }
    } catch (_error) {
      playerMetrics = null;
    }

    return res.json({
      uid,
      gameData: gameData || {},
      playerMetrics: playerMetrics || null,
    });
  } catch (error) {
    console.error("fetchOwnStudentPanelData hatası:", error);
    return res.status(500).json({ error: "Öğrenci panel verisi yüklenemedi" });
  }
});

/////// Teacher API Endpoints start  ///////
// useTeacherLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸retmenin atandÃ„Â±Ã„Å¸Ã„Â± sÃ„Â±nÃ„Â±flarÃ„Â± getir

router.post("/fetchAllStudents", async (req, res) => {
  const {
    institutionId,
    limit = 10,
    searchTerm = "",
    // Yeni parametreler: 'direction' ve 'cursor'
    direction = null, // 'next' veya 'prev' olabilir
    cursor = null, // lastVisibleId veya firstVisibleId
  } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  try {
    const decodedToken = req.user;
    const uid = decodedToken.uid;
    const db = admin.firestore();
    // ... (GÃƒÂ¼venlik kontrolÃƒÂ¼nÃƒÂ¼z aynÃ„Â± kalÃ„Â±yor) ...

    // 1. Ã„Â°stek yapan kullanÃ„Â±cÃ„Â±nÃ„Â±n kendi veritabanÃ„Â± kaydÃ„Â±nÃ„Â± ÃƒÂ§ek.
    const userDoc = await db.collection("Account").doc(uid).get();

    if (!userDoc.exists) {
      return res
        .status(403)
        .json({ error: "Ã„Â°steÃ„Å¸i yapan kullanÃ„Â±cÃ„Â± bulunamadÃ„Â±." });
    }

    const userData = userDoc.data();

    // 2. KullanÃ„Â±cÃ„Â±nÃ„Â±n kurum ID'si ile istenen kurum ID'sini karÃ…Å¸Ã„Â±laÃ…Å¸tÃ„Â±r.
    //    AyrÃ„Â±ca, kullanÃ„Â±cÃ„Â±nÃ„Â±n rolÃƒÂ¼nÃƒÂ¼n bu iÃ…Å¸lemi yapmaya uygun olduÃ„Å¸unu kontrol et (ÃƒÂ¶rneÃ„Å¸in 'admin' veya 'teacher').
    if (
      userData.institution_id !== institutionId ||
      !hasRole(userData, "institution")
    ) {
      // Loglama: Yetkisiz eriÃ…Å¸im denemesini loglamak ÃƒÂ¶nemlidir.
      console.warn(
        `Yetkisiz eriÃ…Å¸im denemesi: KullanÃ„Â±cÃ„Â± ${uid}, ${institutionId} kurumuna eriÃ…Å¸meye ÃƒÂ§alÃ„Â±Ã…Å¸tÃ„Â±.`
      );
      return res.status(403).json({ error: "Bu iÃ…Å¸lemi yapma yetkiniz yok." });
    }

    // --- GÃƒÅ“VENLÃ„Â°K KISMI (BÃ„Â°TÃ„Â°Ã…Â) ---

    const normalizedSearchTerm = String(searchTerm || "").trim().toLowerCase();
    const normalizedLimit = Math.max(
      1,
      Math.min(Number(limit) || 10, 100)
    );

    // Composite index dependency is avoided by loading institution members
    // first, then filtering and paginating in memory.
    const studentsSnapshot = await db
      .collection("Account")
      .where("institution_id", "==", institutionId)
      .get();

    let students = studentsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((student) => hasRole(student, "child"));

    if (normalizedSearchTerm) {
      students = students
        .filter((student) => {
          const haystack = [
            student.mail,
            student.email,
            student.name,
            student.first_name,
            student.last_name,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalizedSearchTerm);
        })
        .sort((a, b) =>
          String(a.mail || a.email || "").localeCompare(
            String(b.mail || b.email || ""),
            "tr"
          )
        );
    } else {
      students.sort(
        (a, b) =>
          getComparableTimestamp(b.account_creation_date) -
          getComparableTimestamp(a.account_creation_date)
      );
    }

    const totalStudents = students.length;
    let startIndex = 0;

    if (cursor) {
      const cursorIndex = students.findIndex((student) => student.id === cursor);
      if (cursorIndex !== -1) {
        if (direction === "next") {
          startIndex = cursorIndex + 1;
        } else if (direction === "prev") {
          startIndex = Math.max(0, cursorIndex - normalizedLimit);
        }
      }
    }

    students = students.slice(startIndex, startIndex + normalizedLimit);

    // Metrikleri ÃƒÂ§ekme kÃ„Â±smÃ„Â± aynÃ„Â±
    const studentIds = students.map((student) => student.id);
    const playerMetricsMap = await batchGetPlayerMetrics(studentIds); // Bu fonksiyonun var olduÃ„Å¸unu varsayÃ„Â±yoruz
    const studentsWithMetrics = students.map((student) => ({
      ...student,
      playerMetrics: playerMetricsMap[student.id] || null,
    }));

    res.json({
      students: studentsWithMetrics,
      pagination: {
        totalStudents: totalStudents,
        totalPages: Math.ceil(totalStudents / normalizedLimit),
        // Ã„Â°stemcinin bir sonraki ve ÃƒÂ¶nceki isteklerde kullanmasÃ„Â± iÃƒÂ§in imleÃƒÂ§ler
        firstVisibleId: students.length > 0 ? students[0].id : null,
        lastVisibleId:
          students.length > 0 ? students[students.length - 1].id : null,
      },
    });
  } catch (error) {
    console.error("TÃƒÂ¼m ÃƒÂ¶Ã„Å¸renciler yÃƒÂ¼klenirken hata:", error);
    res.status(500).json({ error: "Ãƒâ€“Ã„Å¸renciler yÃƒÂ¼klenirken bir hata oluÃ…Å¸tu." });
  }
});

// useRootAdminLogic de kullandÃ„Â±k - Kurum oluÃ…Å¸turma API'si

router.post("/removeStudentFromInstitution", async (req, res) => {
  const { institutionId, studentId } = req.body;
  if (!institutionId || !studentId) {
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

    // Ãƒâ€“Ã„Å¸renci belgesini kontrol et
    const studentDoc = await admin
      .firestore()
      .collection("Account")
      .doc(studentId)
      .get();

    if (!studentDoc.exists) {
      return res.status(404).json({ error: "Ãƒâ€“Ã„Å¸renci bulunamadÃ„Â±" });
    }

    const studentData = studentDoc.data();
    if (studentData.institution_id !== institutionId) {
      return res
        .status(403)
        .json({ error: "Bu ÃƒÂ¶Ã„Å¸renci sizin kurumunuza ait deÃ„Å¸il" });
    }

    // Ãƒâ€“Ã„Å¸rencinin institution_id'sini temizle ve premium_state'ini false yap
    await admin.firestore().collection("Account").doc(studentId).update({
      institution_id: "",
      premium_state: false,
    });

    // Kurum belgesindeki sÃ„Â±nÃ„Â±flardan da ÃƒÂ¶Ã„Å¸renciyi ÃƒÂ§Ã„Â±kar
    const instDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();

    if (instDoc.exists) {
      const instData = instDoc.data();
      let updated = false;

      // SÃ„Â±nÃ„Â±flarÃ„Â±n student_ids array'lerinden kaldÃ„Â±r
      if (instData.classes) {
        Object.keys(instData.classes).forEach((classId) => {
          if (instData.classes[classId].student_ids?.includes(studentId)) {
            instData.classes[classId].student_ids = instData.classes[
              classId
            ].student_ids.filter((id) => id !== studentId);
            updated = true;
          }
        });
      }

      // Ana students array'inden de kaldÃ„Â±r (eÃ„Å¸er varsa)
      if (
        instData.students &&
        Array.isArray(instData.students) &&
        instData.students.includes(studentId)
      ) {
        instData.students = instData.students.filter((id) => id !== studentId);
        updated = true;
      }

      // Kurum kredisini (max_student) 1 artÃ„Â±r
      const currentMaxStudent = instData.max_student || 0;
      const newMaxStudent = currentMaxStudent + 1;

      if (updated) {
        await admin
          .firestore()
          .collection("Institutions")
          .doc(institutionId)
          .update({
            classes: instData.classes,
            students: instData.students || [],
            max_student: newMaxStudent,
          });
      } else {
        // Sadece kredileri gÃƒÂ¼ncellemek iÃƒÂ§in ayrÃ„Â± bir update yapÃ„Â±yoruz
        await admin
          .firestore()
          .collection("Institutions")
          .doc(institutionId)
          .update({
            max_student: newMaxStudent,
          });
      }
    }

    // Students koleksiyonundan da ÃƒÂ¶Ã„Å¸renciyi kaldÃ„Â±r (eÃ„Å¸er varsa)
    try {
      const studentDocRef = admin
        .firestore()
        .collection("Students")
        .doc(studentId);

      const studentDocSnapshot = await studentDocRef.get();
      if (studentDocSnapshot.exists) {
        await studentDocRef.delete();
      }
    } catch (error) {
      console.log(
        "Students koleksiyonundan silme hatasÃ„Â± (ÃƒÂ¶nemsiz):",
        error.message
      );
      // Students koleksiyonu yoksa veya hata varsa devam et
    }

    res.json({
      success: true,
      message: "Ãƒâ€“Ã„Å¸renci baÃ…Å¸arÃ„Â±yla kurumdan ÃƒÂ§Ã„Â±karÃ„Â±ldÃ„Â±",
    });
  } catch (error) {
    console.error("removeStudentFromInstitution hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸retmeni kurumdan ÃƒÂ§Ã„Â±kar

export default router;


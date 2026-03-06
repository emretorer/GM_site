import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middleware/auth.js";
import { getAccountUserType, hasRole } from "../utils/accountRole.js";

const router = Router();
router.use(authMiddleware);

router.post("/fetchClasses", async (req, res) => {
  const { institutionId } = req.body;
  if (!institutionId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    const decodedToken = req.user;

    // KullanÃ„Â±cÃ„Â±nÃ„Â±n Account bilgisini ÃƒÂ§ek
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const userData = userDoc.data();

    // Sadece kurum admini eriÃ…Å¸ebilsin
    if (
      !hasRole(userData, "institution") ||
      userData.institution_id !== institutionId
    ) {
      return res.status(403).json({ error: "Bu kuruma eriÃ…Å¸im izniniz yok" });
    }

    // Kurumun sÃ„Â±nÃ„Â±flarÃ„Â±nÃ„Â± ÃƒÂ§ek
    const instDoc = await admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId)
      .get();

    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();

    res.json({ classes: instData.classes || {} });
  } catch (error) {
    console.error("fetchClasses hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

//  useParentLogic de kullanÃ„Â±yoruz   - Ãƒâ€¡ocuk ekleme iÃƒÂ§in doÃ„Å¸rulama kodu gÃƒÂ¶nder

router.post("/updateInstitution", async (req, res) => {
  const { name, email } = req.body;

  try {
    const decodedToken = req.user;
    const userId = decodedToken.uid;

    // KullanÃ„Â±cÃ„Â±nÃ„Â±n kurum hesabÃ„Â± olduÃ„Å¸unu kontrol et
    const userDoc = await admin
      .firestore()
      .collection("Account")
      .doc(userId)
      .get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });
    }

    const userData = userDoc.data();
    if (!hasRole(userData, "institution")) {
      return res
        .status(403)
        .json({ error: "Sadece kurum hesaplarÃ„Â± bu iÃ…Å¸lemi yapabilir" });
    }

    const institutionId = userData.institution_id;
    if (!institutionId) {
      return res.status(400).json({ error: "Kurum bilgisi bulunamadÃ„Â±" });
    }

    // GÃƒÂ¼ncellenecek alanlarÃ„Â± belirle
    const updateData = {};
    let hasChanges = false;

    if (name && name.trim() !== "") {
      updateData.name = name.trim();
      hasChanges = true;
    }

    if (email && email.trim() !== "") {
      updateData.email = email.trim();
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(400).json({ error: "GÃƒÂ¼ncellenecek veri bulunamadÃ„Â±" });
    }

    // Institutions koleksiyonunu gÃƒÂ¼ncelle
    const institutionRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);
    await institutionRef.update(updateData);

    res.json({
      success: true,
      message: "Kurum bilgileri baÃ…Å¸arÃ„Â±yla gÃƒÂ¼ncellendi",
      updatedData: updateData,
    });
  } catch (error) {
    console.error("Kurum gÃƒÂ¼ncelleme hatasÃ„Â±:", error);
    res
      .status(500)
      .json({ error: "Kurum bilgileri gÃƒÂ¼ncellenirken hata oluÃ…Å¸tu" });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k /fetchTeachers - Kuruma baÃ„Å¸lÃ„Â± ÃƒÂ¶Ã„Å¸retmenleri getir

router.post("/fetchTeachers", async (req, res) => {
  const { institutionId } = req.body;
  if (!institutionId)
    return res.status(400).json({ error: "Eksik parametre" });

  try {
    // Token doÃ„Å¸rulama
    const decodedToken = req.user;

    // Ã„Â°lgili ÃƒÂ¶Ã„Å¸retmenleri ÃƒÂ§ek
    let teachersQuery = await admin
      .firestore()
      .collection("Account")
      .where("userType", "==", "teacher")
      .where("institution_id", "==", institutionId)
      .get();

    if (teachersQuery.empty) {
      teachersQuery = await admin
        .firestore()
        .collection("Account")
        .where("user_type", "==", "teacher")
        .where("institution_id", "==", institutionId)
        .get();
    }

    const teachers = teachersQuery.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    res.json({ teachers });
  } catch (error) {
    console.error("Ãƒâ€“Ã„Å¸retmenler yÃƒÂ¼klenirken hata:", error);
    res.status(500).json({
      error: "Ãƒâ€“Ã„Å¸retmenler yÃƒÂ¼klenirken bir hata oluÃ…Å¸tu: " + error.message,
    });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k /fetchInstitutionData - Kurumsal admin iÃƒÂ§in kurum ve hesap bilgilerini getir

router.post("/fetchInstitutionData", async (req, res) => {
  
  try {
    const decodedToken = req.user;
    const accountRef = admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid);
    const accountDoc = await accountRef.get();

    if (!accountDoc.exists)
      return res.status(404).json({ error: "KullanÃ„Â±cÃ„Â± bulunamadÃ„Â±" });

    const accountData = accountDoc.data();
    if (!hasRole(accountData, "institution")) {
      return res.status(403).json({ error: "Kurumsal hesap deÃ„Å¸il" });
    }

    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(accountData.institution_id);
    const instDoc = await instRef.get();
    if (!instDoc.exists)
      return res.status(404).json({ error: "Kurum bulunamadÃ„Â±" });

    const instData = instDoc.data();

    res.json({
      institution: {
        ...instData,
        id: instDoc.id,
        // Hesap bilgileri de ekleniyor
        mail: accountData.mail,
        userType: getAccountUserType(accountData),
        roles: Array.isArray(accountData.roles)
          ? accountData.roles
          : [getAccountUserType(accountData)].filter(Boolean),
        account_creation_date: accountData.account_creation_date,
      },
      max_student: instData.max_student || 0,
      invitation_code: instData.invitation_code || "",
    });
  } catch (error) {
    console.error("Kurum bilgileri alÃ„Â±nÃ„Â±rken hata:", error);
    res
      .status(500)
      .json({ error: "Kurum bilgileri alÃ„Â±namadÃ„Â±: " + error.message });
  }
});

// Batch PlayerMetrics ÃƒÂ§ekme helper fonksiyonu
router.post("/generateInvitationCode", async (req, res) => {
  const { institutionId } = req.body;
  if (!institutionId) {
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

    // Rastgele 8 haneli kurum kodu oluÃ…Å¸tur
    const generateInvitationCode = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    let newInvitationCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Benzersiz kod oluÃ…Å¸turmak iÃƒÂ§in dÃƒÂ¶ngÃƒÂ¼
    while (!isUnique && attempts < maxAttempts) {
      newInvitationCode = generateInvitationCode();

      // AynÃ„Â± kodun baÃ…Å¸ka bir kurumda kullanÃ„Â±lÃ„Â±p kullanÃ„Â±lmadÃ„Â±Ã„Å¸Ã„Â±nÃ„Â± kontrol et
      const existingInstitution = await admin
        .firestore()
        .collection("Institutions")
        .where("invitation_code", "==", newInvitationCode)
        .limit(1)
        .get();

      if (existingInstitution.empty) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        error: "Benzersiz kurum kodu oluÃ…Å¸turulamadÃ„Â±. LÃƒÂ¼tfen tekrar deneyin.",
      });
    }

    // Kurum belgesini gÃƒÂ¼ncelle
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);

    await instRef.update({
      invitation_code: newInvitationCode,
      invitation_code_updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      invitation_code: newInvitationCode,
      message: "Kurum kodu baÃ…Å¸arÃ„Â±yla oluÃ…Å¸turuldu",
    });
  } catch (error) {
    console.error("generateInvitationCode hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸retmen davet kodu oluÃ…Å¸tur

router.post("/generateTeacherInvitationCode", async (req, res) => {
  const { institutionId } = req.body;
  if (!institutionId) {
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

    // Rastgele 8 haneli ÃƒÂ¶Ã„Å¸retmen davet kodu oluÃ…Å¸tur
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

    if (!isUnique) {
      return res.status(500).json({
        error:
          "Benzersiz ÃƒÂ¶Ã„Å¸retmen davet kodu oluÃ…Å¸turulamadÃ„Â±. LÃƒÂ¼tfen tekrar deneyin.",
      });
    }

    // Kurum belgesini gÃƒÂ¼ncelle
    const instRef = admin
      .firestore()
      .collection("Institutions")
      .doc(institutionId);

    await instRef.update({
      invitation_code_teacher: newTeacherInvitationCode,
      invitation_code_teacher_updated_at:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      newCode: newTeacherInvitationCode,
      invitation_code_teacher: newTeacherInvitationCode,
      message: "Ãƒâ€“Ã„Å¸retmen davet kodu baÃ…Å¸arÃ„Â±yla oluÃ…Å¸turuldu",
    });
  } catch (error) {
    console.error("generateTeacherInvitationCode hatasÃ„Â±:", error);
    res.status(500).json({ error: "Ã„Â°Ã…Å¸lem baÃ…Å¸arÃ„Â±sÃ„Â±z: " + error.message });
  }
});

// useKurumsalAdminLogic de kullandÃ„Â±k - Ãƒâ€“Ã„Å¸renciyi kurumdan ÃƒÂ§Ã„Â±kar

export default router;


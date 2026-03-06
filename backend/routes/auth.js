import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middleware/auth.js";
import { getAccountRoles, getAccountUserType } from "../utils/accountRole.js";
import { getAccountDocByUid } from "../utils/accountStore.js";

const router = Router();
router.use(authMiddleware);
const loggedVerifiedUserIds = new Set();

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function buildFullName(firstName, lastName, fallbackName = "") {
  const fullName = [trimString(firstName), trimString(lastName)]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || trimString(fallbackName);
}

function createBaseAccountFields({
  now,
  email,
  firstName,
  lastName,
  name,
  username,
  usernameNormalized,
}) {
  return {
    account_creation_date: now,
    mail: email,
    email,
    first_name: firstName,
    last_name: lastName,
    name,
    username,
    username_normalized: usernameNormalized,
  };
}

function createInstitutionSeed({ name, email, type }) {
  return {
    classes: {
      class_01: {
        name: "",
        student_ids: [],
        teacher_ids: [],
      },
    },
    finish_date: null,
    invitation_code: "",
    invitation_code_teacher: "",
    max_student: 0,
    name,
    email,
    start_date: null,
    students: [],
    type,
  };
}

router.post("/verifyToken", async (req, res) => {
  try {
    const decodedToken = req.user;
    const { doc: userDoc, source } = await getAccountDocByUid(decodedToken.uid);
    let userType = null;
    let roles = [];

    if (userDoc?.exists) {
      const accountData = userDoc.data();
      userType = getAccountUserType(accountData);
      roles = getAccountRoles(accountData);
    }

    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      userType,
      roles,
      user_type: userType,
      sourceCollection: source,
    });

    if (!loggedVerifiedUserIds.has(decodedToken.uid)) {
      console.log(`Kullanici dogrulandi: ${decodedToken.uid} ${userType}`);
      loggedVerifiedUserIds.add(decodedToken.uid);
    }
  } catch (_error) {
    res.status(401).json({ error: "Gecersiz token" });
  }
});

router.post("/register", async (req, res) => {
  const {
    role,
    email,
    username,
    name,
    firstName,
    lastName,
    birthDate,
    childSchoolCode,
    teacherName,
    teacherInvitationCode,
  } = req.body;

  const requestedRole = trimString(role).toLowerCase();
  const normalizedRole =
    requestedRole === "psikolog" ? "psychologist" : requestedRole;
  const safeEmail = trimString(email).toLowerCase();
  const safeUsername = trimString(username);
  const normalizedUsername = safeUsername.toLowerCase();
  const safeName = trimString(name);
  const safeFirstName = trimString(firstName);
  const safeLastName = trimString(lastName);
  const safeChildSchoolCode = trimString(childSchoolCode);
  const safeTeacherName = trimString(teacherName);
  const safeTeacherInvitationCode = trimString(teacherInvitationCode);
  const requiresPersonalName =
    normalizedRole === "child" ||
    normalizedRole === "parent" ||
    normalizedRole === "psychologist";
  const displayName =
    normalizedRole === "kurum"
      ? safeName
      : buildFullName(safeFirstName, safeLastName, safeName);

  if (!normalizedRole || !safeEmail) {
    return res
      .status(400)
      .json({ message: "Eksik parametre: role ve email gerekli" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(safeEmail)) {
    return res.status(400).json({ message: "Gecersiz email formati" });
  }

  const validRoles = ["child", "kurum", "teacher", "parent", "psychologist"];
  if (!validRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: "Gecersiz rol" });
  }

  if (!safeUsername) {
    return res.status(400).json({ message: "Kullanici adi zorunludur" });
  }

  if (
    safeUsername.length < 3 ||
    safeUsername.length > 32 ||
    !/^[a-zA-Z0-9._-]+$/.test(safeUsername)
  ) {
    return res.status(400).json({
      message:
        "Kullanici adi 3-32 karakter olmali ve sadece harf, rakam, nokta, tire veya alt cizgi icerebilir",
    });
  }

  if (safeName && safeName.length > 100) {
    return res.status(400).json({ message: "Gecersiz isim formati" });
  }

  if (safeFirstName && safeFirstName.length > 50) {
    return res.status(400).json({ message: "Gecersiz ad formati" });
  }

  if (safeLastName && safeLastName.length > 50) {
    return res.status(400).json({ message: "Gecersiz soyad formati" });
  }

  if (requiresPersonalName) {
    if (!safeFirstName) {
      return res.status(400).json({ message: "Ad zorunludur" });
    }
    if (!safeLastName) {
      return res.status(400).json({ message: "Soyad zorunludur" });
    }
  }

  if (normalizedRole === "kurum" && !safeName) {
    return res.status(400).json({ message: "Kurum adi zorunludur" });
  }

  if (normalizedRole === "teacher") {
    if (!safeTeacherName || safeTeacherName.length > 100) {
      return res.status(400).json({
        message: "Ogretmen adi zorunludur ve gecerli formatta olmalidir",
      });
    }
    if (!safeTeacherInvitationCode || safeTeacherInvitationCode.length > 50) {
      return res.status(400).json({
        message:
          "Ogretmen davet kodu zorunludur ve gecerli formatta olmalidir",
      });
    }
  }

  if (safeChildSchoolCode && safeChildSchoolCode.length > 50) {
    return res.status(400).json({ message: "Gecersiz okul kodu formati" });
  }

  if (safeTeacherInvitationCode && safeTeacherInvitationCode.length > 50) {
    return res
      .status(400)
      .json({ message: "Gecersiz ogretmen davet kodu formati" });
  }

  if (safeTeacherName && safeTeacherName.length > 100) {
    return res.status(400).json({ message: "Gecersiz ogretmen ismi formati" });
  }

  try {
    const decodedToken = req.user;
    const uid = decodedToken.uid;

    if (
      decodedToken.email &&
      trimString(decodedToken.email).toLowerCase() !== safeEmail
    ) {
      return res
        .status(403)
        .json({ message: "Token email ve body email eslesmiyor" });
    }

    const db = admin.firestore();
    const now = new Date();

    const existingAccount = await db.collection("Account").doc(uid).get();
    if (existingAccount.exists) {
      return res.status(409).json({ message: "Bu hesap zaten kayitli" });
    }

    const existingUsername = await db
      .collection("Account")
      .where("username_normalized", "==", normalizedUsername)
      .limit(1)
      .get();

    if (!existingUsername.empty) {
      return res.status(409).json({ message: "Bu kullanici adi zaten alinmis" });
    }

    const sharedAccountFields = createBaseAccountFields({
      now,
      email: safeEmail,
      firstName: safeFirstName,
      lastName: safeLastName,
      name: displayName,
      username: safeUsername,
      usernameNormalized: normalizedUsername,
    });

    if (normalizedRole === "child") {
      const childAccountPayload = {
        ...sharedAccountFields,
        userType: "student",
        roles: ["student"],
        birth_date: birthDate ? new Date(birthDate) : null,
        institution_id: "",
        parentID: [],
        premium_state: false,
        player_referans: null,
      };

      if (safeChildSchoolCode) {
        const instQuery = await db
          .collection("Institutions")
          .where("invitation_code", "==", safeChildSchoolCode)
          .limit(1)
          .get();

        if (instQuery.empty) {
          return res.status(400).json({
            message: "Gecersiz okul kodu. Lutfen dogru okul kodunu girin.",
          });
        }

        const instDoc = instQuery.docs[0];
        const instData = instDoc.data();
        const currentMaxStudent = Number(instData.max_student) || 0;

        if (currentMaxStudent <= 0) {
          return res.status(400).json({
            message: "Kurum kredisi tukendi. Yeni ogrenci kaydi yapilamaz.",
          });
        }

        await db.runTransaction(async (transaction) => {
          const instRef = db.collection("Institutions").doc(instDoc.id);
          const accountRef = db.collection("Account").doc(uid);

          transaction.update(instRef, {
            max_student: currentMaxStudent - 1,
            students: admin.firestore.FieldValue.arrayUnion(uid),
          });

          transaction.set(accountRef, {
            ...childAccountPayload,
            institution_id: instDoc.id,
            premium_state: true,
          });
        });

        return res.json({
          success: true,
          message: "Ogrenci hesabi basariyla olusturuldu",
        });
      }

      await db.collection("Account").doc(uid).set(childAccountPayload);

      return res.json({
        success: true,
        message: "Ogrenci hesabi basariyla olusturuldu",
      });
    }

    if (normalizedRole === "kurum" || normalizedRole === "psychologist") {
      const isPsychologist = normalizedRole === "psychologist";
      const institutionType = isPsychologist ? "psikolog" : "okul";
      const institutionName = isPsychologist
        ? displayName || safeUsername
        : safeName || safeUsername;

      await db.runTransaction(async (transaction) => {
        const institutionRef = db.collection("Institutions").doc(uid);
        const accountRef = db.collection("Account").doc(uid);

        transaction.set(
          institutionRef,
          createInstitutionSeed({
            name: institutionName,
            email: safeEmail,
            type: institutionType,
          })
        );

        transaction.set(accountRef, {
          ...sharedAccountFields,
          institution_id: uid,
          userType: isPsychologist ? "psychologist" : "institution",
          roles: [isPsychologist ? "psychologist" : "institution"],
        });
      });

      return res.json({
        success: true,
        message: isPsychologist
          ? "Psikolog hesabi basariyla olusturuldu"
          : "Kurum hesabi basariyla olusturuldu",
      });
    }

    if (normalizedRole === "teacher") {
      const instQuery = await db
        .collection("Institutions")
        .where("invitation_code_teacher", "==", safeTeacherInvitationCode)
        .limit(1)
        .get();

      if (instQuery.empty) {
        return res.status(400).json({
          message: "Gecersiz ogretmen davet kodu. Lutfen dogru kodu girin.",
        });
      }

      const institutionId = instQuery.docs[0].id;

      await db.collection("Account").doc(uid).set({
        ...sharedAccountFields,
        institution_id: institutionId,
        userType: "teacher",
        roles: ["teacher"],
        name: safeTeacherName || displayName,
      });

      return res.json({
        success: true,
        message: "Ogretmen hesabi basariyla olusturuldu",
      });
    }

    if (normalizedRole === "parent") {
      await db.collection("Account").doc(uid).set({
        ...sharedAccountFields,
        userType: "parent",
        roles: ["parent"],
        premium_state: false,
        childs: [],
        institution_id: "",
        parent_code: "",
      });

      return res.json({
        success: true,
        message: "Veli hesabi basariyla olusturuldu",
      });
    }

    return res.status(400).json({ message: "Gecersiz rol" });
  } catch (error) {
    console.error("Kayit API hatasi:", error);
    return res.status(500).json({
      message: "Kayit sirasinda bir hata olustu",
    });
  }
});

export default router;

import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountRaw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env değeri eksik");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountRaw)),
  });
}

const db = admin.firestore();
const APPLY_MODE = process.argv.includes("--apply");
const USERS_COLLECTION = "users";

function hasOwn(objectValue, key) {
  return Object.prototype.hasOwnProperty.call(objectValue, key);
}

function normalizeIdList(values) {
  const asArray = Array.isArray(values) ? values : [values];
  const ids = [];
  const seen = new Set();

  for (const rawValue of asArray) {
    if (rawValue == null) continue;
    const id = String(rawValue).trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }

  return ids;
}

function getParentIds(accountData = {}) {
  const parentIDList = Array.isArray(accountData.parentID)
    ? accountData.parentID
    : [accountData.parentID];
  const legacyParentIds = Array.isArray(accountData.parentIds)
    ? accountData.parentIds
    : [accountData.parentIds];

  return normalizeIdList([
    ...parentIDList,
    ...legacyParentIds,
    accountData.parentId,
    accountData.parent_id,
  ]);
}

function normalizeRole(rawRole) {
  if (rawRole == null) return null;

  if (typeof rawRole === "number") {
    if (rawRole === 0) return "student";
    if (rawRole === 1) return "parent";
    if (rawRole === 2) return "teacher";
    if (rawRole === 3) return "institution";
    if (rawRole === 4) return "admin";
    return String(rawRole);
  }

  const role = String(rawRole).trim().toLowerCase();
  if (!role) return null;

  if (role === "0") return "student";
  if (role === "1") return "parent";
  if (role === "2") return "teacher";
  if (role === "3") return "institution";
  if (role === "4") return "admin";

  if (role === "child") return "student";
  if (role === "student") return "student";
  if (role === "veli") return "parent";
  if (role === "parent") return "parent";
  if (role === "öğretmen" || role === "ogretmen") return "teacher";
  if (role === "teacher") return "teacher";
  if (role === "kurum") return "institution";
  if (role === "institution") return "institution";
  if (role === "admin") return "admin";

  return role;
}

function normalizeRoles(accountData = {}) {
  const rawRoles = Array.isArray(accountData.roles)
    ? accountData.roles
    : [accountData.roles];

  const normalized = [
    ...rawRoles,
    accountData.userType,
    accountData.user_type,
  ]
    .map((role) => normalizeRole(role))
    .filter(Boolean);

  const deduped = [];
  const seen = new Set();
  for (const role of normalized) {
    if (seen.has(role)) continue;
    seen.add(role);
    deduped.push(role);
  }

  return deduped;
}

function isStudentUser(accountData = {}) {
  const roles = normalizeRoles(accountData);
  return roles.includes("student");
}

function getDateObject(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toYmdInIstanbul(dateValue) {
  const date = getDateObject(dateValue);
  if (!date) return null;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
}

function extractBirthDateYmd(accountData = {}) {
  const candidates = [
    accountData.birthDate,
    accountData.Birthdate,
    accountData.birth_date,
  ];

  for (const candidate of candidates) {
    if (candidate == null) continue;
    if (
      typeof candidate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(candidate.trim())
    ) {
      return candidate.trim();
    }

    const ymd = toYmdInIstanbul(candidate);
    if (ymd) return ymd;
  }

  return null;
}

function resolveGender(accountData = {}) {
  const rawValue = accountData.cinsiyet ?? accountData.gender ?? "?";
  const normalized = String(rawValue).trim();
  return normalized || "?";
}

function arraysEqual(listA, listB) {
  if (listA.length !== listB.length) return false;
  for (let i = 0; i < listA.length; i += 1) {
    if (listA[i] !== listB[i]) return false;
  }
  return true;
}

function needsUpdate(accountData = {}, nextState = {}) {
  const currentRoles = normalizeRoles(accountData);
  if (!arraysEqual(currentRoles, nextState.roles)) return true;

  const currentParentIds = getParentIds(accountData);
  if (!arraysEqual(currentParentIds, nextState.parentID)) return true;

  const currentBirthDate = extractBirthDateYmd(accountData);
  if ((currentBirthDate || null) !== (nextState.birthDate || null)) return true;

  const currentGender = resolveGender(accountData);
  if (currentGender !== nextState.cinsiyet) return true;

  if (hasOwn(accountData, "consentAccepted")) return true;
  if (hasOwn(accountData, "consentVersion")) return true;
  if (hasOwn(accountData, "acceptedAt")) return true;
  if (hasOwn(accountData, "userType")) return true;
  if (hasOwn(accountData, "user_type")) return true;
  if (hasOwn(accountData, "Birthdate")) return true;
  if (hasOwn(accountData, "birth_date")) return true;
  if (hasOwn(accountData, "gender")) return true;
  if (hasOwn(accountData, "parentIds")) return true;
  if (hasOwn(accountData, "parentId")) return true;
  if (hasOwn(accountData, "parent_id")) return true;

  return false;
}

async function runMigration() {
  const snapshot = await db.collection(USERS_COLLECTION).get();

  let scanned = 0;
  let studentDocs = 0;
  let planned = 0;
  let applied = 0;

  let batch = db.batch();
  let opsInBatch = 0;

  const commitBatch = async () => {
    if (!opsInBatch) return;
    await batch.commit();
    applied += opsInBatch;
    batch = db.batch();
    opsInBatch = 0;
  };

  for (const doc of snapshot.docs) {
    scanned += 1;
    const data = doc.data() || {};
    if (!isStudentUser(data)) continue;

    studentDocs += 1;

    const nextState = {
      roles: ["student"],
      parentID: getParentIds(data),
      birthDate: extractBirthDateYmd(data),
      cinsiyet: resolveGender(data),
    };

    if (!needsUpdate(data, nextState)) continue;
    planned += 1;

    if (!APPLY_MODE) continue;

    const patch = {
      roles: nextState.roles,
      parentID: nextState.parentID,
      cinsiyet: nextState.cinsiyet,
      consentAccepted: admin.firestore.FieldValue.delete(),
      consentVersion: admin.firestore.FieldValue.delete(),
      acceptedAt: admin.firestore.FieldValue.delete(),
      userType: admin.firestore.FieldValue.delete(),
      user_type: admin.firestore.FieldValue.delete(),
      Birthdate: admin.firestore.FieldValue.delete(),
      birth_date: admin.firestore.FieldValue.delete(),
      gender: admin.firestore.FieldValue.delete(),
      parentIds: admin.firestore.FieldValue.delete(),
      parentId: admin.firestore.FieldValue.delete(),
      parent_id: admin.firestore.FieldValue.delete(),
    };

    if (nextState.birthDate) {
      patch.birthDate = nextState.birthDate;
    }

    batch.update(doc.ref, patch);
    opsInBatch += 1;

    if (opsInBatch >= 400) {
      await commitBatch();
    }
  }

  if (APPLY_MODE) {
    await commitBatch();
  }

  return { scanned, studentDocs, planned, applied };
}

async function run() {
  console.log(
    APPLY_MODE
      ? "Migration mode: APPLY (updates will be written)"
      : "Migration mode: DRY-RUN (no writes)"
  );

  const result = await runMigration();
  console.log(
    `users scanned=${result.scanned} student_docs=${result.studentDocs} planned=${result.planned} applied=${result.applied}`
  );
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

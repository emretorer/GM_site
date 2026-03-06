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
const TARGET_COLLECTIONS = ["Account", "users"];
const LEGACY_FIELDS = ["parentIds", "parentId", "parent_id"];
const APPLY_MODE = process.argv.includes("--apply");

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

function extractParentIds(accountData = {}) {
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

function arraysEqual(listA, listB) {
  if (listA.length !== listB.length) return false;
  for (let i = 0; i < listA.length; i += 1) {
    if (listA[i] !== listB[i]) return false;
  }
  return true;
}

async function migrateCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  let scanned = 0;
  let candidates = 0;
  let updatesPlanned = 0;
  let updatesApplied = 0;

  let batch = db.batch();
  let operationsInBatch = 0;

  const commitBatch = async () => {
    if (!operationsInBatch) return;
    await batch.commit();
    updatesApplied += operationsInBatch;
    batch = db.batch();
    operationsInBatch = 0;
  };

  for (const doc of snapshot.docs) {
    scanned += 1;
    const data = doc.data() || {};
    const hasAnyParentField =
      hasOwn(data, "parentID") || LEGACY_FIELDS.some((field) => hasOwn(data, field));
    if (!hasAnyParentField) continue;

    candidates += 1;
    const nextParentIds = extractParentIds(data);
    const currentParentIds = normalizeIdList(data.parentID);
    const hasLegacyField = LEGACY_FIELDS.some((field) => hasOwn(data, field));
    const needsUpdate = hasLegacyField || !arraysEqual(currentParentIds, nextParentIds);
    if (!needsUpdate) continue;

    updatesPlanned += 1;
    if (!APPLY_MODE) continue;

    batch.update(doc.ref, {
      parentID: nextParentIds,
      parentIds: admin.firestore.FieldValue.delete(),
      parentId: admin.firestore.FieldValue.delete(),
      parent_id: admin.firestore.FieldValue.delete(),
    });
    operationsInBatch += 1;

    if (operationsInBatch >= 400) {
      await commitBatch();
    }
  }

  if (APPLY_MODE) {
    await commitBatch();
  }

  return {
    collectionName,
    scanned,
    candidates,
    updatesPlanned,
    updatesApplied,
  };
}

async function run() {
  console.log(
    APPLY_MODE
      ? "Migration mode: APPLY (updates will be written)"
      : "Migration mode: DRY-RUN (no writes)"
  );

  let totalScanned = 0;
  let totalCandidates = 0;
  let totalPlanned = 0;
  let totalApplied = 0;

  for (const collectionName of TARGET_COLLECTIONS) {
    const result = await migrateCollection(collectionName);
    totalScanned += result.scanned;
    totalCandidates += result.candidates;
    totalPlanned += result.updatesPlanned;
    totalApplied += result.updatesApplied;

    console.log(
      `[${collectionName}] scanned=${result.scanned} candidates=${result.candidates} planned=${result.updatesPlanned} applied=${result.updatesApplied}`
    );
  }

  console.log(
    `TOTAL scanned=${totalScanned} candidates=${totalCandidates} planned=${totalPlanned} applied=${totalApplied}`
  );
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

import admin from "firebase-admin";

export async function getAccountDocByUid(uid) {
  const db = admin.firestore();

  const usersDoc = await db.collection("users").doc(uid).get();
  if (usersDoc.exists) {
    return { doc: usersDoc, source: "users" };
  }

  const accountDoc = await db.collection("Account").doc(uid).get();
  if (accountDoc.exists) {
    return { doc: accountDoc, source: "Account" };
  }

  return { doc: null, source: null };
}


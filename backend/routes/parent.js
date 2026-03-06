import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middleware/auth.js";
import { getAccountUserType, hasRole } from "../utils/accountRole.js";
import { getAccountDocByUid } from "../utils/accountStore.js";
import { buildPanelGameData } from "../utils/gameDataMapper.js";

const router = Router();
router.use(authMiddleware);

function toIsoDate(dateLike) {
  if (!dateLike) return null;
  if (typeof dateLike?.toDate === "function") {
    return dateLike.toDate().toISOString();
  }
  const date = new Date(dateLike);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getChildIds(userData = {}) {
  if (Array.isArray(userData.childs)) {
    return userData.childs;
  }
  if (Array.isArray(userData.children)) {
    return userData.children;
  }
  if (Array.isArray(userData.childIds)) {
    return userData.childIds;
  }
  return [];
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

function buildParentIdPatch(parentIds = []) {
  return {
    parentID: normalizeIdList(parentIds),
    parentIds: admin.firestore.FieldValue.delete(),
    parentId: admin.firestore.FieldValue.delete(),
    parent_id: admin.firestore.FieldValue.delete(),
  };
}

function getEmail(accountData = {}) {
  return accountData.email || accountData.mail || "";
}

// Premium kredi satın alma
router.post("/purchasePremiumCredits", async (req, res) => {
  const { creditsToAdd } = req.body;
  if (!creditsToAdd)
    return res.status(400).json({ error: "Eksik parametre" });
  try {
    const decodedToken = req.user;
    const parentRef = admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid);
    const parentDoc = await parentRef.get();
    if (!parentDoc.exists)
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    const currentCredits = parentDoc.data().premium_credits || 0;
    const newCredits = currentCredits + creditsToAdd;
    await parentRef.update({ premium_credits: newCredits });

    res.json({ success: true, premium_credits: newCredits });
  } catch (error) {
    res.status(401).json({ error: "İşlem başarısız" });
  }
});

// Ebeveyn çocuk listesi
router.post("/fetchChildren", async (req, res) => {
  try {
    const decodedToken = req.user;
    const { doc: userDoc, source: parentSource } = await getAccountDocByUid(
      decodedToken.uid
    );
    if (!userDoc?.exists) {
      return res.status(403).json({ error: "Erişim izniniz yok" });
    }
    const userData = userDoc.data();
    if (!hasRole(userData, "parent")) {
      return res.status(403).json({ error: "Erişim izniniz yok" });
    }
    const childs = getChildIds(userData);
    const childrenList = [];

    for (const childId of childs) {
      if (childId === decodedToken.uid) continue;

      const { doc: childDoc, source: childSource } = await getAccountDocByUid(
        childId
      );

      if (childDoc?.exists) {
        const childData = childDoc.data();
        if (!hasRole(childData, "child")) {
          continue;
        }

        const panelGameData = await buildPanelGameData({
          uid: childDoc.id,
          sourceCollection: childSource,
          accountData: childData,
        });

        let playerMetrics = null;
        try {
          const playerMetricsDoc = await admin
            .firestore()
            .collection("PlayerMetrics")
            .doc(childId)
            .get();
          if (playerMetricsDoc.exists) {
            playerMetrics = playerMetricsDoc.data();
          }
        } catch (e) {
          playerMetrics = null;
        }
        childrenList.push({
          email: getEmail(childData),
          mail: getEmail(childData),
          uid: childDoc.id,
          name: childData.name || childData.first_name || "",
          account_creation_date:
            childData.account_creation_date || childData.createdAt || null,
          createdAt: toIsoDate(
            childData.account_creation_date || childData.createdAt || null
          ),
          lastLoginAt: toIsoDate(childData.lastLoginAt || null),
          updatedAt: toIsoDate(childData.updatedAt || null),
          birth_date: childData.birth_date || childData.birthDate || null,
          institution_id: childData.institution_id,
          parentID: getParentIds(childData),
          player_referans: childData.player_referans,
          premium_state: childData.premium_state,
          userType: getAccountUserType(childData),
          roles: Array.isArray(childData.roles)
            ? childData.roles
            : [getAccountUserType(childData)].filter(Boolean),
          gameData: panelGameData,
          sourceCollection: childSource,
          playerMetrics: playerMetrics,
        });
      }
    }
    res.json({
      children: childrenList,
      premium_credits: userData.premium_credits || 0,
      sourceCollection: parentSource,
    });
  } catch (error) {
    res.status(401).json({ error: "İşlem başarısız" });
  }
});

// Ebeveyn çocuk kaldırma
router.post("/removeChild", async (req, res) => {
  const { childId } = req.body;
  if (!childId)
    return res.status(400).json({ error: "Eksik parametre" });
  try {
    const decodedToken = req.user;
    const parentRef = admin
      .firestore()
      .collection("Account")
      .doc(decodedToken.uid);
    const parentDoc = await parentRef.get();
    if (!parentDoc.exists)
      return res.status(404).json({ error: "Ebeveyn bulunamadı" });

    let childs = Array.isArray(parentDoc.data().childs)
      ? parentDoc.data().childs
      : [];
    childs = childs.filter((id) => id !== childId);
    await parentRef.update({ childs });

    const childRef = admin.firestore().collection("Account").doc(childId);
    const childDoc = await childRef.get();
    if (childDoc.exists) {
      let parentIDs = getParentIds(childDoc.data() || {});
      parentIDs = parentIDs.filter((id) => id !== decodedToken.uid);
      await childRef.update(buildParentIdPatch(parentIDs));
    }

    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: "İşlem başarısız" });
  }
});

// Çocuk ekleme için doğrulama kodu gönder
router.post("/sendVerificationCode", async (req, res) => {
  const { childEmail } = req.body;

  if (!childEmail) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  try {
    const decodedToken = req.user;
    const parentId = decodedToken.uid;

    const parentDoc = await admin
      .firestore()
      .collection("Account")
      .doc(parentId)
      .get();
    if (!parentDoc.exists) {
      return res.status(404).json({ error: "Ebeveyn bulunamadı" });
    }

    const parentData = parentDoc.data();
    const premiumCredits = parentData.premium_credits || 0;

    if (premiumCredits <= 0) {
      return res.status(400).json({
        error: "Çocuk eklemek için önce premium satın almanız gerekiyor.",
      });
    }

    if (childEmail === decodedToken.email) {
      return res.status(400).json({
        error: "Kendi e-posta adresinizi çocuk olarak ekleyemezsiniz.",
      });
    }

    let childQuery = await admin
      .firestore()
      .collection("Account")
      .where("mail", "==", childEmail)
      .where("userType", "in", ["student", "child"])
      .get();

    if (childQuery.empty) {
      childQuery = await admin
        .firestore()
        .collection("Account")
        .where("mail", "==", childEmail)
        .where("user_type", "==", "child")
        .get();
    }

    if (childQuery.empty) {
      return res
        .status(404)
        .json({ error: "Bu e-posta ile kayıtlı bir çocuk bulunamadı." });
    }

    const childDoc = childQuery.docs[0];
    const childId = childDoc.id;

    if (childId === parentId) {
      return res
        .status(400)
        .json({ error: "Kendi hesabınızı çocuk olarak ekleyemezsiniz." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const codeDoc = await admin
      .firestore()
      .collection("verificationCodes")
      .add({
        code,
        parentId,
        childId,
        expiresAt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.json({
      success: true,
      code,
      codeId: codeDoc.id,
    });
  } catch (error) {
    console.error("Doğrulama kodu gönderme hatası:", error);
    res.status(500).json({ error: "Doğrulama kodu gönderilemedi" });
  }
});

// Kodu doğrula ve çocuğu ekle
router.post("/verifyCodeAndLink", async (req, res) => {
  const { codeId, enteredCode } = req.body;

  if (!codeId || !enteredCode) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  try {
    const decodedToken = req.user;
    const parentId = decodedToken.uid;

    const codeDoc = await admin
      .firestore()
      .collection("verificationCodes")
      .doc(codeId)
      .get();

    if (!codeDoc.exists) {
      return res.status(404).json({ error: "Doğrulama kodu bulunamadı" });
    }

    const codeData = codeDoc.data();

    if (codeData.code !== enteredCode) {
      return res.status(400).json({ error: "Geçersiz doğrulama kodu" });
    }

    if (codeData.parentId !== parentId) {
      return res.status(403).json({ error: "Yetkisiz erişim" });
    }

    const expiresAt = codeData.expiresAt.toDate
      ? codeData.expiresAt.toDate()
      : codeData.expiresAt;
    if (new Date(expiresAt) < new Date()) {
      return res.status(400).json({ error: "Doğrulama kodunun süresi dolmuş" });
    }

    const childId = codeData.childId;

    await admin.firestore().runTransaction(async (transaction) => {
      const parentRef = admin.firestore().collection("Account").doc(parentId);
      const childRef = admin.firestore().collection("Account").doc(childId);
      const codeRef = admin
        .firestore()
        .collection("verificationCodes")
        .doc(codeId);

      const parentDoc = await transaction.get(parentRef);
      const childDoc = await transaction.get(childRef);

      if (!parentDoc.exists || !childDoc.exists) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const parentData = parentDoc.data();
      const childData = childDoc.data();

      let childs = Array.isArray(parentData.childs) ? parentData.childs : [];
      if (!childs.includes(childId)) {
        childs.push(childId);
        const newCredits = Math.max(0, (parentData.premium_credits || 0) - 1);
        transaction.update(parentRef, {
          childs,
          premium_credits: newCredits,
        });
      }

      let parentIDs = getParentIds(childData || {});
      if (!parentIDs.includes(parentId)) {
        parentIDs.push(parentId);
      }
      transaction.update(childRef, buildParentIdPatch(parentIDs));

      transaction.delete(codeRef);
    });

    res.json({
      success: true,
      message: "Çocuk başarıyla eklendi! 1 premium kredi kullanıldı.",
    });
  } catch (error) {
    console.error("Kod doğrulama hatası:", error);
    res.status(500).json({ error: "Kod doğrulanamadı" });
  }
});

export default router;


import { Router } from "express";
import admin from "firebase-admin";
import { body, validationResult } from "express-validator";
import { authMiddleware, isAdminMiddleware } from "../middleware/auth.js";

const router = Router();

router.post(
  "/api/admin/create-institution",
  authMiddleware,
  isAdminMiddleware,
  [
    body(
      "institutionName",
      "Kurum adı boş olamaz ve en fazla 100 karakter olmalıdır."
    )
      .trim()
      .notEmpty()
      .isLength({ max: 100 }),
    body("institutionEmail", "Geçerli bir e-posta adresi girin.")
      .isEmail()
      .normalizeEmail(),
    body("institutionPassword", "Şifre en az 6 karakter olmalı.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { institutionName, institutionEmail, institutionPassword } = req.body;

    try {
      const db = admin.firestore();

      const userRecord = await admin.auth().createUser({
        email: institutionEmail,
        password: institutionPassword,
        displayName: institutionName,
        emailVerified: true,
      });

      const newInstitutionUid = userRecord.uid;

      await db.runTransaction(async (transaction) => {
        const institutionRef = db
          .collection("Institutions")
          .doc(newInstitutionUid);
        const accountRef = db.collection("Account").doc(newInstitutionUid);

        transaction.set(institutionRef, {
          name: institutionName,
          email: institutionEmail,
          type: "okul",
          invitation_code: "",
          max_student: 0,
          start_date: null,
          finish_date: null,
          classes: {},
          createdAt: new Date(),
        });

        transaction.set(accountRef, {
          userType: "institution",
          roles: ["institution"],
          account_creation_date: admin.firestore.FieldValue.serverTimestamp(),
          institution_id: newInstitutionUid,
          mail: institutionEmail,
          name: institutionName,
        });
      });

      res.status(201).json({
        success: true,
        message: "Kurum başarıyla oluşturuldu.",
        newInstitution: {
          id: newInstitutionUid,
          name: institutionName,
          email: institutionEmail,
          type: "okul",
          invitation_code: "",
        },
      });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        return res
          .status(409)
          .json({ message: "Bu e-posta adresi zaten kullanımda." });
      }
      console.error("Kurum oluşturma API hatası:", error);
      return res
        .status(500)
        .json({ message: "Kurum oluşturulurken sunucuda bir hata oluştu." });
    }
  }
);

export default router;


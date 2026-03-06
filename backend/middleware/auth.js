import admin from "firebase-admin";
import { hasRole } from "../utils/accountRole.js";
import { getAccountDocByUid } from "../utils/accountStore.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token gerekli" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

export const isAdminMiddleware = async (req, res, next) => {
  try {
    const { doc: userDoc } = await getAccountDocByUid(req.user.uid);
    if (userDoc?.exists && hasRole(userDoc.data(), "admin")) {
      return next();
    }
    return res.status(403).json({ message: "Bu işlemi yapma yetkiniz yok." });
  } catch (error) {
    console.error("Admin yetki kontrolü hatası:", error);
    return res
      .status(500)
      .json({ message: "Yetki kontrolü sırasında bir hata oluştu." });
  }
};

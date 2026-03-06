import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import parentRoutes from "./routes/parent.js";
import adminRoutes from "./routes/admin.js";
import institutionRoutes from "./routes/institution.js";
import classRoutes from "./routes/class.js";
import teacherRoutes from "./routes/teacher.js";
import studentRoutes from "./routes/student.js";

dotenv.config();

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://geniusmethods.co",
  "https://www.geniusmethods.co",
];

function resolveAllowedOrigins() {
  const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins])];
}

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountRaw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env değeri eksik");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountRaw)),
  });
}

const app = express();
const allowedOrigins = resolveAllowedOrigins();
const apiRouters = [
  authRoutes,
  parentRoutes,
  adminRoutes,
  institutionRoutes,
  classRoutes,
  teacherRoutes,
  studentRoutes,
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
for (const router of apiRouters) {
  app.use(router);
  app.use("/api", router);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});

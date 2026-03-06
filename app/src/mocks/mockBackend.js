const MOCK_REGISTER_TOKEN = "mock-register-token";

const MOCK_ACCOUNTS = [
  {
    key: "ogrenci",
    uid: "mock-student-001",
    email: "ogrenci@demo.local",
    password: "demo123",
    displayName: "Deniz Ogrenci",
    token: "mock-student-token",
    userType: "student",
    roles: ["student", "child"],
  },
  {
    key: "veli",
    uid: "mock-parent-001",
    email: "veli@demo.local",
    password: "demo123",
    displayName: "Elif Veli",
    token: "mock-parent-token",
    userType: "parent",
    roles: ["parent"],
  },
  {
    key: "okul",
    uid: "mock-institution-001",
    email: "okul@demo.local",
    password: "demo123",
    displayName: "Nova Bilim Okulu",
    token: "mock-school-token",
    userType: "institution",
    roles: ["institution"],
  },
  {
    key: "psikolog",
    uid: "mock-psychologist-001",
    email: "psikolog@demo.local",
    password: "demo123",
    displayName: "Derya Psikolog",
    token: "mock-psychologist-token",
    userType: "psychologist",
    roles: ["psychologist", "institution"],
  },
];

const ACCOUNT_BY_KEY = MOCK_ACCOUNTS.reduce((acc, account) => {
  acc[account.key] = account;
  return acc;
}, {});

const ACCOUNT_BY_TOKEN = MOCK_ACCOUNTS.reduce((acc, account) => {
  acc[account.token] = account;
  return acc;
}, {
  [MOCK_REGISTER_TOKEN]: {
    uid: "mock-register-user",
    email: "register@demo.local",
    displayName: "Demo Register User",
    token: MOCK_REGISTER_TOKEN,
    userType: null,
    roles: [],
  },
});

const METRICS_TEMPLATE = {
  "El Becerisi ve Hassas Motor Kontrolu Yetenegi": 81,
  "Arac ve Ekipman Kullanimi": 74,
  "Is Akisini ve Siralamayi Yonetme": 68,
  "Duyusal Algi Yetenegi": 79,
  "Dayaniklilik ve Refleks": 86,
  "Karmasik Sistemleri Analiz Etme": 82,
  "Sebep-Sonuc Iliskisi Kurma": 77,
  "Veri Temelli Karar Alma": 73,
  "Hata ve Tutarsizliklari Tespit Etme": 71,
  "Modelleme ve Simulasyon Yapabilme": 75,
  "Harmoni ve Kompozisyon Yetenegi": 64,
  "Yaratici Dusunme ve Soyutlama": 83,
  "Duyusal Estetik Algisi (Ses)": 66,
  "Butune ve Detaylara Hakim Olma": 78,
  "Malzeme ve Dokularla Calisma": 62,
  "Empati ve Toplumsal Duyarlilik": 84,
  "Insanlarla Hizli ve Etkili Iletisim Kurma": 81,
  "Insan Iliskileri ve Duygusal Surecleri Analiz": 76,
  "Esneklik ve Bireysel Ihtiyaclara Cozum": 80,
  "Toplumu Bilgilendirme ve Farkindalik Yaratma": 69,
  "Yerel ve Kuresel Pazari Okuyabilme": 67,
  "Firsat Algisi ve Avantaj Yakalama": 72,
  "Insan Psikolojisini Kar Stratejisine Donusturme": 63,
  "Kendi Ekosistemini Yonetebilme": 74,
  "Rekabet ve Pazar Stratejisi": 70,
  "Arsivleme ve Bilgi Saklama Yetenegi": 79,
  "Dokumantasyon ve Raporlama Yetenegi": 77,
  "Kural ve Prosedurlere Ust Duzey Uyumluluk": 82,
  "Rutin ve Tekrarlayan Islerde Yuksek Performans": 75,
  "Ince Ayrintilari Farketme": 88,
};

function toDateLabel(date) {
  return date.toLocaleDateString("tr-TR");
}

function toTimeLabel(date) {
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function daysAgo(days, hour, minute) {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function createRecentTasks() {
  const tasks = [
    { game: "Liman Lojistik", minutes: 34, days: 0, hour: 18, minute: 10 },
    { game: "BrainClub", minutes: 26, days: 1, hour: 19, minute: 22 },
    { game: "Muze Dedektif", minutes: 31, days: 2, hour: 17, minute: 45 },
    { game: "Arcade", minutes: 24, days: 3, hour: 18, minute: 5 },
    { game: "Su Tasarruf", minutes: 21, days: 4, hour: 16, minute: 40 },
  ];

  return tasks.map((task, index) => {
    const date = daysAgo(task.days, task.hour, task.minute);
    return {
      id: `recent-task-${index + 1}`,
      game: task.game,
      timeRange: toDateLabel(date),
      duration: task.minutes >= 60
        ? `${Math.floor(task.minutes / 60)}s ${task.minutes % 60}dk`
        : `${task.minutes}dk`,
      minutes: task.minutes,
    };
  });
}

function createAccessLogs(recentTasks) {
  return recentTasks.flatMap((task, index) => {
    const base = daysAgo(index, 18, 0);
    const loginAt = new Date(base);
    loginAt.setMinutes(loginAt.getMinutes() - task.minutes);
    return [
      {
        id: `log-in-${index + 1}`,
        date: toDateLabel(loginAt),
        time: toTimeLabel(loginAt),
        type: "in",
        device: "Web",
        duration: "-",
      },
      {
        id: `log-out-${index + 1}`,
        date: toDateLabel(base),
        time: toTimeLabel(base),
        type: "out",
        device: "Web",
        duration: task.duration,
      },
    ];
  });
}

function createFinanceHistory() {
  return [
    {
      id: "fin-1",
      icon: "fa-solid fa-trophy",
      title: "Liman Lojistik gorevi",
      meta: toDateLabel(daysAgo(0, 18, 10)),
      amount: 620,
    },
    {
      id: "fin-2",
      icon: "fa-solid fa-star",
      title: "Gunluk bonus",
      meta: toDateLabel(daysAgo(1, 19, 22)),
      amount: 180,
    },
    {
      id: "fin-3",
      icon: "fa-solid fa-cart-shopping",
      title: "Kostum alimi",
      meta: toDateLabel(daysAgo(2, 17, 45)),
      amount: -240,
    },
  ];
}

function createTaskProgress() {
  return {
    "Plajda Icecek": 81,
    "Bozuk Traktor": 74,
    "Liman Lojistik": 68,
    "Nukleer Santral": 79,
    Arcade: 86,
    Reklamci: 64,
    "Arac Modifiye": 83,
    "Sanat Galerisi": 66,
    Ressam: 78,
    Okul: 80,
    Gazeteci: 84,
    "Su Tasarruf": 69,
    Kutuphane: 79,
    "Giyim Magazasi": 77,
    Manav: 88,
    Komisyoncu: 67,
    Koleksiyoncu: 72,
    Balikci: 74,
    "Muze Dedektif": 77,
    Diyetisyen: 73,
    Hastahane: 82,
    "Baskana Ulas": 81,
    BrainClub: 82,
    Motel: 71,
    Ucak: 75,
  };
}

function createGameData(profile = {}) {
  const recentTasks = createRecentTasks();
  const accessLogs = createAccessLogs(recentTasks);
  const taskProgress = createTaskProgress();
  const financeHistory = createFinanceHistory();

  return {
    weeklyGain: 1580 + (profile.weeklyGainOffset || 0),
    favoriteGame: profile.favoriteGame || "BrainClub",
    weeklyUsageMinutes: [62, 58, 74, 81, 69, 95, 88],
    todayMinutes: 47 + (profile.todayMinutesOffset || 0),
    monthMinutes: 1260 + (profile.monthMinutesOffset || 0),
    yearMinutes: 6420 + (profile.yearMinutesOffset || 0),
    totalMinutes: 9120 + (profile.totalMinutesOffset || 0),
    recentTasks,
    accessLogs,
    skills: {
      motor: 81,
      analysis: 82,
      abstract: 83,
      empathy: 84,
      precision: 88,
      communication: 81,
    },
    riasec: { R: 68, I: 82, A: 76, S: 84, E: 65, C: 79 },
    taskProgress,
    finance: {
      totalPrestige: 12450 + (profile.prestigeOffset || 0),
      monthlyGain: 2380 + (profile.monthlyGainOffset || 0),
      savingsRate: 43,
      educationRatio: 72,
      funRatio: 28,
      goalTitle: "Yeni karakter kostumu",
      goalTarget: 15000,
      goalPercent: 83,
      goalIcon: "fa-solid fa-shirt",
      history: financeHistory,
      dailyLimit: 900,
    },
    playerStats: {
      metrics: { ...METRICS_TEMPLATE },
      riasec_summary: {
        realistic: { report_score: 68 },
        investigative: { report_score: 82 },
        artistic: { report_score: 76 },
        social: { report_score: 84 },
        enterprising: { report_score: 65 },
        conventional: { report_score: 79 },
      },
    },
    rawPlayerStats: {
      metrics: { ...METRICS_TEMPLATE },
      riasec_summary: {
        realistic: { report_score: 68 },
        investigative: { report_score: 82 },
        artistic: { report_score: 76 },
        social: { report_score: 84 },
        enterprising: { report_score: 65 },
        conventional: { report_score: 79 },
      },
    },
  };
}

function createPlayerMetrics() {
  return {
    achievements: [
      { id: 57, title: "Icim Rahat", cat: "Manav", unlocked: true, unlockedAt: daysAgo(0, 18, 10).toISOString() },
      { id: 50, title: "Hizli Servis", cat: "Dondurma", unlocked: true, unlockedAt: daysAgo(3, 18, 5).toISOString() },
    ],
    badges: [
      { achievementId: 57, achievementName: "Icim Rahat", category: "Manav", unlockedAt: daysAgo(0, 18, 10).toISOString(), unlocked: true },
    ],
  };
}

function createChild(options = {}) {
  const now = new Date();
  const playerMetrics = createPlayerMetrics();
  return {
    id: options.id,
    uid: options.id,
    email: options.email,
    mail: options.email,
    name: options.name,
    first_name: options.firstName || options.name.split(" ")[0] || "",
    last_name: options.lastName || options.name.split(" ").slice(1).join(" ") || "",
    roles: ["student", "child"],
    userType: "student",
    institution_id: "inst-demo-001",
    premium_state: true,
    parentID: ["mock-parent-001"],
    account_creation_date: new Date(now.getFullYear(), now.getMonth() - 3, 14).toISOString(),
    createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 14).toISOString(),
    lastLoginAt: daysAgo(options.lastLoginDays || 0, 20, 5).toISOString(),
    updatedAt: daysAgo(0, 20, 5).toISOString(),
    birth_date: "2012-04-14",
    sinif: options.className || "",
    class_name: options.className || "",
    gameData: {
      ...createGameData(options.profile),
      achievements: deepClone(playerMetrics.achievements),
      badges: deepClone(playerMetrics.badges),
    },
    playerMetrics,
    sourceCollection: "Account",
  };
}

function createInitialState() {
  const child1 = createChild({
    id: "child-demo-001",
    email: "ogrenci@demo.local",
    name: "Deniz Ogrenci",
    className: "6-A",
    profile: {
      favoriteGame: "BrainClub",
      prestigeOffset: 0,
      monthlyGainOffset: 0,
      monthMinutesOffset: 0,
    },
    lastLoginDays: 0,
  });

  const child2 = createChild({
    id: "child-demo-002",
    email: "ayse@demo.local",
    name: "Ayse Kocer",
    className: "6-B",
    profile: {
      favoriteGame: "Muze Dedektif",
      prestigeOffset: -1500,
      monthlyGainOffset: -420,
      monthMinutesOffset: -220,
      todayMinutesOffset: -15,
    },
    lastLoginDays: 1,
  });

  const child3 = createChild({
    id: "child-demo-003",
    email: "kaan@demo.local",
    name: "Kaan Demir",
    className: "6-A",
    profile: {
      favoriteGame: "Arcade",
      prestigeOffset: 950,
      monthlyGainOffset: 180,
      monthMinutesOffset: 130,
      todayMinutesOffset: 5,
    },
    lastLoginDays: 0,
  });

  const child4 = createChild({
    id: "child-demo-004",
    email: "mina@demo.local",
    name: "Mina Gunes",
    className: "7-A",
    profile: {
      favoriteGame: "Liman Lojistik",
      prestigeOffset: 650,
      monthlyGainOffset: 340,
      monthMinutesOffset: 240,
      todayMinutesOffset: 10,
    },
    lastLoginDays: 2,
  });

  return {
    parentPremiumCredits: 18,
    verificationCode: {
      id: "mock-code-001",
      code: "123456",
      childId: child2.id,
    },
    invitationCode: "STUDENT-DEMO-2026",
    teacherInvitationCode: "TEACHER-DEMO-2026",
    institution: {
      id: "inst-demo-001",
      name: "Nova Bilim Okulu",
      city: "Istanbul",
      type: "okul",
      invitation_code: "STUDENT-DEMO-2026",
      invitation_code_teacher: "TEACHER-DEMO-2026",
      max_student: 56,
      email: "okul@demo.local",
      mail: "okul@demo.local",
      userType: "institution",
      roles: ["institution"],
      account_creation_date: daysAgo(180, 9, 0).toISOString(),
    },
    classes: {
      class_01: {
        name: "6-A",
        student_ids: [child1.id, child3.id],
        teacher_ids: ["teacher-demo-001"],
      },
      class_02: {
        name: "6-B",
        student_ids: [child2.id],
        teacher_ids: ["teacher-demo-001"],
      },
      class_03: {
        name: "7-A",
        student_ids: [child4.id],
        teacher_ids: ["teacher-demo-002"],
      },
    },
    teachers: [
      { uid: "teacher-demo-001", name: "Murat Ogretmen", email: "murat@demo.local", institution_id: "inst-demo-001", roles: ["teacher"], userType: "teacher" },
      { uid: "teacher-demo-002", name: "Ece Ogretmen", email: "ece@demo.local", institution_id: "inst-demo-001", roles: ["teacher"], userType: "teacher" },
    ],
    students: [child1, child2, child3, child4],
    parentChildIds: [child1.id, child2.id],
  };
}

let mockState = createInitialState();

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePath(path = "") {
  const [cleanPath] = String(path || "").split("?");
  if (!cleanPath) return "/";
  const ensured = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return ensured.replace(/^\/api(?=\/|$)/, "") || "/";
}

function createHttpError(message, status = 400, code = "") {
  const error = new Error(message);
  error.status = status;
  if (code) error.code = code;
  return error;
}

function resolveAccountByToken(authToken) {
  return ACCOUNT_BY_TOKEN[authToken] || null;
}

function ensureAuth(authToken) {
  const account = resolveAccountByToken(authToken);
  if (!account) {
    throw createHttpError("Gecersiz veya eksik token.", 401, "AUTH_TOKEN_INVALID");
  }
  return account;
}

function hasRole(account, role) {
  return Array.isArray(account?.roles) && account.roles.includes(role);
}

function resolveChildById(studentId) {
  return mockState.students.find((student) => student.id === studentId) || null;
}

function resolveChildByEmail(email = "") {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;
  return (
    mockState.students.find(
      (student) => String(student.email || "").trim().toLowerCase() === normalizedEmail
    ) || null
  );
}

function resolveTeacherById(teacherId = "") {
  return mockState.teachers.find((teacher) => teacher.uid === teacherId) || null;
}

function resolveClassById(classId = "") {
  return mockState.classes[classId] || null;
}

function resolveClassEntry(classIdOrName = "") {
  const raw = String(classIdOrName || "").trim();
  if (!raw) return { classId: "", classData: null };

  const directClass = resolveClassById(raw);
  if (directClass) {
    return { classId: raw, classData: directClass };
  }

  const classEntry = Object.entries(mockState.classes).find(
    ([, classData]) => String(classData?.name || "").trim() === raw
  );

  if (!classEntry) return { classId: "", classData: null };

  return {
    classId: classEntry[0],
    classData: classEntry[1],
  };
}

function getParentChildren() {
  return mockState.parentChildIds
    .map((id) => resolveChildById(id))
    .filter(Boolean)
    .map((child) => deepClone(child));
}

function resolveStudentForAccount(account) {
  const byEmail = resolveChildByEmail(account?.email || "");
  if (byEmail) return byEmail;

  const firstParentChildId = mockState.parentChildIds[0];
  if (firstParentChildId) {
    const firstParentChild = resolveChildById(firstParentChildId);
    if (firstParentChild) return firstParentChild;
  }

  return mockState.students[0] || null;
}

function buildVerifyTokenResponse(account) {
  return {
    uid: account.uid,
    email: account.email,
    userType: account.userType,
    roles: deepClone(account.roles || []),
    user_type: account.userType,
    sourceCollection: "Account",
  };
}

function roleToMockAccountKey(roleValue = "") {
  const value = String(roleValue || "").trim().toLowerCase();
  if (value === "child" || value === "ogrenci" || value === "student") return "ogrenci";
  if (value === "parent" || value === "veli") return "veli";
  if (value === "kurum" || value === "okul" || value === "institution") return "okul";
  if (value === "psychologist" || value === "psikolog") return "psikolog";
  return "veli";
}

function generateClassKey() {
  const classKeys = Object.keys(mockState.classes || {});
  const max = classKeys
    .map((key) => Number(String(key).replace("class_", "")))
    .filter(Number.isFinite)
    .reduce((acc, num) => Math.max(acc, num), 0);
  return `class_${String(max + 1).padStart(2, "0")}`;
}

function randomCode(prefix) {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${rand}`;
}

export function getMockCredentialsForType(typeKey = "") {
  const account = ACCOUNT_BY_KEY[typeKey];
  if (!account) return null;
  return {
    email: account.email,
    password: account.password,
  };
}

export function mockSignIn(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "");
  const account = MOCK_ACCOUNTS.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail && item.password === normalizedPassword
  );

  if (!account) {
    throw createHttpError("Mock giris basarisiz. E-posta veya sifre hatali.", 401, "MOCK_INVALID_CREDENTIALS");
  }

  return {
    token: account.token,
    user: {
      uid: account.uid,
      email: account.email,
      displayName: account.displayName,
    },
  };
}

export function mockCreateUser(email, password, displayName = "") {
  const safeEmail = String(email || "").trim().toLowerCase();
  const safePassword = String(password || "");
  if (!safeEmail || !safePassword) {
    throw createHttpError("E-posta ve sifre zorunludur.", 400, "MOCK_REGISTER_INVALID");
  }

  return {
    token: MOCK_REGISTER_TOKEN,
    user: {
      uid: "mock-register-user",
      email: safeEmail,
      displayName: String(displayName || "").trim() || "Demo User",
    },
  };
}

export function resolveMockUserFromToken(token = "") {
  const account = resolveAccountByToken(token);
  if (!account) return null;
  return {
    uid: account.uid,
    email: account.email,
    displayName: account.displayName || account.email,
  };
}

export async function mockApiRequest(path, { method = "POST", body = {}, authToken = "" } = {}) {
  const normalizedPath = normalizePath(path);
  const safeMethod = String(method || "POST").toUpperCase();
  const payload = body && typeof body === "object" ? body : {};

  if (safeMethod === "GET" && normalizedPath === "/health") {
    return { ok: true, mock: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/health") {
    return { ok: true, mock: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/register") {
    const roleKey = roleToMockAccountKey(payload.role);
    const account = ACCOUNT_BY_KEY[roleKey] || ACCOUNT_BY_KEY.veli;
    return {
      success: true,
      message: "Mock kayit basarili.",
      mockToken: account.token,
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/admin/create-institution") {
    const id = String(payload.id || payload.institutionId || "inst-demo-001").trim();
    const name = String(payload.name || payload.institutionName || "Demo Kurum").trim();
    const city = String(payload.city || "Istanbul").trim();

    mockState.institution = {
      ...mockState.institution,
      id: id || mockState.institution.id,
      name: name || mockState.institution.name,
      city: city || mockState.institution.city,
      invitation_code: mockState.invitationCode,
      invitation_code_teacher: mockState.teacherInvitationCode,
    };

    return {
      success: true,
      institution: deepClone(mockState.institution),
    };
  }

  const account = ensureAuth(authToken);

  if (safeMethod === "POST" && normalizedPath === "/verifyToken") {
    return buildVerifyTokenResponse(account);
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchChildren") {
    if (!hasRole(account, "parent")) {
      throw createHttpError("Bu islem icin veli hesabi gerekli.", 403);
    }
    return {
      children: getParentChildren(),
      premium_credits: mockState.parentPremiumCredits,
      sourceCollection: "Account",
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/purchasePremiumCredits") {
    if (!hasRole(account, "parent")) {
      throw createHttpError("Bu islem icin veli hesabi gerekli.", 403);
    }
    const add = Math.max(0, Number(payload.creditsToAdd || 0));
    mockState.parentPremiumCredits += add;
    return { success: true, premium_credits: mockState.parentPremiumCredits };
  }

  if (safeMethod === "POST" && normalizedPath === "/removeChild") {
    if (!hasRole(account, "parent")) {
      throw createHttpError("Bu islem icin veli hesabi gerekli.", 403);
    }
    const childId = String(payload.childId || "");
    mockState.parentChildIds = mockState.parentChildIds.filter((id) => id !== childId);
    return { success: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/sendVerificationCode") {
    if (!hasRole(account, "parent")) {
      throw createHttpError("Bu islem icin veli hesabi gerekli.", 403);
    }
    mockState.verificationCode = {
      id: "mock-code-001",
      code: "123456",
      childId: "child-demo-002",
    };
    return {
      success: true,
      code: mockState.verificationCode.code,
      codeId: mockState.verificationCode.id,
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/verifyCodeAndLink") {
    if (!hasRole(account, "parent")) {
      throw createHttpError("Bu islem icin veli hesabi gerekli.", 403);
    }
    const codeOk =
      payload.codeId === mockState.verificationCode.id &&
      payload.enteredCode === mockState.verificationCode.code;
    if (!codeOk) {
      throw createHttpError("Mock dogrulama kodu hatali.", 400);
    }
    if (!mockState.parentChildIds.includes(mockState.verificationCode.childId)) {
      mockState.parentChildIds.push(mockState.verificationCode.childId);
      mockState.parentPremiumCredits = Math.max(0, mockState.parentPremiumCredits - 1);
    }
    return { success: true, message: "Cocuk eklendi." };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchOwnStudentPanelData") {
    const student = resolveStudentForAccount(account);
    if (!student) {
      throw createHttpError("Mock ogrenci bulunamadi.", 404);
    }
    return {
      uid: student.id,
      gameData: deepClone(student.gameData),
      playerMetrics: deepClone(student.playerMetrics),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchStudentPlayerMetrics") {
    const studentId = String(payload.studentId || "");
    const student = resolveChildById(studentId) || resolveStudentForAccount(account);
    if (!student) {
      throw createHttpError("Mock PlayerMetrics bulunamadi.", 404);
    }
    return {
      playerMetrics: deepClone(student.playerMetrics),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchInstitutionData") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    return {
      institution: deepClone(mockState.institution),
      max_student: mockState.institution.max_student,
      invitation_code: mockState.invitationCode,
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/updateInstitution") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const nextName = String(payload.name || payload.institutionName || "").trim();
    const nextCity = String(payload.city || "").trim();
    const nextMaxStudent = Number(payload.max_student || payload.maxStudent || 0);

    mockState.institution = {
      ...mockState.institution,
      name: nextName || mockState.institution.name,
      city: nextCity || mockState.institution.city,
      max_student:
        Number.isFinite(nextMaxStudent) && nextMaxStudent > 0
          ? nextMaxStudent
          : mockState.institution.max_student,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      institution: deepClone(mockState.institution),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchAllStudents") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    return {
      students: deepClone(mockState.students),
      pagination: {
        totalStudents: mockState.students.length,
        totalPages: 1,
        firstVisibleId: mockState.students[0]?.id || null,
        lastVisibleId: mockState.students[mockState.students.length - 1]?.id || null,
      },
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/removeStudentFromInstitution") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    const studentId = String(payload.studentId || "");
    mockState.students = mockState.students.filter((student) => student.id !== studentId);
    mockState.parentChildIds = mockState.parentChildIds.filter((id) => id !== studentId);
    Object.keys(mockState.classes).forEach((classId) => {
      const classData = mockState.classes[classId];
      classData.student_ids = classData.student_ids.filter((id) => id !== studentId);
    });
    return {
      success: true,
      message: "Ogrenci kurumdan cikarildi.",
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchClasses") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    return { classes: deepClone(mockState.classes) };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchTeachers") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    return { teachers: deepClone(mockState.teachers) };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchClassStudents") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classIdOrName = payload.classId || payload.className || "";
    const { classData } = resolveClassEntry(classIdOrName);
    if (!classData) {
      return { students: [] };
    }

    const students = (classData.student_ids || [])
      .map((id) => resolveChildById(id))
      .filter(Boolean)
      .map((student) => deepClone(student));

    return { students };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchClassTeachers") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classIdOrName = payload.classId || payload.className || "";
    const { classData } = resolveClassEntry(classIdOrName);
    if (!classData) {
      return { teachers: [] };
    }

    const teachers = (classData.teacher_ids || [])
      .map((id) => resolveTeacherById(id))
      .filter(Boolean)
      .map((teacher) => deepClone(teacher));

    return { teachers };
  }

  if (safeMethod === "POST" && normalizedPath === "/removeTeacherFromClass") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classId = String(payload.classId || "");
    const teacherId = String(payload.teacherId || "");
    const classData = resolveClassById(classId);
    if (!classData) {
      throw createHttpError("Sinif bulunamadi.", 404);
    }

    classData.teacher_ids = (classData.teacher_ids || []).filter((id) => id !== teacherId);
    return { success: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/addStudentToClass") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classId = String(payload.classId || "");
    const studentId = String(payload.studentId || "");
    const classData = resolveClassById(classId);
    const student = resolveChildById(studentId);

    if (!classData) {
      throw createHttpError("Sinif bulunamadi.", 404);
    }
    if (!student) {
      throw createHttpError("Ogrenci bulunamadi.", 404);
    }

    if (!classData.student_ids.includes(studentId)) {
      classData.student_ids.push(studentId);
    }

    student.sinif = classData.name;
    student.class_name = classData.name;
    student.updatedAt = new Date().toISOString();

    return {
      success: true,
      classData: deepClone(classData),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/removeStudentFromClass") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classId = String(payload.classId || "");
    const studentId = String(payload.studentId || "");
    const classData = resolveClassById(classId);
    const student = resolveChildById(studentId);

    if (!classData) {
      throw createHttpError("Sinif bulunamadi.", 404);
    }

    classData.student_ids = (classData.student_ids || []).filter((id) => id !== studentId);
    if (student && student.sinif === classData.name) {
      student.sinif = "";
      student.class_name = "";
      student.updatedAt = new Date().toISOString();
    }

    return { success: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/editClassName") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classId = String(payload.classId || "");
    const newClassName = String(payload.newClassName || "").trim();
    const classData = resolveClassById(classId);

    if (!classData) {
      throw createHttpError("Sinif bulunamadi.", 404);
    }
    if (!newClassName) {
      throw createHttpError("Yeni sinif adi zorunludur.", 400);
    }

    const oldClassName = classData.name;
    classData.name = newClassName;

    mockState.students.forEach((student) => {
      if (student.sinif !== oldClassName) return;
      student.sinif = newClassName;
      student.class_name = newClassName;
      student.updatedAt = new Date().toISOString();
    });

    return {
      success: true,
      classData: deepClone(classData),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/assignTeacherToClass") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const classId = String(payload.classId || "");
    const teacherId = String(payload.teacherId || "");
    const classData = resolveClassById(classId);
    const teacher = resolveTeacherById(teacherId);

    if (!classData) {
      throw createHttpError("Sinif bulunamadi.", 404);
    }
    if (!teacher) {
      throw createHttpError("Ogretmen bulunamadi.", 404);
    }

    if (!classData.teacher_ids.includes(teacherId)) {
      classData.teacher_ids.push(teacherId);
    }

    return {
      success: true,
      classData: deepClone(classData),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/removeTeacherFromInstitution") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }

    const teacherId = String(payload.teacherId || "");
    mockState.teachers = mockState.teachers.filter((teacher) => teacher.uid !== teacherId);
    Object.values(mockState.classes).forEach((classData) => {
      classData.teacher_ids = (classData.teacher_ids || []).filter((id) => id !== teacherId);
    });

    return { success: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/generateInvitationCode") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    mockState.invitationCode = randomCode("STUDENT");
    mockState.institution.invitation_code = mockState.invitationCode;
    return {
      success: true,
      code: mockState.invitationCode,
      invitationCode: mockState.invitationCode,
      invitation_code: mockState.invitationCode,
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/generateTeacherInvitationCode") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    mockState.teacherInvitationCode = randomCode("TEACHER");
    mockState.institution.invitation_code_teacher = mockState.teacherInvitationCode;
    return {
      success: true,
      code: mockState.teacherInvitationCode,
      invitationCode: mockState.teacherInvitationCode,
      invitation_code_teacher: mockState.teacherInvitationCode,
      newCode: mockState.teacherInvitationCode,
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/createClass") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    const className = String(payload.className || "").trim();
    if (!className) {
      throw createHttpError("Sinif adi zorunludur.", 400);
    }
    const alreadyExists = Object.values(mockState.classes).some((item) => item.name === className);
    if (alreadyExists) {
      throw createHttpError("Bu sinif adi zaten mevcut.", 400);
    }
    const classKey = generateClassKey();
    mockState.classes[classKey] = { name: className, student_ids: [], teacher_ids: [] };
    return {
      success: true,
      classKey,
      classData: deepClone(mockState.classes[classKey]),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/deleteClass") {
    if (!hasRole(account, "institution")) {
      throw createHttpError("Bu islem icin kurum hesabi gerekli.", 403);
    }
    const classId = String(payload.classId || "");
    if (!mockState.classes[classId]) {
      throw createHttpError("Sinif bulunamadi.", 404);
    }
    delete mockState.classes[classId];
    return { success: true };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchTeacherClasses") {
    return {
      classes: Object.entries(mockState.classes).map(([id, value]) => ({
        id,
        name: value.name,
        student_ids: deepClone(value.student_ids || []),
        teacher_ids: deepClone(value.teacher_ids || []),
        institution_id: mockState.institution.id,
      })),
    };
  }

  if (safeMethod === "POST" && normalizedPath === "/fetchTeacherClassStudents") {
    const classId = String(payload.classId || "");
    const classData = mockState.classes[classId];
    if (!classData) return { students: [] };
    const students = classData.student_ids
      .map((id) => resolveChildById(id))
      .filter(Boolean)
      .map((student) => deepClone(student));
    return { students };
  }

  throw createHttpError(`Mock endpoint tanimli degil: ${normalizedPath}`, 404, "MOCK_ENDPOINT_NOT_FOUND");
}

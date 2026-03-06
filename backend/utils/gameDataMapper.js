import admin from "firebase-admin";

const SKILL_IDS = [
  "motor",
  "equip",
  "workflow",
  "sensory",
  "reflex",
  "analysis",
  "cause",
  "data",
  "error",
  "simulation",
  "harmony",
  "abstract",
  "aesthetic",
  "detail",
  "material",
  "empathy",
  "communication",
  "flexibility",
  "awareness",
  "individual",
  "market",
  "opportunity",
  "psychology",
  "ecosystem",
  "competition",
  "archive",
  "report",
  "compliance",
  "routine",
  "precision",
];

const METRIC_TO_SKILL_ID = {
  "El Becerisi ve Hassas Motor Kontrolü Yeteneği": "motor",
  "Araç ve Ekipman Kullanımı": "equip",
  "Araç ve Ekipman Kullanma": "equip",
  "İş Akışını ve Sıralamayı Yönetme": "workflow",
  "Duyusal Algı Yeteneği": "sensory",
  "Dayanıklılık ve Refleks": "reflex",
  "Karmaşık Sistemleri Analiz Etme": "analysis",
  "Sebep-Sonuç İlişkisi Kurma": "cause",
  "Veri Temelli Karar Alma": "data",
  "Hata ve Tutarsızlıkları Tespit Etme": "error",
  "Modelleme ve Simülasyon Yapabilme": "simulation",
  "Harmoni ve Kompozisyon Yeteneği": "harmony",
  "Yaratıcı Düşünme ve Soyutlama": "abstract",
  "Duyusal Estetik Algısı (Ses)": "aesthetic",
  "Bütüne ve Detaylara Hakim Olma": "detail",
  "Malzeme ve Dokularla Çalışma": "material",
  "Empati ve Toplumsal Duyarlılık": "empathy",
  "İnsanlarla Hızlı ve Etkili İletişim Kurma": "communication",
  "İnsan İlişkileri ve Duygusal Süreçleri Analiz": "communication",
  "Esneklik ve Bireysel İhtiyaçlara Çözüm": "flexibility",
  "Toplumu Bilgilendirme ve Farkındalık Yaratma": "awareness",
  "Esneklik ve Bireysel Çözüm": "individual",
  "Yerel ve Küresel Pazarı Okuyabilme": "market",
  "Fırsat Algısı ve Avantaj Yakalama": "opportunity",
  "İnsan Psikolojisini Kâr Stratejisine Dönüştürme": "psychology",
  "Kendi Ekosistemini Yönetebilme": "ecosystem",
  "Rekabet ve Pazar Stratejisi": "competition",
  "Arşivleme ve Bilgi Saklama Yeteneği": "archive",
  "Arşivleme ve Bilgi Saklama": "archive",
  "Dökümantasyon ve Raporlama Yeteneği": "report",
  "Kural ve Yükümlülüklere Üst Düzey Uyumluluk": "compliance",
  "Rutin ve Tekrarlayan İşlerde Yüksek Performans": "routine",
  "İnce Ayrıntıları Fark Etme": "precision",
  "İnce Ayrıntıları Farketme": "precision",
};

const RIASEC_SUMMARY_TO_KEY = {
  Realistic: "R",
  Investigative: "I",
  Artistic: "A",
  Social: "S",
  Enterprising: "E",
  Conventional: "C",
};

const MISSION_META_BY_HISTORY_DOC = {
  plajGorevGecmisi: {
    name: "Plajda İçecek",
    metric: "El Becerisi ve Hassas Motor Kontrolü Yeteneği",
  },
  bozukTraktorGorevGecmisi: {
    name: "Bozuk Traktör",
    metric: "Araç ve Ekipman Kullanımı",
  },
  limanLojistikGorevGecmisi: {
    name: "Liman Lojistik",
    metric: "İş Akışını ve Sıralamayı Yönetme",
  },
  nukleerSentralGorevGecmisi: {
    name: "Nükleer Santral",
    metric: "Duyusal Algı Yeteneği",
  },
  arcadeSalonuGorevGecmisi: {
    name: "Arcade",
    metric: "Dayanıklılık ve Refleks",
  },
  reklamGorevGecmisi: {
    name: "Reklamcı",
    metric: "Harmoni ve Kompozisyon Yeteneği",
  },
  aracModifyeGorevGecmisi: {
    name: "Araç Modifiye",
    metric: "Yaratıcı Düşünme ve Soyutlama",
  },
  pianoGorevGecmisi: {
    name: "Sanat Galerisi",
    metric: "Duyusal Estetik Algısı (Ses)",
  },
  ressamGorevGecmisi: {
    name: "Ressam",
    metric: "Bütüne ve Detaylara Hakim Olma",
  },
  okulGorevGecmisi: {
    name: "Okul",
    metric: "Esneklik ve Bireysel İhtiyaçlara Çözüm",
  },
  gazeteciGorevGecmisi: {
    name: "Gazeteci",
    metric: "Empati ve Toplumsal Duyarlılık",
  },
  suTasarrufuGorevGecmisi: {
    name: "Su Tasarruf",
    metric: "Toplumu Bilgilendirme ve Farkındalık Yaratma",
  },
  kutuphaneGorevGecmisi: {
    name: "Kütüphane",
    metric: "Arşivleme ve Bilgi Saklama Yeteneği",
  },
  giyimYeniHaliGorevGecmisi: {
    name: "Giyim Mağazası",
    metric: "Dökümantasyon ve Raporlama Yeteneği",
  },
  manavKaliteGorevGecmisi: {
    name: "Manav",
    metric: "İnce Ayrıntıları Farketme",
  },
  komisyoncuGorevGecmisi: {
    name: "Komisyoncu",
    metric: "Yerel ve Küresel Pazarı Okuyabilme",
  },
  koleksiyoncuGorevGecmisi: {
    name: "Koleksiyoncu",
    metric: "Fırsat Algısı ve Avantaj Yakalama",
  },
  balikciGorevGecmisi: {
    name: "Balıkçı",
    metric: "Kendi Ekosistemini Yönetebilme",
  },
  muzeGorevGecmisi: {
    name: "Müze Dedektif",
    metric: "Sebep-Sonuç İlişkisi Kurma",
  },
  nutritionGameGorevGecmisi: {
    name: "Diyetisyen",
    metric: "Veri Temelli Karar Alma",
  },
  hastaneGorevGecmisi: {
    name: "Hastahane",
    metric: "Kural ve Yükümlülüklere Üst Düzey Uyumluluk",
  },
  baskanaUlasGorevGecmisi: {
    name: "Başkana Ulaş",
    metric: "İnsanlarla Hızlı ve Etkili İletişim Kurma",
  },
  brainClubGorevGecmisi: {
    name: "BrainClub",
    metric: "Karmaşık Sistemleri Analiz Etme",
  },
  motelGorevGecmisi: {
    name: "Motel",
    metric: "Hata ve Tutarsızlıkları Tespit Etme",
  },
  ucakGorevGecmisi: {
    name: "Uçak",
    metric: "Modelleme ve Simülasyon Yapabilme",
  },
};

const MISSION_ID_TO_NAME = {
  BeachParty: "Plajda İçecek",
  BozukTraktor: "Bozuk Traktör",
  Diyetisyen: "Diyetisyen",
  Ressam: "Ressam",
  Okul: "Okul",
  ReklamOlusturma: "Reklamcı",
  Komisyoncu: "Komisyoncu",
  AracModifiye: "Araç Modifiye",
  ArcadeSalonu: "Arcade",
  Piyano: "Sanat Galerisi",
  Muze: "Müze Dedektif",
  BaskanaUlas: "Başkana Ulaş",
  Hastane: "Hastahane",
  ManavKalite: "Manav",
  NukleerSentral: "Nükleer Santral",
  Kutuphane: "Kütüphane",
  Koleksiyoncu: "Koleksiyoncu",
  Balikci: "Balıkçı",
  SuTasarrufu: "Su Tasarruf",
  GiyimMagazasi: "Giyim Mağazası",
  Orman: "Orman",
};

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value, 0))));
}

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseTrDate(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function parseEntryDate(entry, fallbackValue) {
  const year = toNumber(entry?.yil, NaN);
  const month = toNumber(entry?.ay, NaN);
  const day = toNumber(entry?.gun, NaN);
  if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
    const parsed = new Date(year, month - 1, day);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const trDate = parseTrDate(entry?.tarih);
  if (trDate) return trDate;

  const genericDate = toDate(entry?.tarih);
  if (genericDate) return genericDate;

  return toDate(fallbackValue);
}

function isCancelled(entry = {}) {
  return Boolean(
    entry.goreviIptalEttiMi ||
      entry.goreviIptalEttimi ||
      entry.gorevIptal ||
      entry.cancelled ||
      entry.canceled
  );
}

function toMinutesFromSeconds(secondsValue) {
  const seconds = toNumber(secondsValue, 0);
  if (seconds <= 0) return 0;
  return Math.max(0, Math.round(seconds / 60));
}

function formatDuration(minutesValue) {
  const minutes = Math.max(0, Math.round(toNumber(minutesValue, 0)));
  if (!minutes) return "0dk";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}dk`;
  if (!mins) return `${hours}s`;
  return `${hours}s ${mins}dk`;
}

function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isSameMonth(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  );
}

function isSameYear(dateA, dateB) {
  return dateA.getFullYear() === dateB.getFullYear();
}

function humanizeMissionDocId(docId) {
  return String(docId || "")
    .replace(/GorevGecmisi$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function resolveMissionMeta(docId) {
  if (MISSION_META_BY_HISTORY_DOC[docId]) {
    return MISSION_META_BY_HISTORY_DOC[docId];
  }
  return {
    name: humanizeMissionDocId(docId) || "Görev",
    metric: null,
  };
}

function buildMissionEntries(gameDataDocs) {
  const entries = [];
  let order = 0;

  for (const [docId, docData] of Object.entries(gameDataDocs)) {
    if (!docId.endsWith("GorevGecmisi")) continue;
    if (!Array.isArray(docData?.gecmis)) continue;

    const missionMeta = resolveMissionMeta(docId);
    const fallbackDate = docData.lastUpdated || null;

    docData.gecmis.forEach((entry, index) => {
      const date = parseEntryDate(entry, fallbackDate);
      const minutes = toMinutesFromSeconds(entry?.gorevSuresi);
      const score = clampPercent(entry?.finalPuan);
      const cancelled = isCancelled(entry);
      const metric = entry?.metrikAdi || missionMeta.metric || null;

      entries.push({
        id: `${docId}-${index}`,
        order: order++,
        docId,
        taskName: missionMeta.name,
        metric,
        date,
        minutes,
        score,
        cancelled,
      });
    });
  }

  return entries;
}

function buildSkillsFromMetrics(metrics = {}) {
  const skills = SKILL_IDS.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  for (const [metricName, value] of Object.entries(metrics || {})) {
    const skillId = METRIC_TO_SKILL_ID[metricName];
    if (!skillId) continue;
    skills[skillId] = clampPercent(value);
  }

  return skills;
}

function buildRiasecFromSummary(riasecSummary = {}) {
  const normalizedSummary = Object.entries(riasecSummary || {}).reduce(
    (acc, [rawKey, value]) => {
      const key = String(rawKey || "").trim().toLowerCase();
      if (!key) return acc;
      acc[key] = value || {};
      return acc;
    },
    {}
  );

  return Object.entries(RIASEC_SUMMARY_TO_KEY).reduce((acc, [summaryKey, riasecKey]) => {
    const summaryValue = normalizedSummary[summaryKey.toLowerCase()] || {};
    acc[riasecKey] = clampPercent(summaryValue?.report_score);
    return acc;
  }, { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
}

function buildTaskProgress({ questCompletions = {}, missionEntries = [], metrics = {} }) {
  const taskProgress = {};

  for (const [questKey, questValue] of Object.entries(questCompletions || {})) {
    const taskName = MISSION_ID_TO_NAME[questKey] || questKey;
    const progress = clampPercent(toNumber(questValue, 0) * 100);
    taskProgress[taskName] = Math.max(taskProgress[taskName] || 0, progress);
  }

  for (const [metricName, metricValue] of Object.entries(metrics || {})) {
    taskProgress[metricName] = Math.max(
      taskProgress[metricName] || 0,
      clampPercent(metricValue)
    );
  }

  for (const entry of missionEntries) {
    if (entry.cancelled) continue;
    taskProgress[entry.taskName] = Math.max(
      taskProgress[entry.taskName] || 0,
      entry.score
    );
    if (entry.metric) {
      taskProgress[entry.metric] = Math.max(taskProgress[entry.metric] || 0, entry.score);
    }
  }

  return taskProgress;
}

function buildUsageAndDurations({ missionEntries, playTimeStats, now }) {
  const weeklyUsageMinutes = [0, 0, 0, 0, 0, 0, 0];
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  let todayMinutes = 0;
  let monthMinutes = 0;
  let yearMinutes = 0;
  let totalFromEntries = 0;

  for (const entry of missionEntries) {
    if (entry.cancelled || !entry.date) continue;
    const minutes = Math.max(0, Math.round(entry.minutes));
    totalFromEntries += minutes;

    if (entry.date >= sevenDaysAgo && entry.date <= now) {
      weeklyUsageMinutes[mondayIndex(entry.date)] += minutes;
    }
    if (isSameDay(entry.date, now)) todayMinutes += minutes;
    if (isSameMonth(entry.date, now)) monthMinutes += minutes;
    if (isSameYear(entry.date, now)) yearMinutes += minutes;
  }

  const totalFromPlayTime = toMinutesFromSeconds(
    playTimeStats?.toplamSureSaniye ?? playTimeStats?.totalSeconds
  );

  return {
    weeklyUsageMinutes: weeklyUsageMinutes.map((value) => Math.max(0, Math.round(value))),
    todayMinutes: Math.max(0, Math.round(todayMinutes)),
    monthMinutes: Math.max(0, Math.round(monthMinutes)),
    yearMinutes: Math.max(0, Math.round(yearMinutes)),
    totalMinutes: Math.max(totalFromEntries, totalFromPlayTime),
  };
}

function buildRecentTasks(missionEntries) {
  const sorted = [...missionEntries]
    .filter((entry) => !entry.cancelled)
    .sort((a, b) => {
      const aTime = a.date?.getTime() || 0;
      const bTime = b.date?.getTime() || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.order - a.order;
    })
    .slice(0, 8);

  return sorted.map((entry, index) => ({
    id: entry.id || `task-${index}`,
    game: entry.taskName || "Görev",
    timeRange: entry.date ? entry.date.toLocaleDateString("tr-TR") : "-",
    duration: formatDuration(entry.minutes),
    minutes: Math.max(0, Math.round(entry.minutes)),
  }));
}

function buildAccessLogs(missionEntries) {
  const sorted = [...missionEntries]
    .filter((entry) => !entry.cancelled)
    .sort((a, b) => {
      const aTime = a.date?.getTime() || 0;
      const bTime = b.date?.getTime() || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.order - a.order;
    })
    .slice(0, 20);

  return sorted.map((entry, index) => ({
    id: `log-${entry.id || index}`,
    date: entry.date ? entry.date.toLocaleDateString("tr-TR") : "-",
    time: entry.date ? entry.date.toLocaleTimeString("tr-TR") : "-",
    type: "in",
    device: "Oyun",
    duration: formatDuration(entry.minutes),
  }));
}

function buildFavoriteGame(missionEntries, careerCenter) {
  const durationByTask = {};
  for (const entry of missionEntries) {
    if (entry.cancelled) continue;
    durationByTask[entry.taskName] =
      (durationByTask[entry.taskName] || 0) + Math.max(0, entry.minutes);
  }

  const favorite = Object.entries(durationByTask).sort((a, b) => b[1] - a[1])[0];
  if (favorite?.[0]) return favorite[0];

  const selected = Array.isArray(careerCenter?.selectedMissions)
    ? careerCenter.selectedMissions[0]
    : null;
  if (selected) return MISSION_ID_TO_NAME[selected] || selected;

  const completed = Array.isArray(careerCenter?.completedMissions)
    ? careerCenter.completedMissions[0]
    : null;
  return completed ? MISSION_ID_TO_NAME[completed] || completed : null;
}

function buildWeeklyGain(missionEntries, now, fallbackValue) {
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const weeklyGain = missionEntries.reduce((sum, entry) => {
    if (entry.cancelled || !entry.date) return sum;
    if (entry.date < sevenDaysAgo || entry.date > now) return sum;
    return sum + toNumber(entry.score, 0);
  }, 0);

  const rounded = Math.max(0, Math.round(weeklyGain));
  if (rounded > 0) return rounded;
  return Math.max(0, Math.round(toNumber(fallbackValue, 0)));
}

function buildFinance({ economy, playerStats, missionEntries, now }) {
  const currentMoney = Math.max(
    0,
    Math.round(toNumber(economy?.currentMoney, toNumber(playerStats?.para, 0)))
  );
  const debt = Math.max(0, Math.round(toNumber(economy?.debt, 0)));

  const monthGain = missionEntries.reduce((sum, entry) => {
    if (entry.cancelled || !entry.date) return sum;
    if (!isSameMonth(entry.date, now)) return sum;
    return sum + toNumber(entry.score, 0);
  }, 0);

  const monthlyGain = Math.max(0, Math.round(monthGain));
  const savingsDenominator = currentMoney + debt;
  const savingsRate =
    savingsDenominator > 0
      ? clampPercent((currentMoney / savingsDenominator) * 100)
      : 0;

  const goalTarget = Math.max(500, currentMoney + 300);
  const goalPercent = clampPercent((currentMoney / goalTarget) * 100);

  const history = [...missionEntries]
    .filter((entry) => !entry.cancelled)
    .sort((a, b) => {
      const aTime = a.date?.getTime() || 0;
      const bTime = b.date?.getTime() || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.order - a.order;
    })
    .slice(0, 8)
    .map((entry, index) => ({
      id: entry.id || `finance-${index}`,
      icon: "fa-solid fa-coins",
      title: `${entry.taskName} görevi`,
      meta: entry.date ? entry.date.toLocaleDateString("tr-TR") : "Sistem",
      amount: Math.max(0, Math.round(toNumber(entry.score, 0))),
    }));

  return {
    totalPrestige: currentMoney,
    monthlyGain,
    savingsRate,
    educationRatio: 75,
    funRatio: 25,
    goalTitle: "Birikim Hedefi",
    goalTarget,
    goalPercent,
    goalIcon: "fa-solid fa-piggy-bank",
    history,
    dailyLimit: 500,
  };
}

function mergeGameData(baseGameData, mappedGameData) {
  if (!baseGameData || typeof baseGameData !== "object") {
    return mappedGameData;
  }

  return {
    ...baseGameData,
    ...mappedGameData,
    finance: {
      ...(baseGameData.finance || {}),
      ...(mappedGameData.finance || {}),
    },
    skills: {
      ...(baseGameData.skills || {}),
      ...(mappedGameData.skills || {}),
    },
    riasec: {
      ...(baseGameData.riasec || {}),
      ...(mappedGameData.riasec || {}),
    },
    taskProgress: {
      ...(baseGameData.taskProgress || {}),
      ...(mappedGameData.taskProgress || {}),
    },
  };
}

async function readSubcollectionGameData(uid, sourceCollection) {
  if (!uid || !sourceCollection) return {};

  const snapshot = await admin
    .firestore()
    .collection(sourceCollection)
    .doc(uid)
    .collection("gameData")
    .get();

  if (snapshot.empty) return {};

  const docs = {};
  snapshot.forEach((doc) => {
    docs[doc.id] = doc.data() || {};
  });
  return docs;
}

export async function buildPanelGameData({
  uid,
  sourceCollection,
  accountData = {},
}) {
  const baseGameData =
    accountData?.gameData && typeof accountData.gameData === "object"
      ? accountData.gameData
      : null;

  let subcollectionDocs = {};
  try {
    subcollectionDocs = await readSubcollectionGameData(uid, sourceCollection);
  } catch (_error) {
    subcollectionDocs = {};
  }

  if (!Object.keys(subcollectionDocs).length) {
    return baseGameData || null;
  }

  const now = new Date();
  const playerStats = subcollectionDocs.playerStats || {};
  const playTimeStats = subcollectionDocs.playTimeStats || {};
  const economy = subcollectionDocs.economy || {};
  const questProgress = subcollectionDocs.questProgress || {};
  const careerCenter = subcollectionDocs.careerCenter || {};

  const missionEntries = buildMissionEntries(subcollectionDocs);
  const metrics = playerStats.metrics || {};
  const skills = buildSkillsFromMetrics(metrics);
  const riasec = buildRiasecFromSummary(playerStats?.riasec_summary || {});
  const taskProgress = buildTaskProgress({
    questCompletions: questProgress.questCompletions || {},
    missionEntries,
    metrics,
  });
  const usageData = buildUsageAndDurations({ missionEntries, playTimeStats, now });
  const recentTasks = buildRecentTasks(missionEntries);
  const accessLogs = buildAccessLogs(missionEntries);
  const favoriteGame = buildFavoriteGame(missionEntries, careerCenter);

  const fallbackWeeklyGain = toNumber(
    playerStats?.para ?? economy?.currentMoney ?? 0,
    0
  );
  const weeklyGain = buildWeeklyGain(missionEntries, now, fallbackWeeklyGain);
  const finance = buildFinance({
    economy,
    playerStats,
    missionEntries,
    now,
  });

  const mappedGameData = {
    weeklyGain,
    favoriteGame,
    weeklyUsageMinutes: usageData.weeklyUsageMinutes,
    todayMinutes: usageData.todayMinutes,
    monthMinutes: usageData.monthMinutes,
    yearMinutes: usageData.yearMinutes,
    totalMinutes: usageData.totalMinutes,
    recentTasks,
    accessLogs,
    skills,
    riasec,
    taskProgress,
    finance,
    playerStats,
    rawPlayerStats: playerStats,
  };

  return mergeGameData(baseGameData, mappedGameData);
}

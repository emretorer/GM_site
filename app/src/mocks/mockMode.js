function parseBooleanEnv(rawValue) {
  const value = String(rawValue || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export function isMockModeEnabled() {
  return parseBooleanEnv(import.meta.env.VITE_USE_MOCK_DATA);
}


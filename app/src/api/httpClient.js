import { authTokenStore } from "./authTokenStore.js";
import { getFirebaseAuthClient } from "../firebase/clientApp.js";
import { isMockModeEnabled } from "../mocks/mockMode.js";
import { mockApiRequest } from "../mocks/mockBackend.js";

const LOCAL_API_BASE_URL = "http://localhost:3000";

function resolveApiBaseUrl() {
  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (import.meta.env.DEV) {
    return LOCAL_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const cleanOrigin = window.location.origin.replace(/\/+$/, "");
    return `${cleanOrigin}/api`;
  }

  return LOCAL_API_BASE_URL;
}

const API_BASE_URL = resolveApiBaseUrl();

let tokenGetter = async () => authTokenStore.get();

async function refreshTokenFromFirebase(forceRefresh = false) {
  if (isMockModeEnabled()) {
    return authTokenStore.get();
  }

  try {
    const auth = getFirebaseAuthClient();
    const user = auth.currentUser;
    if (!user) return "";
    const token = await user.getIdToken(forceRefresh);
    if (token) {
      authTokenStore.set(token);
    }
    return token || "";
  } catch (_error) {
    return "";
  }
}

async function resolveAuthToken() {
  const existingToken = (await tokenGetter?.()) || "";
  if (existingToken) return existingToken;
  return refreshTokenFromFirebase(false);
}

async function fetchWithAuthRetry(url, fetchOptions, authEnabled) {
  let response = await fetch(url, fetchOptions);

  if (!authEnabled || response.status !== 401) {
    return response;
  }

  const refreshedToken = await refreshTokenFromFirebase(true);
  if (!refreshedToken) {
    return response;
  }

  const retryHeaders = new Headers(fetchOptions.headers || {});
  retryHeaders.set("Authorization", `Bearer ${refreshedToken}`);

  response = await fetch(url, {
    ...fetchOptions,
    headers: retryHeaders,
  });

  return response;
}

function normalizePath(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(path) {
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  return `${cleanBase}${normalizePath(path)}`;
}

function resolveProductionRoutingMessage(response, url) {
  if (import.meta.env.DEV) {
    return "";
  }

  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (configuredBaseUrl || typeof window === "undefined") {
    return "";
  }

  const currentOrigin = window.location.origin.replace(/\/+$/, "");
  if (!url.startsWith(`${currentOrigin}/api`)) {
    return "";
  }

  if (response.status !== 404 && response.status !== 405) {
    return "";
  }

  return "API bu domaine bagli degil. VITE_API_BASE_URL tanimlayin veya /api icin reverse proxy kurun.";
}

export function setTokenGetter(getter) {
  tokenGetter = getter;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "POST",
    body,
    headers = {},
    auth = true,
  } = options;

  if (isMockModeEnabled()) {
    const authToken = auth ? await resolveAuthToken() : "";
    if (auth && !authToken) {
      const err = new Error("Auth token missing");
      err.code = "AUTH_TOKEN_MISSING";
      throw err;
    }

    return mockApiRequest(path, {
      method,
      body,
      authToken,
    });
  }

  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await resolveAuthToken();
    if (!token) {
      const err = new Error("Auth token missing");
      err.code = "AUTH_TOKEN_MISSING";
      throw err;
    }
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const url = buildUrl(path);
  const fetchOptions = {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  };

  let response;
  try {
    response = await fetchWithAuthRetry(url, fetchOptions, auth);
  } catch (networkError) {
    const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
    const message = configuredBaseUrl
      ? `API adresine ulasilamiyor: ${configuredBaseUrl}. Domain veya DNS kaydini kontrol edin.`
      : "API sunucusuna ulasilamiyor. Ag veya domain ayarini kontrol edin.";
    const err = new Error(message);
    err.code = "API_FETCH_FAILED";
    err.originalError = networkError;
    throw err;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const productionRoutingMessage = resolveProductionRoutingMessage(
      response,
      url
    );
    const message =
      productionRoutingMessage ||
      payload?.message ||
      payload?.error ||
      `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.payload = payload;
    if (productionRoutingMessage) {
      err.code = "API_ROUTING_MISSING";
    }
    throw err;
  }

  return payload;
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: "GET" });
}

export function apiPost(path, body = {}, options = {}) {
  return apiRequest(path, { ...options, method: "POST", body });
}

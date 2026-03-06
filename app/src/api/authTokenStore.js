const TOKEN_STORAGE_KEY = "firebase_id_token";
const TOKEN_EVENT_NAME = "auth-token-changed";

function emitTokenChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOKEN_EVENT_NAME));
}

export const authTokenStore = {
  get() {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(TOKEN_STORAGE_KEY) || "";
  },
  set(token) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    emitTokenChanged();
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    emitTokenChanged();
  },
};

export { TOKEN_STORAGE_KEY, TOKEN_EVENT_NAME };

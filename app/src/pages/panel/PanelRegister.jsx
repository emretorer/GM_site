import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  authTokenStore,
  backendApi,
  createUserAndStoreToken,
  deleteCurrentUserAndClearToken,
  signOutAndClearToken,
} from "../../api/index.js";
import { getMockCredentialsForType } from "../../mocks/mockBackend.js";
import { isMockModeEnabled } from "../../mocks/mockMode.js";
import "../../styles/panel-pages/panel-login.css";
import "../../styles/panel-pages/panel-register.css";

const REGISTER_TYPES = [
  {
    key: "ogrenci",
    roleValue: "child",
    label: "Ogrenci misin?",
    shortLabel: "Ogrenci",
    icon: "fa-solid fa-graduation-cap",
    color: "#3B82F6",
    description: "Bireysel ogrenci hesabini olustur.",
  },
  {
    key: "veli",
    roleValue: "parent",
    label: "Veli misin?",
    shortLabel: "Veli",
    icon: "fa-solid fa-users",
    color: "#10B981",
    description: "Cocugunun gelisimini takip etmek icin kaydol.",
  },
  {
    key: "okul",
    roleValue: "kurum",
    label: "Okul musun?",
    shortLabel: "Okul",
    icon: "fa-solid fa-school",
    color: "#8B5CF6",
    description: "Kurumsal panel hesabini olustur.",
  },
  {
    key: "psikolog",
    roleValue: "psychologist",
    label: "Psikolog musun?",
    shortLabel: "Psikolog",
    icon: "fa-solid fa-user-doctor",
    color: "#F59E0B",
    description: "Uzman paneli hesabini olustur.",
  },
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  organizationName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function getPanelTarget(typeKey) {
  if (typeKey === "ogrenci") return "/ogrenci-panel/ana-sayfa";
  if (typeKey === "veli") return "/panel/ana-navigasyon";
  return "/okul-panel/dashboard";
}

function requiresPersonalName(typeKey) {
  return typeKey === "ogrenci" || typeKey === "veli" || typeKey === "psikolog";
}

function getPrimaryIdentityLabel(typeKey) {
  return typeKey === "okul" ? "Kurum Adi" : "Ad Soyad";
}

function getPrimaryIdentityValue(typeKey, form) {
  if (typeKey === "okul") {
    return form.organizationName.trim();
  }

  return `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
}

function PanelRegister() {
  const navigate = useNavigate();
  const mockMode = isMockModeEnabled();
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const allMockCredentials = mockMode
    ? REGISTER_TYPES.map((type) => ({
        key: type.key,
        label: type.shortLabel,
        creds: getMockCredentialsForType(type.key),
      })).filter((item) => item.creds)
    : [];

  function handleTypeSelect(type) {
    if (loading) return;
    setSelectedType(type);
    setForm(INITIAL_FORM);
    setError("");
    setSubmitted(false);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) {
      setError("");
    }
  }

  function handleBack() {
    if (loading) return;
    setSelectedType(null);
    setForm(INITIAL_FORM);
    setError("");
    setSubmitted(false);
  }

  async function handleReset() {
    if (loading) return;

    try {
      await signOutAndClearToken();
    } catch (_error) {
      // Ignore logout failures while resetting the local form.
    }

    setSelectedType(null);
    setForm(INITIAL_FORM);
    setError("");
    setSubmitted(false);
  }

  function validateForm() {
    const typeKey = selectedType?.key || "";
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const organizationName = form.organizationName.trim();
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!username || !email || !password || !confirmPassword) {
      return "Lutfen tum alanlari doldurun.";
    }

    if (requiresPersonalName(typeKey) && (!firstName || !lastName)) {
      return "Lutfen isim ve soyisim alanlarini doldurun.";
    }

    if (typeKey === "okul" && !organizationName) {
      return "Lutfen kurum adini girin.";
    }

    if (
      username.length < 3 ||
      username.length > 32 ||
      !/^[a-zA-Z0-9._-]+$/.test(username)
    ) {
      return "Kullanici adi 3-32 karakter olmali ve bosluk icermemelidir.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Gecerli bir e-posta adresi girin.";
    }

    if (password.length < 6) {
      return "Sifre en az 6 karakter olmali.";
    }

    if (password !== confirmPassword) {
      return "Sifreler birbiriyle ayni degil.";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    let firebaseUserCreated = false;

    try {
      const typeKey = selectedType?.key || "";
      const firstName = form.firstName.trim();
      const lastName = form.lastName.trim();
      const organizationName = form.organizationName.trim();
      const username = form.username.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password;
      const identityName =
        typeKey === "okul"
          ? organizationName
          : `${firstName} ${lastName}`.trim();

      await createUserAndStoreToken(email, password, identityName);
      firebaseUserCreated = true;

      const registerPayload = await backendApi.register({
        role: selectedType.roleValue,
        email,
        username,
        name: identityName,
        firstName: requiresPersonalName(typeKey) ? firstName : "",
        lastName: requiresPersonalName(typeKey) ? lastName : "",
      });

      if (isMockModeEnabled() && registerPayload?.mockToken) {
        authTokenStore.set(registerPayload.mockToken);
      }

      setSubmitted(true);
    } catch (submitError) {
      if (firebaseUserCreated) {
        try {
          await deleteCurrentUserAndClearToken();
        } catch (_rollbackError) {
          try {
            await signOutAndClearToken();
          } catch (_signOutError) {
            // Ignore cleanup errors. The original error is more important.
          }
        }
      }

      setError(
        submitError?.message ||
          "Kayit tamamlanamadi. Lutfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoToPanel() {
    if (!selectedType) return;
    navigate(getPanelTarget(selectedType.key));
  }

  return (
    <div className="login-page register-page">
      <div className="login-bg">
        <div className="login-bg-gradient"></div>
        <div className="login-bg-dots"></div>
      </div>

      <Link to="/" className="auth-home-link">
        <i className="fa-solid fa-arrow-left"></i>
        <span>Ana Sayfaya Dön</span>
      </Link>

      <div className="login-container register-container">
        <div className="login-logo-section">
          <img
            src="/assets/logo-2.webp"
            alt="GeniusMethods"
            className="login-logo-img"
          />
          <h1 className="login-brand">Kayit Ol</h1>
          <p className="login-brand-sub">
            Hesap tipini sec, bilgilerini gir, hesabini olustur.
          </p>
        </div>

        {allMockCredentials.length > 0 ? (
          <div className="mock-credentials-box">
            <h3>Demo Giris Bilgileri</h3>
            {allMockCredentials.map((item) => (
              <div key={item.key} className="mock-credential-row">
                <span className="mock-credential-role">{item.label}</span>
                <code>{item.creds.email}</code>
                <code>{item.creds.password}</code>
              </div>
            ))}
          </div>
        ) : null}

        {!selectedType ? (
          <div className="login-type-selection">
            <h2 className="login-heading">Once hesap tipini sec</h2>
            <p className="login-subheading">
              Ogrenci, veli, okul veya psikolog olarak devam edebilirsin.
            </p>

            <div className="login-type-cards">
              {REGISTER_TYPES.map((type) => (
                <button
                  key={type.key}
                  className="login-type-card"
                  onClick={() => handleTypeSelect(type)}
                  style={{ "--card-accent": type.color }}
                  type="button"
                >
                  <div className="ltc-icon-wrap">
                    <i className={type.icon}></i>
                  </div>
                  <div className="ltc-info">
                    <span className="ltc-label">{type.label}</span>
                    <span className="ltc-desc">{type.description}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right ltc-arrow"></i>
                </button>
              ))}
            </div>

            <div className="login-footer-links">
              <span>Zaten hesabin var mi?</span>
              <Link to="/panel/login">Giris Yap</Link>
            </div>
          </div>
        ) : submitted ? (
          <div className="login-form-section register-result">
            <div
              className="login-form-header"
              style={{ "--form-accent": selectedType.color }}
            >
              <div className="lfh-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h2 className="lfh-title">Hesap olusturuldu</h2>
              <p className="lfh-desc">
                {selectedType.shortLabel} hesabin basariyla acildi.
              </p>
            </div>

            <div className="register-summary">
              <div className="register-summary-row">
                <span>Rol</span>
                <strong>{selectedType.shortLabel}</strong>
              </div>
              <div className="register-summary-row">
                <span>{getPrimaryIdentityLabel(selectedType.key)}</span>
                <strong>{getPrimaryIdentityValue(selectedType.key, form)}</strong>
              </div>
              <div className="register-summary-row">
                <span>Kullanici Adi</span>
                <strong>{form.username.trim()}</strong>
              </div>
              <div className="register-summary-row">
                <span>E-posta</span>
                <strong>{form.email.trim()}</strong>
              </div>
            </div>

            <p className="register-note">
              {mockMode
                ? "Demo modda hesap olusturma islemi tamamlandi. Istersen simdi dogrudan paneline gecebilirsin."
                : "Hesabin Firebase uzerinde acildi ve profilin veritabanina kaydedildi. Istersen simdi dogrudan paneline gecebilirsin."}
            </p>

            <div className="register-actions">
              <button
                type="button"
                className="login-submit-btn"
                style={{ "--btn-color": selectedType.color }}
                onClick={handleGoToPanel}
              >
                <span>Panele Git</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <button
                type="button"
                className="register-secondary-button"
                onClick={handleReset}
              >
                Cikis Yap ve Farkli Hesap Ac
              </button>
            </div>
          </div>
        ) : (
          <div className="login-form-section">
            <button
              className="login-back-btn"
              onClick={handleBack}
              type="button"
              disabled={loading}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Rol secimine dön</span>
            </button>

            <div
              className="login-form-header"
              style={{ "--form-accent": selectedType.color }}
            >
              <div className="lfh-icon">
                <i className={selectedType.icon}></i>
              </div>
              <h2 className="lfh-title">{selectedType.shortLabel} Kaydi</h2>
              <p className="lfh-desc">
                Temel bilgilerini ve sifreni girerek hesabini olustur.
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {requiresPersonalName(selectedType.key) ? (
                <div className="register-grid">
                  <div className="login-field">
                    <label htmlFor="register-first-name">Isim</label>
                    <div className="login-input-wrap">
                      <i className="fa-solid fa-user"></i>
                      <input
                        id="register-first-name"
                        type="text"
                        value={form.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="Isminizi girin"
                        autoComplete="given-name"
                      />
                    </div>
                  </div>

                  <div className="login-field">
                    <label htmlFor="register-last-name">Soyisim</label>
                    <div className="login-input-wrap">
                      <i className="fa-solid fa-user-group"></i>
                      <input
                        id="register-last-name"
                        type="text"
                        value={form.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Soyisminizi girin"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="login-field">
                  <label htmlFor="register-organization-name">Kurum Adi</label>
                  <div className="login-input-wrap">
                    <i className="fa-solid fa-building"></i>
                    <input
                      id="register-organization-name"
                      type="text"
                      value={form.organizationName}
                      onChange={(e) =>
                        handleChange("organizationName", e.target.value)
                      }
                      placeholder="Kurum adini girin"
                      autoComplete="organization"
                    />
                  </div>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="register-username">Kullanici Adi</label>
                <div className="login-input-wrap">
                  <i className="fa-solid fa-at"></i>
                  <input
                    id="register-username"
                    type="text"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder="Bir kullanici adi secin"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="register-email">Mail Adresi</label>
                <div className="login-input-wrap">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    id="register-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="ornek@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="register-grid">
                <div className="login-field">
                  <label htmlFor="register-password">Sifre</label>
                  <div className="login-input-wrap">
                    <i className="fa-solid fa-lock"></i>
                    <input
                      id="register-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="En az 6 karakter"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="register-password-confirm">Sifre Tekrar</label>
                  <div className="login-input-wrap">
                    <i className="fa-solid fa-shield-halved"></i>
                    <input
                      id="register-password-confirm"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      placeholder="Sifreni tekrar gir"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              <p className="register-note">
                {mockMode
                  ? "Demo mod aktif: Kayit adimlari mock veriyle calisiyor."
                  : "Bu form artik dogrudan Firebase hesabini ve profil kaydini olusturur."}
              </p>

              {error ? (
                <div className="login-status login-status-error">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="login-submit-btn"
                style={{ "--btn-color": selectedType.color }}
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner"></span>
                ) : (
                  <>
                    <span>Hesap Olustur</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelRegister;

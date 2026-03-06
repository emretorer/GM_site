import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backendApi,
  signInAndStoreToken,
  signOutAndClearToken,
} from "../../api/index.js";
import { getMockCredentialsForType } from "../../mocks/mockBackend.js";
import { isMockModeEnabled } from "../../mocks/mockMode.js";
import "../../styles/panel-pages/panel-login.css";

const LOGIN_TYPES = [
  {
    key: "ogrenci",
    label: "Ogrenci Girisi",
    icon: "fa-solid fa-graduation-cap",
    color: "#3B82F6",
    description: "Oyun hesabinla giris yap",
  },
  {
    key: "veli",
    label: "Veli Girisi",
    icon: "fa-solid fa-users",
    color: "#10B981",
    description: "Cocugunun gelisimini takip et",
  },
  {
    key: "okul",
    label: "Okul Girisi",
    icon: "fa-solid fa-school",
    color: "#8B5CF6",
    description: "Kurum yonetim paneline eris",
  },
  {
    key: "psikolog",
    label: "Psikolog Girisi",
    icon: "fa-solid fa-user-doctor",
    color: "#F59E0B",
    description: "Uzman paneline eris",
  },
];

const LOGIN_TYPE_TO_ACCOUNT_TYPES = {
  ogrenci: ["student", "child"],
  veli: ["parent"],
  okul: ["institution", "kurum"],
  psikolog: ["institution", "kurum", "psychologist", "psikolog"],
};

function isLoginTypeAllowed(loginTypeKey, verifyResult) {
  const allowedTypes = LOGIN_TYPE_TO_ACCOUNT_TYPES[loginTypeKey] || [];
  const resolvedTypes = new Set(
    [
      verifyResult?.userType,
      verifyResult?.user_type,
      ...(Array.isArray(verifyResult?.roles) ? verifyResult.roles : []),
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase())
  );

  return allowedTypes.some((value) => resolvedTypes.has(value));
}

function PanelLogin() {
  const [selectedType, setSelectedType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const mockMode = isMockModeEnabled();
  const demoCredentials =
    mockMode && selectedType ? getMockCredentialsForType(selectedType.key) : null;

  async function handleLogin(e) {
    e.preventDefault();

    if (!selectedType) {
      setStatus("Lutfen once giris tipini secin.");
      setStatusType("error");
      return;
    }

    if (!email.trim() || !password) {
      setStatus("E-posta ve sifre zorunludur.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatus("");
    setStatusType("");

    try {
      await signInAndStoreToken(email.trim(), password);
      const verifiedAccount = await backendApi.verifyToken();

      if (!isLoginTypeAllowed(selectedType.key, verifiedAccount)) {
        await signOutAndClearToken();
        setStatus("Bu hesap secilen giris tipine uygun degil.");
        setStatusType("error");
        return;
      }

      setStatus("Giriş başarılı! Hoş geldiniz.");
      setStatusType("success");

      let target = "/panel/ana-navigasyon";
      if (selectedType.key === "ogrenci") target = "/ogrenci-panel/ana-sayfa";
      if (selectedType.key === "okul" || selectedType.key === "psikolog") {
        target = "/okul-panel/dashboard";
      }

      setTimeout(() => {
        navigate(target);
      }, 1000);
    } catch (error) {
      setStatus(
        error.message || "Giris basarisiz. Lutfen bilgilerinizi kontrol edin."
      );
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setSelectedType(null);
    setEmail("");
    setPassword("");
    setStatus("");
    setStatusType("");
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-gradient"></div>
        <div className="login-bg-dots"></div>
      </div>

      <Link to="/" className="auth-home-link">
        <i className="fa-solid fa-arrow-left"></i>
        <span>Ana Sayfaya Dön</span>
      </Link>

      <div className="login-container">
        <div className="login-logo-section">
          <img
            src="/assets/logo-2.webp"
            alt="GeniusMethods"
            className="login-logo-img"
          />
          <h1 className="login-brand">GeniusMethods</h1>
          <p className="login-brand-sub">
            Gelecegini kesfet, potansiyelini ac
          </p>
        </div>

        {!selectedType ? (
          <div className="login-type-selection">
            <h2 className="login-heading">Giris Yap</h2>
            <p className="login-subheading">
              Hesap turunuzu secerek devam edin
            </p>

            <div className="login-type-cards">
              {LOGIN_TYPES.map((type) => (
                <button
                  key={type.key}
                  className="login-type-card"
                  onClick={() => setSelectedType(type)}
                  style={{ "--card-accent": type.color }}
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
              <span>Hesabın yok mu?</span>
              <Link to="/panel/kayit">Kayıt Ol</Link>
            </div>
          </div>
        ) : (
          <div className="login-form-section">
            <button
              className="login-back-btn"
              onClick={handleBack}
              type="button"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Geri Dön</span>
            </button>

            <div
              className="login-form-header"
              style={{ "--form-accent": selectedType.color }}
            >
              <div className="lfh-icon">
                <i className={selectedType.icon}></i>
              </div>
              <h2 className="lfh-title">{selectedType.label}</h2>
              <p className="lfh-desc">{selectedType.description}</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label htmlFor="login-email">E-posta</label>
                <div className="login-input-wrap">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="login-password">Sifre</label>
                <div className="login-input-wrap">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sifrenizi girin"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {demoCredentials ? (
                <div className="login-status login-status-success">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>
                    Demo hesap: {demoCredentials.email} / {demoCredentials.password}
                  </span>
                  <button
                    type="button"
                    className="login-forgot"
                    onClick={() => {
                      setEmail(demoCredentials.email);
                      setPassword(demoCredentials.password);
                    }}
                  >
                    Doldur
                  </button>
                </div>
              ) : null}

              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" />
                  <span>Beni hatirla</span>
                </label>
                <a href="#" className="login-forgot">
                  Sifremi unuttum
                </a>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
                style={{ "--btn-color": selectedType.color }}
              >
                {loading ? (
                  <span className="login-spinner"></span>
                ) : (
                  <>
                    <span>Giris Yap</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>

              {status && (
                <div className={`login-status login-status-${statusType}`}>
                  <i
                    className={
                      statusType === "success"
                        ? "fa-solid fa-circle-check"
                        : "fa-solid fa-circle-exclamation"
                    }
                  ></i>
                  <span>{status}</span>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelLogin;

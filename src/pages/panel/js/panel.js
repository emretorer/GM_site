/* js/panel.js - Tüm Sayfaların Ortak Yöneticisi */

document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
    renderHeader();
    initializeInteractions();
});

// --- MENÜ YAPILANDIRMASI (Linkleri buradan yönetin) ---
const menuItems = [
    { title: "Haber Akışı", icon: "fa-regular fa-newspaper", link: "haberler.html" },
    { title: "Ana Panel", icon: "fa-solid fa-border-all", link: "ana-navigasyon.html" },
    { title: "Oyun Süresi", icon: "fa-solid fa-chart-simple", link: "oyun-suresi.html" },
    { title: "Yetenek Gelişimi", icon: "fa-solid fa-arrow-trend-up", link: "yetenek.html" },
    { title: "Kariyer Yolu", icon: "fa-solid fa-road", link: "kariyer-yolu.html" },
    { title: "Meslek Rehberi", icon: "fa-solid fa-book-open-reader", link: "meslek-rehberi.html" },
    { title: "Başarılar", icon: "fa-solid fa-medal", link: "basarilar.html" },
    { title: "İlgi Alanları", icon: "fa-regular fa-lightbulb", link: "ilgi-alanlari.html" },
    { title: "Gelişim Ağacı", icon: "fa-solid fa-tree", link: "gelisim-agaci.html" },
    { title: "Oyun Bilgileri", icon: "fa-solid fa-gamepad", link: "oyun-bilgileri.html" },
    { title: "Yardım Paneli", icon: "fa-regular fa-circle-question", link: "yardim.html" },
];

// --- 1. SIDEBAR OLUŞTURUCU ---
function renderSidebar() {
    const currentPage = window.location.pathname.split("/").pop() || "ana-navigasyon.html";
    const sidebarContainer = document.getElementById("app-sidebar");

    let menuHTML = menuItems.map(item => {
        const isActive = currentPage === item.link ? "active" : "";
        return `
            <li class="${isActive}">
                <a href="${item.link}" title="${item.title}">
                    <i class="${item.icon}"></i> <span>${item.title}</span>
                </a>
            </li>
        `;
    }).join("");

    sidebarContainer.innerHTML = `
        <div class="logo-area">
            <div class="logo-part">
                <span class="logo-icon"><i class="fa-solid fa-shapes"></i></span>
                <span class="logo-text">Veli Paneli</span>
            </div>
            <button class="sidebar-toggle-btn" id="sidebarToggle">
                <i class="fa-solid fa-bars-staggered"></i>
            </button>
        </div>
        <nav class="nav-menu">
            <ul>${menuHTML}</ul>
        </nav>
    `;
}

// --- 2. HEADER OLUŞTURUCU ---
function renderHeader() {
    const headerContainer = document.getElementById("app-header");
    
    headerContainer.innerHTML = `
        <div class="search-box"></div>
        <div class="top-bar-right">
            <div class="profile-wrapper">
                <div class="user-profile" id="profileBtn">
                    <img src="https://ui-avatars.com/api/?name=Elif&background=4F46E5&color=fff" alt="Profil">
                    <span class="user-status-dot"></span>
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="pd-header">
                        <div class="pd-user-info">
                            <strong>Elif Yılmaz</strong>
                            <span>Veli Hesabı • Premium</span>
                        </div>
                    </div>
                    <ul class="pd-menu">
                        <li><a href="hesap-ayarlari.html"><i class="fa-solid fa-user-gear"></i> Hesap Ayarları</a></li>
                        <li><a href="odemeler.html"><i class="fa-solid fa-credit-card"></i> Ödemeler</a></li>
                        <li><a href="gizlilik.html"><i class="fa-solid fa-shield-halved"></i> Gizlilik</a></li>
                    </ul>
                    <div class="pd-divider"></div>
                    <ul class="pd-menu">
                        <li><a href="hesap-sil.html" class="text-danger"><i class="fa-solid fa-trash"></i> Hesabı Sil</a></li>
                        <li><a href="login.html" class="text-logout"><i class="fa-solid fa-right-from-bracket"></i> Çıkış Yap</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// --- 3. ETKİLEŞİMLER (Toggle vb.) ---
function initializeInteractions() {
    // Sidebar Toggle
    const toggleBtn = document.getElementById("sidebarToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("expanded");
        });
    }

    // Profil Dropdown Toggle
    const profileBtn = document.getElementById("profileBtn");
    const dropdown = document.getElementById("profileDropdown");

    if (profileBtn && dropdown) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });

        window.addEventListener("click", (e) => {
            if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        });
    }
}
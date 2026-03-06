# GeniusMethods Web Platform - Detayli README

Bu repo, GeniusMethods'in web platformunu 3 ana parca halinde icerir:
1. `app/` - React tabanli frontend (marketing + panel ekranlari)
2. `backend/` - Express + Firebase Admin API
3. `src/pages/` - Eski statik HTML tasarimlari (legacy)

Bu dokuman; kullanilan teknolojileri, mimariyi, sayfa amaclarini, panel ozelliklerini, guvenlik yaklasimini, mock verileri ve eksik kisimlari tek yerde toplar.

## 1. Proje Mimarisi

- Frontend: `app/` altinda Vite + React SPA.
- Backend: `backend/` altinda Express API.
- Kimlik dogrulama: Firebase Authentication (ID token).
- Veri katmani: Firestore (`Account`, `Institutions`, `PlayerMetrics`, `verificationCodes`, `users/{uid}/gameData` veya `Account/{uid}/gameData`).
- Legacy katman: `src/pages/` altindaki statik HTML/CSS/JS dosyalari.

## 2. Klasor Yapisi

- `app/` - aktif frontend kodu
- `app/src/pages/marketing` - marketing ekranlari
- `app/src/pages/panel` - veli paneli
- `app/src/pages/ogrenci-panel` - ogrenci paneli
- `app/src/pages/okul-panel` - okul/kurum paneli
- `app/src/context` - panel veri context yapilari
- `app/src/api` - frontend API istemci katmani
- `backend/` - API server
- `backend/routes` - endpoint gruplari
- `backend/middleware` - auth ve yetki middleware
- `backend/utils` - veri mapleme ve rol yardimcilari
- `src/pages/` - eski statik sayfalar (kademeli gecis icin tutuluyor)

## 3. Teknoloji Yigini ve Araclar

### Frontend

- `react` (19.x): UI katmani
- `react-router-dom` (7.x): route yonetimi
- `vite` (7.x): gelistirme server + build
- `firebase` (12.x): client auth + gerektiginde firestore okuma
- `@fortawesome/fontawesome-free`: ikon seti
- `eslint`: kod kalite kontrolleri
- `express` (frontend paketinde): build sonrasi static serve (`app/server.js`)

### Backend

- `express` (5.x): REST API
- `firebase-admin`: token dogrulama + Firestore server islemleri
- `cors`: origin bazli erisim kontrolu
- `dotenv`: ortam degiskeni yonetimi
- `express-validator`: admin kurum olusturma dogrulamasi

### Altyapi/Deploy

- Frontend: Vite build + Node Express static server (`npm run build`, `npm run start`)
- Backend: Cloud Run uyumlu standalone Express servis
- CORS allow-list: backend tarafinda tanimli + `CORS_ORIGIN` env ile genisletilebilir

## 4. Kurulum ve Calistirma

### On Kosullar

- Node.js 18+ onerilir
- npm
- Firebase projesi ve servis hesabi

### 4.1 Backend (lokal)

```bash
cd backend
npm install
```

Gerekli env:

- `FIREBASE_SERVICE_ACCOUNT` -> JSON string
- `CORS_ORIGIN` -> virgulle ayrilmis origin listesi (opsiyonel ama onerilir)
- `PORT` -> opsiyonel (default: 3000)

Calistirma:

```bash
npm run dev
# veya
npm start
```

### 4.2 Frontend (lokal)

```bash
cd app
npm install
```

Gerekli env:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` (opsiyonel)
- `VITE_FIREBASE_STORAGE_BUCKET` (opsiyonel)
- `VITE_API_BASE_URL` (opsiyonel)

Not:

- `VITE_API_BASE_URL` bos birakilirsa:
- dev modda `http://localhost:3000` kullanilir
- production'da ayni domain altinda `/api` hedeflenir

Calistirma:

```bash
npm run dev
```

### 4.3 Frontend Build/Serve

```bash
cd app
npm run build
npm run start
```

## 5. Sayfalarin Amaci ve Islevleri

### 5.1 Marketing

- `/` - Ana tanitim, urun degeri, marka anlatisi
- `/vizyon-misyon` - kurum vizyonu ve misyonu
- `/urunler` - urun paketleri ve hedef kullanici gruplari
- `/tubitak-onayli` - TUBITAK / bilimsel yaklasim sayfasi
- `/davranis-analitik` - `TubitakPage` yonlendirmesi
- `/biz-kimiz` - ekip/kurumsal hikaye
- `/hakkimizda` - sirket hakkinda ozet

### 5.2 Veli Paneli (`/panel`)

- `/panel/ana-navigasyon` - cocuk bazli panel kisayollari
- `/panel/haberler` - cocuktan uretilen "guncel akis" kartlari
- `/panel/oyun-suresi` - sure, haftalik kullanim, gorev ve log ozeti
- `/panel/yetenek` - metrikten turetilen yetenek barlari
- `/panel/kariyer-yolu` - kariyer kartlari (su an statik)
- `/panel/meslek-rehberi` - RIASEC meslek rehberi (su an statik)
- `/panel/basarilar` - rozet vitrin (su an buyuk oranda statik)
- `/panel/ilgi-alanlari` - RIASEC radar ve aciklama paneli
- `/panel/gelisim-agaci` - gorev ilerleme matrisi
- `/panel/finans` - oyun ici ekonomi ve birikim hedefi
- `/panel/oyun-bilgileri` - veli icin oyunu anlatan bilgi sayfasi
- `/panel/yardim` - SSS yardim kutusu (su an statik)
- `/panel/hesap-ayarlari` - hesap alanlari (su an statik)
- `/panel/odemeler` - odeme/fatura listesi (su an statik)
- `/panel/gizlilik` - gizlilik ayarlari (su an statik)
- `/panel/hesap-sil` - hesap silme uyarisi (islem butonu pasif)
- `/panel/login` - rol secimli giris
- `/panel/kayit` - rol secimli kayit

### 5.3 Ogrenci Paneli (`/ogrenci-panel`)

- `/ogrenci-panel/ana-sayfa` - ogrenci dashboard menusu
- `/ogrenci-panel/yetenek` - ogrencinin kendi metrik gorunumu
- `/ogrenci-panel/meslek-rehberi` - panel meslek rehberinin aynisi
- `/ogrenci-panel/finans` - finans kartlari (su an demo veri)
- `/ogrenci-panel/basarilar` - rozet listesi (su an statik veri)

### 5.4 Okul/Kurum Paneli (`/okul-panel`)

- `/okul-panel/dashboard` - kurum genel bakis (ogrenci/sinif/ogretmen)
- `/okul-panel/ogrenciler` - ogrenci listeleme/filtreleme
- `/okul-panel/ogrenci-detay` - secili ogrenci detay + yetenek paneli
- `/okul-panel/siniflar` - sinif olusturma/silme ve sinif dagilimi
- `/okul-panel/ayarlar` - kurum bilgileri ve davet kodlari

## 6. Panel Ozellikleri

### 6.1 Veli Paneli Ozellikleri

- Ebeveyn token ile cocuk listesi cekme (`fetchChildren`)
- Cocuk linkleme/dogrulama kodu akisleri
- Oyun verisini panel formatina mapleme (`buildPanelGameData`)
- Haftalik/aylik sure ve gorev ozetleri
- RIASEC ilgi analizi
- Yetenek ve gelisim agaci gorsellestirmesi
- Finansal oyun icgoru kartlari

### 6.2 Ogrenci Paneli Ozellikleri

- Token dogrulamasi ile kendi panel verisini cekme (`fetchOwnStudentPanelData`)
- Gerekirse `PlayerMetrics` fallback okumalari
- Yetenek goruntulemesi (veli paneli component tekrar kullanimi)

### 6.3 Okul Paneli Ozellikleri

- Kurum bilgisi cekme
- Tum ogrencileri kurum bazli listeleme
- Sinif olusturma/silme
- Ogrenci detay ve aylik aktivite gorunumu
- Ogrenci/ogretmen davet kodu uretimi

## 7. Veri Akisi (Ozet)

1. Kullanici frontendde Firebase Auth ile login olur.
2. ID token `localStorage` icine yazilir (`firebase_id_token`).
3. Frontend API cagrilari `Authorization: Bearer <token>` ile gider.
4. Backend `authMiddleware` ile tokeni `verifyIdToken` uzerinden dogrular.
5. Role gore endpoint izni verilir veya reddedilir.
6. Firestore'dan ham veri alinir, panel icin maplenir ve frontend'e donulur.

## 8. Guvenlik Onlemleri

### 8.1 Uygulanan Onlemler

- Firebase ID token dogrulamasi (`authMiddleware`)
- Role-based yetkilendirme (`hasRole`, role normalization)
- Admin endpointlerinde ek admin kontrolu (`isAdminMiddleware`)
- CORS allow-list yaklasimi
- Kayit endpointinde alan dogrulamalari:
- email formati
- sifre minimum uzunluk
- username format/sinir
- rol bazli zorunlu alanlar
- Bazi kritik akislarda transaction kullanimi:
- cocuk linkleme
- kurum/ogrenci olusturma adimlari
- Frontendde 401 durumunda token refresh + retry mekanizmasi

### 8.2 Bilinen Guvenlik Aciklari / Gelistirme Ihtiyaclari

- `POST /fetchStudentPlayerMetrics` endpointinde sahiplik/rol kontrolu eksik.
- `sendVerificationCode` cevabinda dogrulama kodu donuluyor (uretimde donmemeli).
- Token `localStorage`'da tutuluyor (XSS riskine acik bir model).
- Rate limiting / brute-force korumasi / audit log katmani yok.
- Detayli merkezi hata izleme (Sentry vb.) yok.

## 9. Mock / Demo Giris Bilgileri ve Test Verileri

Bu repoda **hardcoded gercek login kullanici+sifre** bulunmuyor.

Koda gomulu placeholder/demo degerler:

1. Login/Kayit form placeholder e-posta:
- `ornek@email.com`

2. Hesap ayarlari statik e-posta:
- `elif@example.com`

3. Okul paneli davet kodu fallback degerleri (API hata durumunda):
- `CODE-DEMO-1234`
- `TEACH-DEMO-5678`

Onemli:

- Bu degerler gercek kimlik bilgisi degildir.
- Gercek test loginleri Firebase Authentication uzerinden olusturulmalidir.

## 10. Eksik Kisimlar / Teknik Borc Listesi

1. Veli panelinde su sayfalar statik veya yarim entegre:
- kariyer yolu
- meslek rehberi
- yardim
- odemeler
- hesap ayarlari
- gizlilik
- simulasyonlar

2. Ogrenci panelinde:
- finans sayfasi demo veri kullaniyor
- basarilar sayfasi statik ID listesi kullaniyor

3. Veli basarilar sayfasi:
- rozetler static `allAchievements + userUnlockedIDs` ile render ediliyor

4. Okul paneli:
- davet kodu response key uyumsuzlugu nedeniyle API basarili olsa bile fallback demo kodu gorunebiliyor

5. Veri butunlugu:
- Bazi ekranlarda UTF/encoding bozuk metinler var
- Bazi alanlar (`city`, sinif isim standardi vb.) veri setinde tutarli degilse ekranlar bos kaliyor

6. Operasyonel eksikler:
- Test altyapisi yok (unit/integration/e2e)
- CI pipeline ve otomatik kalite kapilari tanimli degil
- API dokumantasyonu (OpenAPI/Swagger) yok

## 11. Backend Endpoint Gruplari (Kisa Ozet)

- Auth:
- `POST /verifyToken`
- `POST /register`

- Parent:
- `POST /fetchChildren`
- `POST /purchasePremiumCredits`
- `POST /removeChild`
- `POST /sendVerificationCode`
- `POST /verifyCodeAndLink`

- Student:
- `POST /fetchOwnStudentPanelData`
- `POST /fetchStudentPlayerMetrics`
- `POST /fetchAllStudents`
- `POST /removeStudentFromInstitution`

- Institution:
- `POST /fetchInstitutionData`
- `POST /fetchClasses`
- `POST /fetchTeachers`
- `POST /updateInstitution`
- `POST /generateInvitationCode`
- `POST /generateTeacherInvitationCode`

- Class:
- `POST /createClass`
- `POST /deleteClass`
- `POST /fetchClassStudents`
- `POST /fetchClassTeachers`
- `POST /addStudentToClass`
- `POST /removeStudentFromClass`
- `POST /assignTeacherToClass`
- `POST /removeTeacherFromClass`
- `POST /editClassName`

- Teacher:
- `POST /fetchTeacherClasses`
- `POST /fetchTeacherClassStudents`
- `POST /removeTeacherFromInstitution`

- Admin:
- `POST /api/admin/create-institution`

## 12. Legacy Notu

- `src/pages/` altindaki HTML dosyalari onceki statik tasarim katmanidir.
- Aktif urun akisi `app/` + `backend/` uzerinden ilerlemektedir.
- Legacy dosyalar referans ve tasarim arsivi amaciyla tutulur.

## 13. Hedeflenen Sonraki Adimlar

1. Statik panel bolumlerini backend verisine baglamak.
2. Guvenlik aciklarini kapatmak (`fetchStudentPlayerMetrics`, verification code response vb.).
3. API response sozlesmelerini sabitlemek (davet kodu alan adlari dahil).
4. Test ve CI altyapisini eklemek.
5. Kodlama/encoding standardini tek formatta birlestirmek (UTF-8).

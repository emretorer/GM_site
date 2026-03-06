import '../../styles/panel-pages/navigasyon.css'

const html = "\n<header class=\"top-header\">\n<div class=\"logo-area\">\n<div class=\"logo-icon\"><i class=\"fa-solid fa-shapes\"></i></div>\n<span>Veli Paneli</span>\n</div>\n<div class=\"user-profile\">\n<img alt=\"Profil\" src=\"https://ui-avatars.com/api/name=Elif&amp;background=0D8ABC&amp;color=fff\"/>\n</div>\n</header>\n<div class=\"container\">\n<div class=\"page-header\">\n<h1>Ana Navigasyon</h1>\n<p>\u00c7ocu\u011funuzun geli\u015fiminin farkl\u0131 y\u00f6nlerine ve oyun hakk\u0131ndaki bilgilere buradan kolayca eri\u015febilirsiniz.</p>\n</div>\n<div class=\"nav-grid\">\n<a class=\"nav-card\" href=\"/panel/oyun-suresi\">\n<div class=\"icon-box c-blue\"><i class=\"fa-solid fa-gamepad\"></i></div>\n<h3>Oyun S\u00fcresi ve Etkile\u015fim</h3>\n</a>\n<a class=\"nav-card\" href=\"/panel/yetenek\">\n<div class=\"icon-box c-green\"><i class=\"fa-solid fa-arrow-trend-up\"></i></div>\n<h3>Yetenek Geli\u015fimi</h3>\n</a>\n<a class=\"nav-card\" href=\"/panel/meslek-rehberi\">\n<div class=\"icon-box c-orange\"><i class=\"fa-solid fa-briefcase\"></i></div>\n<h3>Kariyer Yolu</h3>\n</a>\n<a class=\"nav-card\" href=\"/panel/meslek-rehberi\">\n<div class=\"icon-box c-yellow\"><i class=\"fa-solid fa-medal\"></i></div>\n<h3>Meslek Rehberi</h3>\n</a>\n<a class=\"nav-card\" href=\"/panel/basarilar\">\n<div class=\"icon-box c-yellow\"><i class=\"fa-solid fa-medal\"></i></div>\n<h3>Ba\u015far\u0131lar</h3>\n</a>\n<a class=\"nav-card\" href=\"/panel/ilgi-alanlari\">\n<div class=\"icon-box c-blue\"><i class=\"fa-regular fa-lightbulb\"></i></div>\n<h3>\u0130lgi Alanlar\u0131</h3>\n</a>\n<a class=\"nav-card\" href=\"/panel/gelisim-agaci\">\n<div class=\"icon-box c-green\"><i class=\"fa-solid fa-tree\"></i></div>\n<h3>Geli\u015fim A\u011fac\u0131</h3>\n</a>\n<a class=\"nav-card\" href=\"#\">\n<div class=\"icon-box c-orange\"><i class=\"fa-solid fa-circle-info\"></i></div>\n<h3>Oyun Hakk\u0131nda Bilgiler</h3>\n</a>\n<a class=\"nav-card\" href=\"#\">\n<div class=\"icon-box c-yellow\"><i class=\"fa-regular fa-circle-question\"></i></div>\n<h3>Yard\u0131m Paneli</h3>\n</a>\n</div>\n</div>\n<footer class=\"footer\">\n        \u00a9 2025 \u00c7ocuk Geli\u015fim Platformu - Veli Paneli. T\u00fcm haklar\u0131 sakl\u0131d\u0131r.\n    </footer>\n\n\n";



function PanelNavigasyon() {

  return <div dangerouslySetInnerHTML={{ __html: html }} />

}



export default PanelNavigasyon


let accessibilityTextScale = 1;
// =========================================================
// MEDIA SOSIAL FOOTER
// =========================================================

const FOOTER_SOCIAL = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/p/Kemenag-Banten-100067774616570/"
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/kemenag_banten_official/"
  },
  {
    platform: "X",
    url: "https://www.x.com/kemenag_banten_official/"
  },
  {
    platform: "TikTok",
    url: "https://www.tiktok.com/@kemenag.banten.of/"
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/@kemenagbantenofficial890"
  }
];
const textSelectors = [
  /* =========================
     UMUM / BERANDA
     ========================= */
  ".section-label",
  ".section-heading h2",
  ".section-heading p",
  ".section-heading a",

  ".layanan-heading-kicker",
  ".layanan-utama-heading h2",
  ".layanan-label",
  ".layanan-content h3",
  ".layanan-content p",
  ".layanan-card-footer",

  ".maklumat-label",
  ".maklumat-content p",

  ".news-content h3",
  ".news-date",
  ".news-content p",

  ".card-badge",
  ".akses-cepat-text strong",

  ".statistik-home-card",
  ".statistik-home-card h3",

  /* =========================
     PROFIL PPID
     ========================= */
  ".profile-card h3",
  ".profile-card p",

  ".vm-card h3",
  ".vm-card p",
  ".vm-card li",

  ".org-item h3",
  ".org-item p",

  ".task-item h3",
  ".task-item p",

  ".legal-card h3",
  ".legal-list li",

  ".contact-card h3",
  ".contact-label",
  ".contact-value",

  /* =========================
     KOMPONEN LAIN
     ========================= */
  ".inner-hero-kicker",
  ".inner-hero-text h1",
  ".inner-hero-text p",

  ".footer",
  ".footer-bottom"
];

document.addEventListener("DOMContentLoaded", async function () {
  // =========================================================
  // LOAD GLOBAL ACCESSIBILITY CSS
  // =========================================================

  if (!document.getElementById("globalAccessibilityCSS")) {

    const accessibilityCSS =
      document.createElement("link");

    accessibilityCSS.id =
      "globalAccessibilityCSS";

    accessibilityCSS.rel =
      "stylesheet";

    accessibilityCSS.href =
      "assets/css/accessibility.css";

    document.head.appendChild(
      accessibilityCSS
    );

  }


  // =========================================================
  // LOAD FOOTER CSS
  // =========================================================

  if (!document.getElementById("footerCSS")) {

    const footerCSS =
      document.createElement("link");

    footerCSS.id =
      "footerCSS";

    footerCSS.rel =
      "stylesheet";

    footerCSS.href =
      "components/footer.css";

    document.head.appendChild(
      footerCSS
    );

  }


  async function loadComponent(selector, file) {
    
    const target = document.querySelector(selector);

    if (!target) return;

    try {
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(
          `Gagal memuat ${file}: ${response.status}`
        );
      }

      target.innerHTML = await response.text();

    } catch (error) {
      console.error(
        `Gagal memuat komponen ${file}:`,
        error
      );
    }
  }

// =========================================================
// LOAD SHARED COMPONENTS
// =========================================================

await loadComponent("#siteNavbar", "components/navbar.html");
await loadComponent("#innerHero", "components/inner-hero.html");
await loadComponent("#accessibility", "components/accessibility.html");
await loadComponent("#siteFooter", "components/footer.html");

setFooterSocial();

setActiveNavigation();
setInnerHero();
initAccessibility();
initNavbarSearch();
initMobileNavigation();

document.dispatchEvent(new CustomEvent("layout:loaded"));
 
});


// =========================================================
// ACTIVE NAVIGATION
// =========================================================

function setActiveNavigation() {

  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase() || "index.html";


  const navLinks =
    document.querySelectorAll(
      "#mainNav a.nav-link"
    );


  navLinks.forEach(function (link) {

    const href =
      link.getAttribute("href");

    if (!href) return;

    if (
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
    ) {
      return;
    }


    const linkPage =
      href
        .split("/")
        .pop()
        .split("#")[0]
        .toLowerCase();


    link.classList.remove("active");


    if (linkPage === currentPage) {
      link.classList.add("active");
    }

  });

}


// =========================================================
// INNER HERO
// =========================================================

function setInnerHero() {

  const hero =
    document.querySelector("#innerHero");

  if (!hero) return;


  const kicker =
    document.body.dataset.heroKicker || "";

  const title =
    document.body.dataset.heroTitle || "";

  const description =
    document.body.dataset.heroDescription || "";


  const kickerElement =
    document.getElementById("innerHeroKicker");

  const titleElement =
    document.getElementById("innerHeroTitle");

  const descriptionElement =
    document.getElementById(
      "innerHeroDescription"
    );


  if (kickerElement && kicker) {
    kickerElement.textContent = kicker;
  }

  if (titleElement && title) {
    titleElement.textContent = title;
  }

  if (descriptionElement && description) {
    descriptionElement.textContent = description;
  }

}

// =========================================================
// TAMPILKAN MEDIA SOSIAL FOOTER
// =========================================================

function setFooterSocial() {

  const socialContainer =
    document.getElementById("footerSocial");

  if (!socialContainer) return;

  socialContainer.innerHTML = "";

  FOOTER_SOCIAL.forEach(function (item) {

    let icon = "";

    if (item.platform === "Facebook") {
      icon = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1z"/>
        </svg>
      `;
    }

    if (item.platform === "Instagram") {
  icon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        cx="17.5"
        cy="6.5"
        r="1.2"
        fill="currentColor"
      />
    </svg>
  `;
}

    if (item.platform === "X") {
      icon = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h4.2l3.1 4.3L16.2 4H19l-5.4 6.2L20 20h-4.2l-3.6-5-4.3 5H5l5.7-6.8L5 4zm3.4 2 7.9 12h1.8L10.2 6H8.4z"/>
        </svg>
      `;
    }

    if (item.platform === "TikTok") {
      icon = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 3c.3 2.2 1.5 3.7 3.8 4.1v3.1c-1.4-.1-2.7-.5-3.8-1.2v6.1c0 3.8-2.4 5.9-5.5 5.9-3 0-5.5-2.2-5.5-5.3 0-3.2 2.5-5.4 5.8-5.4.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.4 0-2.5.9-2.5 2.3 0 1.3 1 2.2 2.2 2.2 1.4 0 2.3-.8 2.3-2.5V3H15z"/>
        </svg>
      `;
    }

    if (item.platform === "YouTube") {
      icon = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.8V8.2l6.3 3.8-6.3 3.8z"/>
        </svg>
      `;
    }

    const link = document.createElement("a");

    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = item.platform;
    link.setAttribute(
      "aria-label",
      "Kunjungi " + item.platform
    );

    link.innerHTML = icon;

    socialContainer.appendChild(link);

  });

}

// =========================================================
// ACCESSIBILITY
// =========================================================

function initAccessibility() {

  const toggle =
    document.getElementById(
      "aksesibilitasToggle"
    );

  const panel =
    document.getElementById(
      "aksesibilitasPanel"
    );

  const close =
    document.getElementById(
      "aksesibilitasClose"
    );


  if (!toggle || !panel) {
    return;
  }


  // ---------------------------------------------------------
  // TOGGLE PANEL
  // ---------------------------------------------------------

  toggle.addEventListener(
    "click",
    function () {

      const isOpen =
        panel.classList.toggle("active");


      toggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      panel.setAttribute(
        "aria-hidden",
        isOpen ? "false" : "true"
      );

    }
  );


  // ---------------------------------------------------------
  // CLOSE PANEL
  // ---------------------------------------------------------

  if (close) {

    close.addEventListener(
      "click",
      function () {

        panel.classList.remove("active");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        panel.setAttribute(
          "aria-hidden",
          "true"
        );

      }
    );

  }


  // ---------------------------------------------------------
  // ACCESSIBILITY BUTTONS
  // ---------------------------------------------------------

  const accessibilityButtons =
    document.querySelectorAll(
      "[data-accessibility]"
    );


  accessibilityButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const action =
            this.dataset.accessibility;


          // =================================================
          // PERBESAR TEKS
          // =================================================

          if (action === "font-plus") {

            accessibilityTextScale =
              Math.min(
                1.3,
                accessibilityTextScale + 0.1
              );

            applyTextScale();

          }


          // =================================================
          // PERKECIL TEKS
          // =================================================

          if (action === "font-minus") {

            accessibilityTextScale =
              Math.max(
                0.8,
                accessibilityTextScale - 0.1
              );

            applyTextScale();

          }


          // =================================================
          // KONTRAS TINGGI
          // =================================================

          if (action === "contrast") {
  document.documentElement.classList.toggle("accessibility-high-contrast");
}


          // =================================================
          // KURANGI ANIMASI
          // =================================================

          if (action === "motion") {

            document.body.classList.toggle(
              "accessibility-reduced-motion"
            );

          }

          // =================================================
          // RESET
          // =================================================

          if (action === "reset") {

            accessibilityTextScale = 1;

            resetTextScale();

            document.documentElement.classList.remove("accessibility-high-contrast");
            document.body.classList.remove(
              "accessibility-reduced-motion"
            );

          }

        }
      );

    }
  );

}


// =========================================================
// APPLY TEXT SCALE
// =========================================================

function applyTextScale() {

  const elements =
    document.querySelectorAll(
      textSelectors.join(",")
    );


  elements.forEach(function (element) {

    if (!element.dataset.accessibilityBaseSize) {

      const computedStyle =
        window.getComputedStyle(element);

      const baseSize =
        parseFloat(
          computedStyle.fontSize
        );


      if (!isNaN(baseSize)) {

        element.dataset.accessibilityBaseSize =
          baseSize;

      }

    }


    const baseSize =
      parseFloat(
        element.dataset.accessibilityBaseSize
      );


    if (!isNaN(baseSize)) {

      element.style.fontSize =
        (baseSize * accessibilityTextScale) +
        "px";

    }

  });

}


// =========================================================
// RESET TEXT SCALE
// =========================================================

function resetTextScale() {

  const elements =
    document.querySelectorAll(
      "[data-accessibility-base-size]"
    );


  elements.forEach(function (element) {

    const baseSize =
      parseFloat(
        element.dataset.accessibilityBaseSize
      );


    if (!isNaN(baseSize)) {

      element.style.fontSize =
        baseSize + "px";

    }

  });

}


// =========================================================
// NAVBAR SEARCH
// =========================================================

function initNavbarSearch() {

  const searchButton =
    document.getElementById(
      "navbarSearchButton"
    );

  if (!searchButton) {
    return;
  }

  searchButton.addEventListener(
    "click",
    function () {

      const currentPage =
        window.location.pathname
          .split("/")
          .pop()
          .toLowerCase() || "index.html";


      // =====================================================
      // BERANDA
      // =====================================================

      if (currentPage === "index.html") {

        const searchInput =
          document.getElementById(
            "searchInput"
          );

        if (searchInput) {

          searchInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

          setTimeout(
            function () {

              searchInput.focus();

            },
            400
          );

        }

        return;

      }


      // =====================================================
      // HALAMAN LAIN
      // =====================================================

      window.location.href =
        "index.html#beranda";

    }
  );

}


// =========================================================
// MOBILE NAVIGATION
// Sesuai struktur MASTER navbar.html
// =========================================================

function initMobileNavigation() {

  const toggle =
    document.getElementById("mobileMenuToggle");

  const mainNav =
    document.getElementById("mainNav");

  if (!toggle || !mainNav) {
    return;
  }

  const isMobile =
    () => window.innerWidth <= 900;


  // =======================================================
  // TUTUP SEMUA DROPDOWN
  // =======================================================

  function closeAllDropdowns() {

    mainNav
      .querySelectorAll(".nav-dropdown.mobile-open")
      .forEach(function (item) {

        item.classList.remove("mobile-open");

        const button =
          item.querySelector(
            ":scope > .nav-dropdown-button"
          );

        if (button) {
          button.setAttribute(
            "aria-expanded",
            "false"
          );
        }

      });

  }


  // =======================================================
  // TUTUP MENU MOBILE
  // =======================================================

  function closeMobileMenu() {

    mainNav.classList.remove(
      "mobile-open"
    );

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.setAttribute(
      "aria-label",
      "Buka menu"
    );

    closeAllDropdowns();

  }


  // =======================================================
  // TOMBOL HAMBURGER
  // =======================================================

  toggle.addEventListener(
    "click",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      if (!isMobile()) {
        return;
      }

      const isOpen =
        mainNav.classList.toggle(
          "mobile-open"
        );

      toggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      toggle.setAttribute(
        "aria-label",
        isOpen
          ? "Tutup menu"
          : "Buka menu"
      );

    }
  );


  // =======================================================
  // DROPDOWN MOBILE
  // =======================================================

  mainNav
    .querySelectorAll(
      ".nav-dropdown"
    )
    .forEach(
      function (item) {

        const button =
          item.querySelector(
            ":scope > .nav-dropdown-button"
          );

        const dropdown =
          item.querySelector(
            ":scope > .dropdown-menu"
          );

        if (!button || !dropdown) {
          return;
        }


        button.addEventListener(
          "click",
          function (event) {

            if (!isMobile()) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();


            const isOpen =
              item.classList.contains(
                "mobile-open"
              );


            // Tutup dropdown lainnya
            mainNav
              .querySelectorAll(
                ".nav-dropdown.mobile-open"
              )
              .forEach(
                function (otherItem) {

                  if (otherItem !== item) {

                    otherItem.classList.remove(
                      "mobile-open"
                    );

                    const otherButton =
                      otherItem.querySelector(
                        ":scope > .nav-dropdown-button"
                      );

                    if (otherButton) {

                      otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                      );

                    }

                  }

                }
              );


            // Toggle dropdown yang diklik
            if (isOpen) {

              item.classList.remove(
                "mobile-open"
              );

              button.setAttribute(
                "aria-expanded",
                "false"
              );

            } else {

              item.classList.add(
                "mobile-open"
              );

              button.setAttribute(
                "aria-expanded",
                "true"
              );

            }

          }
        );

      }
    );


  // =======================================================
  // KLIK LINK SUBMENU
  // Biarkan navigasi berjalan normal
  // =======================================================

  mainNav
    .querySelectorAll(
      ".dropdown-menu a"
    )
    .forEach(
      function (link) {

        link.addEventListener(
          "click",
          function () {

            closeMobileMenu();

          }
        );

      }
    );


  // =======================================================
  // KLIK DI LUAR MENU
  // =======================================================

  document.addEventListener(
    "click",
    function (event) {

      if (!isMobile()) {
        return;
      }

      if (
        !mainNav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {

        closeMobileMenu();

      }

    }
  );


  // =======================================================
  // TOMBOL ESC
  // =======================================================

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        isMobile()
      ) {

        closeMobileMenu();

      }

    }
  );


  // =======================================================
  // KEMBALI KE DESKTOP
  // =======================================================

  window.addEventListener(
    "resize",
    function () {

      if (!isMobile()) {

        closeMobileMenu();

      }

    }
  );

}

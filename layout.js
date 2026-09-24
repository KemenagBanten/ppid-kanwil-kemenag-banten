let accessibilityTextScale = 1;

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

  await loadComponent(
    "#siteNavbar",
    "components/navbar.html"
  );

  await loadComponent(
    "#innerHero",
    "components/inner-hero.html"
  );

  await loadComponent(
    "#accessibility",
    "components/accessibility.html"
  );

  await loadComponent(
    "#siteFooter",
    "components/footer.html"
  );


  // =========================================================
  // INITIALIZE SHARED FEATURES
  // =========================================================

  setActiveNavigation();
  setInnerHero();
  initAccessibility();
  initNavbarSearch();


  document.dispatchEvent(
    new CustomEvent("layout:loaded")
  );

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

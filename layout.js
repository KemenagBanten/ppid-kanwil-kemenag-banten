document.addEventListener("DOMContentLoaded", async function () {

  /*
   * =========================================================
   * LOAD COMPONENT
   * =========================================================
   */

  async function loadComponent(selector, file) {

    const target = document.querySelector(selector);

    if (!target) {
      return;
    }

    try {

      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(
          `Gagal memuat ${file}: ${response.status}`
        );
      }

      const html = await response.text();

      target.innerHTML = html;

    } catch (error) {

      console.error(
        `Gagal memuat komponen ${file}:`,
        error
      );

    }

  }


  /*
   * =========================================================
   * LOAD NAVBAR
   * =========================================================
   */

  await loadComponent(
    "#siteNavbar",
    "components/navbar.html"
  );


  /*
   * =========================================================
   * LOAD INNER HERO
   * =========================================================
   *
   * Hanya halaman dalam yang menggunakan inner hero.
   * Index tidak menggunakan komponen ini.
   */

  await loadComponent(
    "#innerHero",
    "components/inner-hero.html"
  );


  /*
   * =========================================================
   * LOAD ACCESSIBILITY
   * =========================================================
   */

  await loadComponent(
    "#accessibility",
    "components/accessibility.html"
  );


  /*
   * =========================================================
   * LOAD FOOTER
   * =========================================================
   */

  await loadComponent(
    "#siteFooter",
    "components/footer.html"
  );


  /*
   * =========================================================
   * SET ACTIVE NAVIGATION
   * =========================================================
   */

  setActiveNavigation();


  /*
   * =========================================================
   * SET INNER HERO TEXT
   * =========================================================
   */

  setInnerHero();


  /*
   * =========================================================
   * INITIALIZE ACCESSIBILITY
   * =========================================================
   *
   * Dipanggil setelah accessibility.html selesai dimuat.
   */

  initAccessibility();

initNavbarSearch();
  /*
   * =========================================================
   * BERITAHU SCRIPT LAIN
   * BAHWA LAYOUT SUDAH SELESAI DIMUAT
   * =========================================================
   */

  document.dispatchEvent(
    new CustomEvent("layout:loaded")
  );

});



/*
 * =========================================================
 * ACTIVE NAVIGATION
 * =========================================================
 */

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

    if (!href) {
      return;
    }


    /*
     * Abaikan link eksternal
     */

    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#")
    ) {
      return;
    }


    /*
     * Hapus active dari semua link
     */

    link.classList.remove("active");


    /*
     * Cek halaman saat ini
     */

    const linkPage =
      href.split("/").pop().toLowerCase();


    if (linkPage === currentPage) {
      link.classList.add("active");
    }

  });

}



/*
 * =========================================================
 * INNER HERO
 * =========================================================
 */

function setInnerHero() {

  const hero =
    document.querySelector("#innerHero");


  /*
   * Kalau halaman tidak menggunakan inner hero,
   * hentikan fungsi.
   */

  if (!hero) {
    return;
  }


  const body =
    document.body;


  const kicker =
    body.dataset.heroKicker || "";


  const title =
    body.dataset.heroTitle || "";


  const description =
    body.dataset.heroDescription || "";


  const kickerElement =
    document.getElementById(
      "innerHeroKicker"
    );


  const titleElement =
    document.getElementById(
      "innerHeroTitle"
    );


  const descriptionElement =
    document.getElementById(
      "innerHeroDescription"
    );


  if (kickerElement) {
    kickerElement.textContent = kicker;
  }


  if (titleElement) {
    titleElement.textContent = title;
  }


  if (descriptionElement) {
    descriptionElement.textContent =
      description;
  }

}



/*
 * =========================================================
 * AKSESIBILITAS
 * =========================================================
 */

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

    console.warn(
      "Komponen aksesibilitas belum ditemukan."
    );

    return;
  }

function initNavbarSearch() {
  const searchButton = document.getElementById("navbarSearchButton");

  if (!searchButton) return;

  searchButton.addEventListener("click", function () {
    const currentPage =
      window.location.pathname.split("/").pop().toLowerCase() || "index.html";

    if (currentPage === "index.html") {
      const searchInput = document.getElementById("searchInput");

      if (searchInput) {
        searchInput.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        setTimeout(function () {
          searchInput.focus();
          searchInput.click();
        }, 400);
      }

      return;
    }

    window.location.href = "index.html#beranda";
  });
}
  /*
   * ---------------------------------------------------------
   * UKURAN TEKS
   * ---------------------------------------------------------
   */

  let accessibilityTextScale = 1;


  const textSelectors = [

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

    ".footer",
    ".footer-bottom"

  ];


  function updateAccessibilityText() {

    textSelectors.forEach(function (selector) {

      document
        .querySelectorAll(selector)
        .forEach(function (element) {

          if (!element.dataset.originalFontSize) {

            const currentSize =
              parseFloat(
                window.getComputedStyle(
                  element
                ).fontSize
              );


            if (!isNaN(currentSize)) {

              element.dataset.originalFontSize =
                currentSize;

            }

          }


          const originalSize =
            parseFloat(
              element.dataset.originalFontSize
            );


          if (!isNaN(originalSize)) {

            element.style.fontSize =
              (
                originalSize *
                accessibilityTextScale
              ) + "px";

          }

        });

    });

  }


  /*
   * ---------------------------------------------------------
   * PERBESAR TEKS
   * ---------------------------------------------------------
   */

  const fontPlusButton =
    document.querySelector(
      '[data-accessibility="font-plus"]'
    );


  if (fontPlusButton) {

    fontPlusButton.addEventListener(
      "click",
      function () {

        if (
          accessibilityTextScale >= 1.3
        ) {
          return;
        }


        accessibilityTextScale += 0.1;


        updateAccessibilityText();

      }
    );

  }


  /*
   * ---------------------------------------------------------
   * PERKECIL TEKS
   * ---------------------------------------------------------
   */

  const fontMinusButton =
    document.querySelector(
      '[data-accessibility="font-minus"]'
    );


  if (fontMinusButton) {

    fontMinusButton.addEventListener(
      "click",
      function () {

        if (
          accessibilityTextScale <= 0.8
        ) {
          return;
        }


        accessibilityTextScale -= 0.1;


        updateAccessibilityText();

      }
    );

  }


  /*
   * ---------------------------------------------------------
   * KONTRAS TINGGI
   * ---------------------------------------------------------
   */

  const contrastButton =
    document.querySelector(
      '[data-accessibility="contrast"]'
    );


  if (contrastButton) {

    contrastButton.addEventListener(
      "click",
      function () {

        document.body.classList.toggle(
          "accessibility-high-contrast"
        );

      }
    );

  }


  /*
   * ---------------------------------------------------------
   * KURANGI ANIMASI
   * ---------------------------------------------------------
   */

  const motionButton =
    document.querySelector(
      '[data-accessibility="motion"]'
    );


  if (motionButton) {

    motionButton.addEventListener(
      "click",
      function () {

        document.body.classList.toggle(
          "accessibility-reduced-motion"
        );

      }
    );

  }


  /*
   * ---------------------------------------------------------
   * RESET
   * ---------------------------------------------------------
   */

  const resetButton =
    document.querySelector(
      '[data-accessibility="reset"]'
    );


  if (resetButton) {

    resetButton.addEventListener(
      "click",
      function () {

        accessibilityTextScale = 1;


        updateAccessibilityText();


        document.body.classList.remove(
          "accessibility-high-contrast"
        );


        document.body.classList.remove(
          "accessibility-reduced-motion"
        );

      }
    );

  }


  /*
   * ---------------------------------------------------------
   * BUKA PANEL
   * ---------------------------------------------------------
   */

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


  /*
   * ---------------------------------------------------------
   * TUTUP PANEL
   * ---------------------------------------------------------
   */

  if (close) {

    close.addEventListener(
      "click",
      function () {

        panel.classList.remove(
          "active"
        );


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

}

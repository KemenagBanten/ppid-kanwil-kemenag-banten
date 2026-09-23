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
   * Inner hero hanya digunakan oleh halaman dalam.
   * Index tidak perlu menggunakan komponen ini.
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

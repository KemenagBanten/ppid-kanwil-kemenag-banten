const API_URL =
  "https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec";


// =====================================================
// HELPER
// =====================================================

async function fetchAPI(action) {
  const url = `${API_URL}?action=${encodeURIComponent(action)}`;

  console.log("Mengambil data:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`);
  }

  const result = await response.json();

  console.log(`Response ${action}:`, result);

  if (!result.success) {
    throw new Error(result.message || `API ${action} gagal`);
  }

  return result.data;
}


// =====================================================
// INFORMASI PUBLIK
// =====================================================

async function loadInformasi() {
  const container = document.getElementById("informasiList");
  const counter = document.getElementById("totalInformasi");

  try {
    const data = await fetchAPI("informasi");

    console.log("Data Informasi Publik:", data);

    if (counter) {
      counter.textContent = data.length;
    }

    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          Belum ada informasi publik.
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(item => `
      <div class="information-card">

        <div class="card-badge">
          ${escapeHTML(item.jenis || "Informasi")}
        </div>

        <h3>${escapeHTML(item.judul || "-")}</h3>

        <p>
          ${escapeHTML(item.ringkasan || "-")}
        </p>

        <div class="card-meta">
          <span>${escapeHTML(item.kategori || "-")}</span>
          <span>${escapeHTML(item.tahun || "-")}</span>
        </div>

        ${
          item.url_dokumen
            ? `
              <a
                href="${escapeAttribute(item.url_dokumen)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-document"
              >
                Lihat Dokumen
              </a>
            `
            : `
              <span class="document-unavailable">
                Dokumen belum tersedia
              </span>
            `
        }

      </div>
    `).join("");

  } catch (error) {

    console.error("loadInformasi error:", error);

    if (container) {
      container.innerHTML = `
        <div class="error-state">
          Gagal memuat Informasi Publik.
        </div>
      `;
    }
  }
}


// =====================================================
// DIP
// =====================================================

async function loadDIP() {
  const container = document.getElementById("dipList");
  const counter = document.getElementById("totalDIP");

  try {
    const data = await fetchAPI("dip");

    console.log("Data DIP:", data);

    if (counter) {
      counter.textContent = data.length;
    }

    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          Belum ada Daftar Informasi Publik.
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(item => `
      <div class="dip-card">

        <div class="dip-number">
          ${escapeHTML(item.nomor || "-")}
        </div>

        <div class="dip-content">

          <div class="card-badge">
            ${escapeHTML(item.jenis_informasi || "Informasi")}
          </div>

          <h3>
            ${escapeHTML(item.nama_informasi || "-")}
          </h3>

          <p>
            ${escapeHTML(item.ringkasan || "-")}
          </p>

          <div class="card-meta">
            <span>${escapeHTML(item.kategori || "-")}</span>
            <span>${escapeHTML(item.tahun || "-")}</span>
          </div>

          ${
            item.url_dokumen
              ? `
                <a
                  href="${escapeAttribute(item.url_dokumen)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-document"
                >
                  Lihat Dokumen
                </a>
              `
              : `
                <span class="document-unavailable">
                  Dokumen belum tersedia
                </span>
              `
          }

        </div>

      </div>
    `).join("");

  } catch (error) {

    console.error("loadDIP error:", error);

    if (container) {
      container.innerHTML = `
        <div class="error-state">
          Gagal memuat DIP.
        </div>
      `;
    }
  }
}


// =====================================================
// BERITA
// =====================================================

async function loadBerita() {
  const container = document.getElementById("beritaList");
  const counter = document.getElementById("totalBerita");

  try {
    const data = await fetchAPI("berita");

    console.log("Data Berita:", data);

    // Hanya berita Published
    const beritaValid = Array.isArray(data)
      ? data
          .filter(item =>
            item &&
            item.judul &&
            String(item.judul).trim() !== "" &&
            String(item.status || "").toLowerCase() === "published"
          )
          .sort((a, b) => {
            return new Date(b.tanggal || 0) - new Date(a.tanggal || 0);
          })
      : [];

    if (counter) {
      counter.textContent = beritaValid.length;
    }

    if (!container) return;

    if (beritaValid.length === 0) {
  container.innerHTML = `
    <div class="berita-external">

      <div class="berita-external-inner">

        <div class="berita-external-label">
          <span>●</span>
          Berita Resmi
        </div>

        <h3>
          Berita &amp; Kegiatan Kemenag Banten
        </h3>

        <p>
          Ikuti informasi, kegiatan, dan berita terbaru
          Kantor Wilayah Kementerian Agama Provinsi Banten
          melalui website resmi Kemenag Banten.
        </p>

        <a
          href="https://banten.kemenag.go.id/publikasi/berita/kanwil"
          target="_blank"
          rel="noopener noreferrer"
          class="berita-external-button"
        >
          Baca Berita Kemenag Banten
          <span>↗</span>
        </a>

      </div>

    </div>
  `;

  return;
}

    // Maksimal 3 berita terbaru
    const beritaTerbaru = beritaValid.slice(0, 3);

    container.innerHTML = beritaTerbaru.map(item => {

      const imageUrl = item.gambar_url
        ? String(item.gambar_url).trim()
        : "";

      console.log("URL gambar berita:", imageUrl);

      return `
        <article class="news-card">

          ${
            imageUrl
              ? `
                <div class="news-image-wrapper">
                  <img
                    src="${escapeAttribute(imageUrl)}"
                    alt="${escapeAttribute(item.judul || "Berita")}"
                    class="news-image"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    onload="this.parentElement.classList.add('image-loaded');"
                    onerror="
                      this.style.display='none';
                      this.parentElement.querySelector('.news-placeholder').style.display='flex';
                    "
                  >

                  <div class="news-placeholder">
                    PPID Kemenag Banten
                  </div>
                </div>
              `
              : `
                <div class="news-image-wrapper">
                  <div class="news-placeholder">
                    PPID Kemenag Banten
                  </div>
                </div>
              `
          }

          <div class="news-content">

            ${
              item.kategori
                ? `
                  <div class="card-badge">
                    ${escapeHTML(item.kategori)}
                  </div>
                `
                : ""
            }

            <h3>
              ${escapeHTML(item.judul)}
            </h3>

            ${
              item.tanggal
                ? `
                  <div class="news-date">
                    ${formatDate(item.tanggal)}
                  </div>
                `
                : ""
            }

            ${
              item.isi
                ? `
                  <p>
                    ${escapeHTML(item.isi)}
                  </p>
                `
                : ""
            }

          </div>

        </article>
      `;
    }).join("");

  } catch (error) {

    console.error("loadBerita error:", error);

    if (container) {
      container.innerHTML = `
        <div class="error-state">
          Gagal memuat berita.
        </div>
      `;
    }
  }
}

// =====================================================
// DASHBOARD / STATISTIK
// =====================================================

async function loadDashboard() {

  try {

    const data = await fetchAPI("dashboard");

    console.log("Dashboard:", data);

    const database = document.getElementById("databaseName");
    const jumlahSheet = document.getElementById("jumlahSheet");

    if (database) {
      database.textContent =
        data.namaDatabase || "-";
    }

    if (jumlahSheet) {
      jumlahSheet.textContent =
        data.jumlahSheet ?? "-";
    }

  } catch (error) {

    console.error("loadDashboard error:", error);

  }
}


// =====================================================
// PENCARIAN
// =====================================================

async function searchInformation() {

  const input = document.getElementById("searchInput");

  if (!input) return;

  const keyword =
    input.value.trim().toLowerCase();

  if (!keyword) {
    loadInformasi();
    return;
  }

  try {

    const data = await fetchAPI("informasi");

    const hasil = data.filter(item => {

      const text = `
        ${item.judul || ""}
        ${item.ringkasan || ""}
        ${item.kategori || ""}
        ${item.jenis || ""}
      `.toLowerCase();

      return text.includes(keyword);

    });

    const container =
      document.getElementById("informasiList");

    if (!container) return;

    if (hasil.length === 0) {

      container.innerHTML = `
        <div class="empty-state">
          Tidak ditemukan informasi dengan kata
          "<strong>${escapeHTML(keyword)}</strong>".
        </div>
      `;

      return;
    }

    container.innerHTML = hasil.map(item => `

      <div class="information-card">

        <div class="card-badge">
          ${escapeHTML(item.jenis || "Informasi")}
        </div>

        <h3>
          ${escapeHTML(item.judul || "-")}
        </h3>

        <p>
          ${escapeHTML(item.ringkasan || "-")}
        </p>

        <div class="card-meta">
          <span>${escapeHTML(item.kategori || "-")}</span>
          <span>${escapeHTML(item.tahun || "-")}</span>
        </div>

        ${
          item.url_dokumen
            ? `
              <a
                href="${escapeAttribute(item.url_dokumen)}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-document"
              >
                Lihat Dokumen
              </a>
            `
            : `
              <span class="document-unavailable">
                Dokumen belum tersedia
              </span>
            `
        }

      </div>

    `).join("");

  } catch (error) {

    console.error("searchInformation error:", error);

  }
}


// =====================================================
// UTILITY
// =====================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

  return escapeHTML(value);

}


function formatDate(value) {

  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return escapeHTML(value);
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

}


// =====================================================
// INITIALIZE WEBSITE
// =====================================================

async function initWebsite() {

  console.log("=================================");
  console.log("PPID KANWIL KEMENAG BANTEN");
  console.log("Memulai website...");
  console.log("API:", API_URL);
  console.log("=================================");

  await Promise.allSettled([
  loadInformasi(),
  loadDIP(),
  loadBerita(),
  loadDashboard(),
  loadHomepageStatistik()
]);

  console.log("Semua proses loading selesai.");

}


// =====================================================
// JALANKAN SAAT HALAMAN SELESAI
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  initWebsite
);

/* =====================================================
   STATISTIK HOMEPAGE
===================================================== */

async function loadHomepageStatistik() {

  try {

    const data = await fetchAPI("statistik");

    console.log("Statistik Homepage:", data);

    if (!data) return;


    /* ================================
       STATISTIK PERMOHONAN
    ================================= */

    if (data.permohonan) {

      const total = document.getElementById("homeTotalPermohonan");
      const diterima = document.getElementById("homePermohonanDiterima");
      const proses = document.getElementById("homePermohonanProses");
      const selesai = document.getElementById("homePermohonanSelesai");

      if (total) {
        total.textContent = data.permohonan.total ?? 0;
      }

      if (diterima) {
        diterima.textContent = data.permohonan.diterima ?? 0;
      }

      if (proses) {
        proses.textContent = data.permohonan.dalamProses ?? 0;
      }

      if (selesai) {
        selesai.textContent = data.permohonan.selesai ?? 0;
      }

    }

  } catch (error) {

    console.error(
      "Gagal memuat statistik homepage:",
      error
    );

  }

}

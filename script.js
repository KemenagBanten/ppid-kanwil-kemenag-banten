const API_URL =
  'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';


/* =====================================================
   API HELPER
===================================================== */

async function fetchAPI(action) {

  const response =
    await fetch(
      `${API_URL}?action=${action}`
    );

  if (!response.ok) {

    throw new Error(
      `HTTP Error ${response.status}`
    );

  }

  const result =
    await response.json();

  if (!result.success) {

    throw new Error(
      result.message ||
      'API mengembalikan error'
    );

  }

  return result.data;

}


/* =====================================================
   INFORMASI PUBLIK
===================================================== */

async function loadInformasi() {

  const container =
    document.getElementById(
      'informasiList'
    );

  try {

    const data =
      await fetchAPI('informasi');


    document.getElementById(
      'totalInformasi'
    ).textContent = data.length;


    if (!data.length) {

      container.innerHTML =
        '<div class="loading">Belum ada informasi.</div>';

      return;

    }


    container.innerHTML =
      data.map(function(item) {

        return `

          <article class="info-card">

            <span class="badge">
              ${item.jenis || 'Informasi'}
            </span>

            <h3>
              ${item.judul || '-'}
            </h3>

            <p>
              ${item.ringkasan || '-'}
            </p>

            <div class="card-meta">
              ${item.kategori || '-'}
              •
              ${item.tahun || '-'}
            </div>

            ${
              item.url_dokumen
                ? `
                  <a
                    class="document-button"
                    href="${item.url_dokumen}"
                    target="_blank"
                    rel="noopener"
                  >
                    Lihat Dokumen →
                  </a>
                `
                : ''
            }

          </article>

        `;

      }).join('');


  } catch (error) {

    console.error(
      'Gagal memuat informasi:',
      error
    );

    container.innerHTML = `
      <div class="loading">
        Gagal memuat informasi.
      </div>
    `;

  }

}


/* =====================================================
   DIP
===================================================== */

async function loadDIP() {

  const container =
    document.getElementById(
      'dipList'
    );

  try {

    const data =
      await fetchAPI('dip');


    document.getElementById(
      'totalDIP'
    ).textContent = data.length;


    if (!data.length) {

      container.innerHTML =
        '<div class="loading">Belum ada data DIP.</div>';

      return;

    }


    container.innerHTML = `

      <table class="data-table">

        <thead>

          <tr>

            <th>No</th>

            <th>Nama Informasi</th>

            <th>Jenis</th>

            <th>Kategori</th>

            <th>Tahun</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          ${data.map(function(item) {

            return `

              <tr>

                <td>
                  ${item.nomor || '-'}
                </td>

                <td>
                  ${item.nama_informasi || '-'}
                </td>

                <td>
                  ${item.jenis_informasi || '-'}
                </td>

                <td>
                  ${item.kategori || '-'}
                </td>

                <td>
                  ${item.tahun || '-'}
                </td>

                <td>
                  ${item.status || '-'}
                </td>

              </tr>

            `;

          }).join('')}

        </tbody>

      </table>

    `;


  } catch (error) {

    console.error(
      'Gagal memuat DIP:',
      error
    );

    container.innerHTML = `
      <div class="loading">
        Gagal memuat DIP.
      </div>
    `;

  }

}


/* =====================================================
   BERITA
===================================================== */

async function loadBerita() {

  const container =
    document.getElementById(
      'beritaList'
    );

  try {

    const data =
      await fetchAPI('berita');


    document.getElementById(
      'totalBerita'
    ).textContent = data.filter(
      item => item.judul
    ).length;


    const berita =
      data.filter(
        item => item.judul
      );


    if (!berita.length) {

      container.innerHTML = `
        <div class="loading">
          Belum ada berita yang dipublikasikan.
        </div>
      `;

      return;

    }


    container.innerHTML =
      berita.map(function(item) {

        return `

          <article class="info-card">

            <span class="badge">
              ${item.kategori || 'Berita'}
            </span>

            <h3>
              ${item.judul || '-'}
            </h3>

            <p>
              ${item.isi || '-'}
            </p>

            <div class="card-meta">
              ${item.tanggal || ''}
            </div>

          </article>

        `;

      }).join('');


  } catch (error) {

    console.error(
      'Gagal memuat berita:',
      error
    );

    container.innerHTML = `
      <div class="loading">
        Gagal memuat berita.
      </div>
    `;

  }

}


/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

  try {

    const data =
      await fetchAPI('dashboard');


    document.getElementById(
      'totalSheet'
    ).textContent =
      data.jumlahSheet || 0;


  } catch (error) {

    console.error(
      'Gagal memuat dashboard:',
      error
    );

  }

}


/* =====================================================
   SEARCH
===================================================== */

function searchInformation() {

  const input =
    document.getElementById(
      'searchInput'
    );

  const keyword =
    input.value
      .trim()
      .toLowerCase();


  if (!keyword) {

    document
      .getElementById('informasi')
      .scrollIntoView({
        behavior: 'smooth'
      });

    return;

  }


  const cards =
    document.querySelectorAll(
      '#informasiList .info-card'
    );


  cards.forEach(function(card) {

    const text =
      card.textContent
        .toLowerCase();

    card.style.display =
      text.includes(keyword)
        ? ''
        : 'none';

  });


  document
    .getElementById('informasi')
    .scrollIntoView({
      behavior: 'smooth'
    });

}


/* =====================================================
   LOAD WEBSITE
===================================================== */

async function initWebsite() {

  console.log(
    'Memulai website PPID...'
  );

  console.log(
    'API URL:',
    API_URL
  );


  await Promise.all([
    loadDashboard(),
    loadInformasi(),
    loadDIP(),
    loadBerita()
  ]);


  console.log(
    'Website PPID selesai dimuat.'
  );

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  'DOMContentLoaded',
  initWebsite
);

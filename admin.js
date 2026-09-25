const API_URL =
  'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';

document.addEventListener('DOMContentLoaded', function () {

  // =========================================================
  // ELEMENT UPLOAD
  // =========================================================

  const uploadForm = document.getElementById('uploadForm');
  const uploadButton = document.getElementById('uploadButton');
  const statusBox = document.getElementById('statusBox');

  const sheetSelect = document.getElementById('sheetName');
  const idSelect = document.getElementById('idValue');
  const dataInfo = document.getElementById('dataInfo');

  const fileInput = document.getElementById('file');
  const fileLabel = document.getElementById('fileLabel');
  const fileInfo = document.getElementById('fileInfo');

  const formTitle = document.getElementById('formTitle');
  const formDescription =
    document.getElementById('formDescription');


  // =========================================================
  // HELPER
  // =========================================================

  function showStatus(message, type) {

    if (!statusBox) return;

    statusBox.textContent = message;
   statusBox.className = 'status ' + (type || '');

  }


  function showContentStatus(message, type) {

    if (!contentStatusBox) return;

    contentStatusBox.textContent = message;
    contentStatusBox.className =
  'status ' + (type || '');

  }


  function escapeHTML(value) {

    if (value === null || value === undefined) {
      return '';
    }

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  }


  function formatContentDate(value) {

  if (!value) return '-';

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

}


function formatDateForInput(value) {

  if (!value) return '';

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return String(value).substring(0, 10);
  }

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(2, '0');

  const day =
    String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;

}

  // =========================================================
  // TAMBAH KONTEN - ELEMENT
  // =========================================================

  const contentType =
    document.getElementById('contentType');

  const contentTitle =
    document.getElementById('contentTitle');

  const contentDate =
    document.getElementById('contentDate');

  const contentCategory =
    document.getElementById('contentCategory');

  const contentBody =
    document.getElementById('contentBody');

  const contentStatus =
    document.getElementById('contentStatus');

  const saveContentButton =
    document.getElementById('saveContentButton');

  const contentStatusBox =
    document.getElementById('contentStatusBox');

  const categoryGroup =
    document.getElementById('categoryGroup');

      // =========================================================
  // TAMBAH SOP - ELEMENT
  // =========================================================

  const sopForm =
    document.getElementById('sopForm');

  const sopNomor =
    document.getElementById('sopNomor');

  const sopJudul =
    document.getElementById('sopJudul');

  const sopUnit =
    document.getElementById('sopUnit');

  const sopTahun =
    document.getElementById('sopTahun');

  const sopTanggalUpdate =
    document.getElementById('sopTanggalUpdate');

  const sopFormat =
    document.getElementById('sopFormat');

  const sopStatus =
    document.getElementById('sopStatus');

  const sopKeterangan =
    document.getElementById('sopKeterangan');

  const saveSopButton =
    document.getElementById('saveSopButton');

  const sopStatusBox =
    document.getElementById('sopStatusBox');

  // =========================================================
// TAMBAH REGULASI - ELEMENT
// =========================================================

const regulasiForm =
  document.getElementById('regulasiForm');

const regulasiJudul =
  document.getElementById('regulasiJudul');

const regulasiJenis =
  document.getElementById('regulasiJenis');

const regulasiNomor =
  document.getElementById('regulasiNomor');

const regulasiTahun =
  document.getElementById('regulasiTahun');

const regulasiTentang =
  document.getElementById('regulasiTentang');

const regulasiStatus =
  document.getElementById('regulasiStatus');

const saveRegulasiButton =
  document.getElementById('saveRegulasiButton');

const regulasiStatusBox =
  document.getElementById('regulasiStatusBox');

  // =========================================================
// TAMBAH LAPORAN - ELEMENT
// =========================================================

const laporanForm =
  document.getElementById('laporanForm');

const laporanJudul =
  document.getElementById('laporanJudul');

const laporanJenis =
  document.getElementById('laporanJenis');

const laporanTahun =
  document.getElementById('laporanTahun');

const laporanForm =
  document.getElementById('laporanForm');

const laporanJudul =
  document.getElementById('laporanJudul');

const laporanJenis =
  document.getElementById('laporanJenis');

const laporanTahun =
  document.getElementById('laporanTahun');

const saveLaporanButton =
  document.getElementById('saveLaporanButton');

const laporanStatusBox =
  document.getElementById('laporanStatusBox');
  
// =========================================================
// TAMBAH SOP - SUBMIT
// =========================================================

if (sopForm) {

  sopForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      try {

        const nomor =
          sopNomor.value.trim();

        const judul =
          sopJudul.value.trim();

        const unit =
          sopUnit.value.trim();

        const tahun =
          sopTahun.value;

        const tanggal_update =
          sopTanggalUpdate.value;

        const format =
          sopFormat.value;

        const status =
          sopStatus.value;

        const keterangan =
          sopKeterangan.value.trim();


        // =====================================================
        // VALIDASI SOP
        // =====================================================

        if (!nomor) {
          throw new Error(
            'Nomor SOP wajib diisi.'
          );
        }

        if (!judul) {
          throw new Error(
            'Judul SOP wajib diisi.'
          );
        }

        if (!unit) {
          throw new Error(
            'Unit wajib diisi.'
          );
        }

        if (!tahun) {
          throw new Error(
            'Tahun wajib diisi.'
          );
        }


        // =====================================================
        // STATUS
        // =====================================================

        saveSopButton.disabled = true;

        sopStatusBox.style.display = 'block';

        sopStatusBox.className =
          'status loading';

        sopStatusBox.textContent =
          'Menyimpan SOP...';


        // =====================================================
        // PAYLOAD
        // =====================================================

        const payload = {

          action: 'tambahSOP',

          nomor: nomor,

          judul: judul,

          unit: unit,

          tahun: tahun,

          tanggal_update:
            tanggal_update,

          status: status,

          format: format,

          keterangan: keterangan

        };


        // =====================================================
        // KIRIM KE APPS SCRIPT
        // =====================================================

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        // =====================================================
        // RESPONSE
        // =====================================================

        const result =
          await response.json();


        console.log(
          'HASIL TAMBAH SOP:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'SOP gagal ditambahkan.'
          );

        }


        // =====================================================
        // ID BARU
        // =====================================================

        const newId =
          result.id ||
          result.data?.id ||
          result.ID ||
          result.data?.ID ||
          '';


        // =====================================================
        // SUKSES
        // =====================================================

        sopStatusBox.style.display =
          'block';

        sopStatusBox.className =
          'status success';

        sopStatusBox.textContent =
          'SOP berhasil ditambahkan.' +
          (
            newId
              ? ' ID: ' + newId
              : ''
          );


        // =====================================================
        // RESET
        // =====================================================

        sopForm.reset();


      } catch (error) {

        console.error(
          'ERROR TAMBAH SOP:',
          error
        );

        sopStatusBox.style.display =
          'block';

        sopStatusBox.className =
          'status error';

        sopStatusBox.textContent =
          error.message ||
          'Terjadi kesalahan saat menambahkan SOP.';


      } finally {

        saveSopButton.disabled =
          false;

      }

    }
  );

}


// =========================================================
// TAMBAH REGULASI - SUBMIT
// =========================================================

if (regulasiForm) {

  regulasiForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      try {

        const judul =
          regulasiJudul.value.trim();

        const jenis =
          regulasiJenis.value;

        const nomor =
          regulasiNomor.value.trim();

        const tahun =
          regulasiTahun.value;

        const tentang =
          regulasiTentang.value.trim();

        const status =
          regulasiStatus.value;

        // =====================================================
        // VALIDASI REGULASI
        // =====================================================

        if (!judul) {

          throw new Error(
            'Judul regulasi wajib diisi.'
          );

        }

        if (!jenis) {

          throw new Error(
            'Jenis regulasi wajib dipilih.'
          );

        }

        if (!nomor) {

          throw new Error(
            'Nomor regulasi wajib diisi.'
          );

        }

        if (!tahun) {

          throw new Error(
            'Tahun regulasi wajib diisi.'
          );

        }


        // =====================================================
        // STATUS PROSES
        // =====================================================

        saveRegulasiButton.disabled =
          true;

        regulasiStatusBox.style.display =
          'block';

        regulasiStatusBox.className =
          'status loading';

        regulasiStatusBox.textContent =
          'Menyimpan regulasi...';


        // =====================================================
        // PAYLOAD
        // =====================================================

        const payload = {

          action: 'tambahRegulasi',

          judul: judul,

          jenis: jenis,

          nomor: nomor,

          tahun: tahun,

          tentang: tentang,

          status: status

        };


        // =====================================================
        // KIRIM KE APPS SCRIPT
        // =====================================================

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        // =====================================================
        // RESPONSE
        // =====================================================

        const result =
          await response.json();


        console.log(
          'HASIL TAMBAH REGULASI:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Regulasi gagal ditambahkan.'
          );

        }


        // =====================================================
        // ID BARU
        // =====================================================

        const newId =
          result.id ||
          result.data?.id ||
          result.ID ||
          result.data?.ID ||
          '';


        // =====================================================
        // SUKSES
        // =====================================================

        regulasiStatusBox.style.display =
          'block';

        regulasiStatusBox.className =
          'status success';

        regulasiStatusBox.textContent =
          'Regulasi berhasil ditambahkan.' +
          (
            newId
              ? ' ID: ' + newId
              : ''
          );


        // =====================================================
        // RESET FORM
        // =====================================================

        regulasiForm.reset();


      } catch (error) {

        console.error(
          'ERROR TAMBAH REGULASI:',
          error
        );

        regulasiStatusBox.style.display =
          'block';

        regulasiStatusBox.className =
          'status error';

        regulasiStatusBox.textContent =
          error.message ||
          'Terjadi kesalahan saat menambahkan regulasi.';


      } finally {

        saveRegulasiButton.disabled =
          false;

      }

    }
  );

}

// =========================================================
// TAMBAH LAPORAN - SUBMIT
// =========================================================

if (laporanForm) {

  laporanForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      try {

        const judul =
          laporanJudul.value.trim();

        const jenis =
          laporanJenis.value;

        const tahun =
          laporanTahun.value;

        // =====================================================
        // VALIDASI
        // =====================================================

        if (!judul) {

          throw new Error(
            'Judul laporan wajib diisi.'
          );

        }

        if (!jenis) {

          throw new Error(
            'Jenis laporan wajib dipilih.'
          );

        }

        if (!tahun) {

          throw new Error(
            'Tahun laporan wajib diisi.'
          );

        }


        // =====================================================
        // STATUS
        // =====================================================

        saveLaporanButton.disabled =
          true;

        laporanStatusBox.style.display =
          'block';

        laporanStatusBox.className =
          'status loading';

        laporanStatusBox.textContent =
          'Menyimpan laporan...';


        // =====================================================
        // PAYLOAD
        // =====================================================

        const payload = {

  action: 'tambahLaporan',

  judul: judul,

  jenis: jenis,

  tahun: tahun

};

        console.log(
          'PAYLOAD TAMBAH LAPORAN:',
          payload
        );


        // =====================================================
        // KIRIM KE APPS SCRIPT
        // =====================================================

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        // =====================================================
        // RESPONSE
        // =====================================================

        const result =
          await response.json();


        console.log(
          'HASIL TAMBAH LAPORAN:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Laporan gagal ditambahkan.'
          );

        }


        // =====================================================
        // SUKSES
        // =====================================================

        const newId =
          result.id ||
          result.data?.id ||
          result.ID ||
          result.data?.ID ||
          '';


        laporanStatusBox.style.display =
          'block';

        laporanStatusBox.className =
          'status success';

        laporanStatusBox.textContent =
          'Laporan berhasil ditambahkan.' +
          (
            newId
              ? ' ID: ' + newId
              : ''
          );


        // =====================================================
        // RESET FORM
        // =====================================================

        laporanForm.reset();


      } catch (error) {

        console.error(
          'ERROR TAMBAH LAPORAN:',
          error
        );

        laporanStatusBox.style.display =
          'block';

        laporanStatusBox.className =
          'status error';

        laporanStatusBox.textContent =
          error.message ||
          'Terjadi kesalahan saat menambahkan laporan.';


      } finally {

        saveLaporanButton.disabled =
          false;

      }

    }
  );

}

  // =========================================================
// TAMBAH PENGADAAN - ELEMENT
// =========================================================

const pengadaanForm =
  document.getElementById('pengadaanForm');

const pengadaanNama =
  document.getElementById('pengadaanNama');

const pengadaanNilai =
  document.getElementById('pengadaanNilai');

const pengadaanHps =
  document.getElementById('pengadaanHps');

const pengadaanSpesifikasi =
  document.getElementById('pengadaanSpesifikasi');

const pengadaanLokasi =
  document.getElementById('pengadaanLokasi');

const pengadaanJadwal =
  document.getElementById('pengadaanJadwal');

const pengadaanPenyedia =
  document.getElementById('pengadaanPenyedia');

const pengadaanStatus =
  document.getElementById('pengadaanStatus');

const savePengadaanButton =
  document.getElementById('savePengadaanButton');

const pengadaanStatusBox =
  document.getElementById('pengadaanStatusBox');


// =========================================================
// TAMBAH PENGADAAN - SUBMIT
// =========================================================

if (pengadaanForm) {

  pengadaanForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      try {

        const namaPekerjaan =
          pengadaanNama.value.trim();

        const nilai =
          pengadaanNilai.value;

        const hps =
          pengadaanHps.value;

        const spesifikasi =
          pengadaanSpesifikasi.value.trim();

        const lokasi =
          pengadaanLokasi.value.trim();

        const jadwal =
          pengadaanJadwal.value.trim();

        const penyedia =
          pengadaanPenyedia.value.trim();

        const status =
          pengadaanStatus.value;


        // =====================================================
        // VALIDASI
        // =====================================================

        if (!namaPekerjaan) {

          throw new Error(
            'Nama pekerjaan pengadaan wajib diisi.'
          );

        }


        // =====================================================
        // STATUS PROSES
        // =====================================================

        savePengadaanButton.disabled =
          true;

        pengadaanStatusBox.style.display =
          'block';

        pengadaanStatusBox.className =
          'status loading';

        pengadaanStatusBox.textContent =
          'Menyimpan data pengadaan...';


        // =====================================================
        // PAYLOAD
        // =====================================================

        const payload = {

          action:
            'tambahPengadaan',

          namaPekerjaan:
            namaPekerjaan,

          nilai:
            nilai,

          hps:
            hps,

          spesifikasi:
            spesifikasi,

          lokasi:
            lokasi,

          jadwal:
            jadwal,

          penyedia:
            penyedia,

          status:
            status

        };


        console.log(
          'PAYLOAD TAMBAH PENGADAAN:',
          payload
        );


        // =====================================================
        // KIRIM KE APPS SCRIPT
        // =====================================================

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        // =====================================================
        // RESPONSE
        // =====================================================

        const result =
          await response.json();


        console.log(
          'HASIL TAMBAH PENGADAAN:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Pengadaan gagal ditambahkan.'
          );

        }


        // =====================================================
        // ID BARU
        // =====================================================

        const newId =
          result.id ||
          result.data?.id ||
          result.ID ||
          result.data?.ID ||
          '';


        // =====================================================
        // SUKSES
        // =====================================================

        pengadaanStatusBox.style.display =
          'block';

        pengadaanStatusBox.className =
          'status success';

        pengadaanStatusBox.textContent =
          'Pengadaan berhasil ditambahkan.' +
          (
            newId
              ? ' ID: ' + newId
              : ''
          );


        // =====================================================
        // RESET FORM
        // =====================================================

        pengadaanForm.reset();


      } catch (error) {

        console.error(
          'ERROR TAMBAH PENGADAAN:',
          error
        );

        pengadaanStatusBox.style.display =
          'block';

        pengadaanStatusBox.className =
          'status error';

        pengadaanStatusBox.textContent =
          error.message ||
          'Terjadi kesalahan saat menambahkan pengadaan.';


      } finally {

        savePengadaanButton.disabled =
          false;

      }

    }
  );

}
  
// =========================================================
// UPLOAD PDF LAPORAN
// =========================================================

const uploadLaporanButton =
  document.getElementById('uploadLaporanButton');

const laporanUploadId =
  document.getElementById('laporanUploadId');

const laporanFile =
  document.getElementById('laporanFile');

const uploadLaporanStatusBox =
  document.getElementById('uploadLaporanStatusBox');


if (uploadLaporanButton) {

  uploadLaporanButton.addEventListener(
    'click',
    async function () {

      try {

        const idValue =
          laporanUploadId.value.trim();

        const file =
          laporanFile.files[0];

        // =========================
        // VALIDASI
        // =========================

        if (!idValue) {
          throw new Error(
            'ID laporan wajib diisi.'
          );
        }

        if (!file) {
          throw new Error(
            'Silakan pilih file PDF laporan.'
          );
        }

        if (
          file.type !== 'application/pdf' &&
          !file.name.toLowerCase().endsWith('.pdf')
        ) {
          throw new Error(
            'File laporan harus berupa PDF.'
          );
        }


        // =========================
        // STATUS
        // =========================

        uploadLaporanButton.disabled = true;

        uploadLaporanStatusBox.style.display =
          'block';

        uploadLaporanStatusBox.className =
          'status loading';

        uploadLaporanStatusBox.textContent =
          'Mengupload PDF laporan...';


        // =========================
        // BACA FILE
        // =========================

        const base64 =
          await new Promise(
            function (resolve, reject) {

              const reader =
                new FileReader();

              reader.onload = function () {

                const result =
                  reader.result;

                const base64Data =
                  result.split(',')[1];

                resolve(base64Data);

              };

              reader.onerror =
                function () {

                  reject(
                    new Error(
                      'Gagal membaca file.'
                    )
                  );

                };

              reader.readAsDataURL(file);

            }
          );


        // =========================
        // PAYLOAD
        // =========================

        const payload = {

          action:
            'uploadLaporanDocument',

          idValue:
            idValue,

          fileData:
            base64,

          fileName:
            file.name

        };


        console.log(
          'PAYLOAD UPLOAD LAPORAN:',
          payload
        );


        // =========================
        // KIRIM KE APPS SCRIPT
        // =========================

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        const result =
          await response.json();


        console.log(
          'HASIL UPLOAD LAPORAN:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Upload laporan gagal.'
          );

        }


        // =========================
        // SUKSES
        // =========================

        uploadLaporanStatusBox.style.display =
          'block';

        uploadLaporanStatusBox.className =
          'status success';

        uploadLaporanStatusBox.textContent =
          result.message ||
          'PDF laporan berhasil diupload.';


        laporanFile.value = '';


      } catch (error) {

        console.error(
          'ERROR UPLOAD LAPORAN:',
          error
        );

        uploadLaporanStatusBox.style.display =
          'block';

        uploadLaporanStatusBox.className =
          'status error';

        uploadLaporanStatusBox.textContent =
          error.message ||
          'Terjadi kesalahan saat upload laporan.';


      } finally {

        uploadLaporanButton.disabled =
          false;

      }

    }
  );

}


  
  // =========================================================
  // EDIT KONTEN - ELEMENT
  // =========================================================

  const editContentForm =
    document.getElementById('editContentForm');

  const editSheetName =
    document.getElementById('editSheetName');

  const editIdValue =
    document.getElementById('editIdValue');

  const editDataInfo =
    document.getElementById('editDataInfo');

  const editTitle =
    document.getElementById('editTitle');

  const editDate =
    document.getElementById('editDate');

  const editCategoryGroup =
    document.getElementById('editCategoryGroup');

  const editCategory =
    document.getElementById('editCategory');

  const editBody =
    document.getElementById('editBody');

  const editStatus =
    document.getElementById('editStatus');

  const updateContentButton =
    document.getElementById('updateContentButton');

  const editStatusBox =
    document.getElementById('editStatusBox');


  // =========================================================
  // DATA EDIT
  // =========================================================

  let editContentData = [];


  // =========================================================
  // MODE TAMBAH KONTEN
  // =========================================================

  function updateContentMode() {

    if (!contentType) return;

    const type = contentType.value;

    if (type === 'PENGUMUMAN') {

      if (categoryGroup) {
        categoryGroup.style.display = 'none';
      }

      if (contentCategory) {
        contentCategory.value = '';
      }

    } else {

      if (categoryGroup) {
        categoryGroup.style.display = '';
      }

    }

  }


  if (contentType) {

    contentType.addEventListener(
      'change',
      updateContentMode
    );

  }


  // =========================================================
  // SIMPAN KONTEN BARU
  // =========================================================

  if (saveContentButton) {

    saveContentButton.addEventListener(
      'click',
      async function () {

        try {

          const type =
            contentType.value;

          const title =
            contentTitle.value.trim();

          const date =
            contentDate.value;

          const body =
            contentBody.value.trim();

          const category =
            contentCategory
              ? contentCategory.value.trim()
              : '';

          const status =
            contentStatus.value;

          if (!type) {
            throw new Error(
              'Jenis konten belum dipilih.'
            );
          }

          if (!title) {
            throw new Error(
              'Judul wajib diisi.'
            );
          }

          if (!date) {
            throw new Error(
              'Tanggal wajib diisi.'
            );
          }

          if (!body) {
            throw new Error(
              'Isi konten wajib diisi.'
            );
          }


          saveContentButton.disabled = true;

          showContentStatus(
            'Menyimpan konten...',
            'loading'
          );


          const action =
            type === 'BERITA'
              ? 'tambahBerita'
              : 'tambahPengumuman';


          const payload = {

            action: action,

            judul: title,

            tanggal: date,

            isi: body,

            kategori:
              type === 'BERITA'
                ? category
                : '',

            status: status

          };


          const response =
            await fetch(API_URL, {

              method: 'POST',

              body: JSON.stringify(payload)

            });


          if (!response.ok) {

            throw new Error(
              'HTTP Error ' +
              response.status
            );

          }


          const result =
            await response.json();


          if (!result.success) {

            throw new Error(
              result.message ||
              'Gagal menyimpan konten.'
            );

          }


          const newId =
            result.id ||
            result.data?.id ||
            result.ID ||
            result.data?.ID ||
            '';


          showContentStatus(

            'Konten berhasil ditambahkan' +
            (
              newId
                ? ' dengan ID ' + newId
                : '.'
            ),

            'success'

          );


          // RESET FORM

          contentTitle.value = '';

          contentDate.value = '';

          if (contentCategory) {
            contentCategory.value = '';
          }

          contentBody.value = '';

          contentStatus.value =
            'Published';


          // REFRESH DAFTAR

          await loadContentList();


          // REFRESH DROPDOWN UPLOAD

          if (
            sheetSelect &&
            sheetSelect.value === type
          ) {

            await loadData(type);

            if (newId) {

              idSelect.value =
                newId;

              const selectedOption =
                Array.from(
                  idSelect.options
                ).find(
                  option =>
                    option.value === newId
                );

              if (selectedOption) {

                dataInfo.textContent =
                  selectedOption.textContent;

              }

            }

          }


        } catch (error) {

          console.error(
            'Simpan konten error:',
            error
          );

          showContentStatus(
            error.message ||
            'Terjadi kesalahan.',
            'error'
          );

        } finally {

          saveContentButton.disabled =
            false;

        }

      }
    );

  }


  // =========================================================
  // LOAD DAFTAR KONTEN
  // =========================================================

  async function loadContentList() {

    const contentListBody =
      document.getElementById(
        'contentListBody'
      );

    if (!contentListBody) return;


    try {

      const type =
        contentType
          ? contentType.value
          : 'BERITA';


      const action =
        type === 'PENGUMUMAN'
          ? 'pengumuman'
          : 'berita';


      contentListBody.innerHTML =
        '<tr><td colspan="6">Memuat data...</td></tr>';


      const response =
        await fetch(
          API_URL +
          '?action=' +
          encodeURIComponent(action)
        );


      if (!response.ok) {

        throw new Error(
          'HTTP Error ' +
          response.status
        );

      }


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          'Gagal mengambil daftar konten.'
        );

      }


      const data =
        Array.isArray(result.data)
          ? result.data
          : [];


      if (!data.length) {

        contentListBody.innerHTML =
          '<tr><td colspan="6">Belum ada data.</td></tr>';

        return;

      }


      contentListBody.innerHTML =
        data.map(function (item) {

          return `
            <tr>

              <td>
                ${escapeHTML(item.id || '-')}
              </td>

              <td>
                ${escapeHTML(item.judul || '-')}
              </td>

              <td>
                ${formatContentDate(item.tanggal)}
              </td>

              <td>
                ${escapeHTML(item.kategori || '-')}
              </td>

              <td>
                ${escapeHTML(item.status || '-')}
              </td>

              <td>
                ${
                  item.gambar_url
                    ? 'Ada'
                    : '-'
                }
              </td>

            </tr>
          `;

        }).join('');


    } catch (error) {

      console.error(
        'loadContentList error:',
        error
      );


      contentListBody.innerHTML = `
        <tr>
          <td colspan="6">
            Gagal memuat data:
            ${escapeHTML(error.message)}
          </td>
        </tr>
      `;

    }

  }


  // =========================================================
  // EDIT - LOAD DATA
  // =========================================================

  async function loadEditData() {

    if (!editSheetName ||
        !editIdValue) {

      return;

    }


    const sheet =
      editSheetName.value;


    if (!sheet) {

      editIdValue.innerHTML =
        '<option value="">Pilih jenis konten terlebih dahulu</option>';

      editContentData = [];

      clearEditForm();

      return;

    }


    try {

      showEditStatus(
        'Memuat data...',
        'loading'
      );


      const action =
        sheet === 'BERITA'
          ? 'berita'
          : 'pengumuman';


      const response =
        await fetch(
          API_URL +
          '?action=' +
          encodeURIComponent(action)
        );


      if (!response.ok) {

        throw new Error(
          'HTTP Error ' +
          response.status
        );

      }


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          'Gagal mengambil data.'
        );

      }


      editContentData =
        Array.isArray(result.data)
          ? result.data
          : [];


      editIdValue.innerHTML =
        '<option value="">Pilih konten...</option>';


      editContentData.forEach(
        function (item) {

          const option =
            document.createElement(
              'option'
            );

          option.value =
            item.id || '';

          option.textContent =
            (
              item.id || ''
            ) +
            ' — ' +
            (
              item.judul || ''
            );

          editIdValue.appendChild(
            option
          );

        }
      );


      clearEditForm(false);


      showEditStatus(
        editContentData.length +
        ' konten berhasil dimuat.',
        'success'
      );


    } catch (error) {

      console.error(
        'loadEditData error:',
        error
      );


      editContentData = [];


      editIdValue.innerHTML =
        '<option value="">Gagal memuat data</option>';


      clearEditForm();


      showEditStatus(
        error.message ||
        'Gagal memuat data.',
        'error'
      );

    }

  }


  // =========================================================
  // EDIT - SHOW DATA LAMA
  // =========================================================

  function loadEditContent() {

    if (!editIdValue) return;


    const idValue =
      editIdValue.value;


    if (!idValue) {

      clearEditForm();

      return;

    }


    const row =
      editContentData.find(
        function (item) {

          return String(item.id) ===
            String(idValue);

        }
      );


    if (!row) {

      clearEditForm();

      showEditStatus(
        'Data tidak ditemukan.',
        'error'
      );

      return;

    }


    // JUDUL

    if (editTitle) {

      editTitle.value =
        row.judul || '';

    }


    // TANGGAL

    if (editDate) {

      editDate.value =
        formatDateForInput(
          row.tanggal
        );

    }


    // KATEGORI

    if (editCategory) {

      editCategory.value =
        row.kategori || '';

    }


    // ISI

    if (editBody) {

      editBody.value =
        row.isi || '';

    }


    // STATUS

    if (editStatus) {

      editStatus.value =
        row.status ||
        'Published';

    }


    // INFO DATA

    if (editDataInfo) {

      editDataInfo.textContent =
        'ID: ' +
        (row.id || '-') +
        ' | Judul: ' +
        (row.judul || '-');

    }


    showEditStatus(
      'Data lama berhasil dimuat.',
      'success'
    );

  }


  // =========================================================
  // EDIT - CLEAR FORM
  // =========================================================

  function clearEditForm(
    clearStatus = true
  ) {

    if (editTitle) {
      editTitle.value = '';
    }

    if (editDate) {
      editDate.value = '';
    }

    if (editCategory) {
      editCategory.value = '';
    }

    if (editBody) {
      editBody.value = '';
    }

    if (editStatus) {
      editStatus.value =
        'Published';
    }

    if (editDataInfo) {
      editDataInfo.textContent =
        'Pilih konten untuk melihat data lama.';
    }

    if (clearStatus) {

      showEditStatus(
        '',
        ''
      );

    }

  }


  // =========================================================
  // EDIT - STATUS
  // =========================================================

  function showEditStatus(
    message,
    type
  ) {

    if (!editStatusBox) return;

    editStatusBox.textContent =
      message || '';

    editStatusBox.className =
  'status ' +
  (type || '');

  }


  // =========================================================
  // EDIT - MODE
  // =========================================================

  function updateEditMode() {

    if (!editSheetName) return;


    const sheet =
      editSheetName.value;


    if (
      editCategoryGroup
    ) {

      if (sheet === 'PENGUMUMAN') {

        editCategoryGroup.style.display =
          'none';

        if (editCategory) {
          editCategory.value = '';
        }

      } else {

        editCategoryGroup.style.display =
          '';

      }

    }

  }


  // =========================================================
  // EDIT - EVENT JENIS KONTEN
  // =========================================================

  if (editSheetName) {

    editSheetName.addEventListener(
      'change',
      async function () {

        updateEditMode();

        await loadEditData();

      }
    );

  }


  // =========================================================
  // EDIT - EVENT PILIH ID
  // =========================================================

  if (editIdValue) {

    editIdValue.addEventListener(
      'change',
      function () {

        loadEditContent();

      }
    );

  }


  // =========================================================
  // EDIT - SUBMIT
  // =========================================================

  if (editContentForm) {

    editContentForm.addEventListener(
      'submit',
      async function (event) {

        event.preventDefault();


        try {

          const sheet =
            editSheetName.value;

          const idValue =
            editIdValue.value;

          const title =
            editTitle.value.trim();

          const date =
            editDate.value;

          const body =
            editBody.value.trim();

          const category =
            editCategory
              ? editCategory.value.trim()
              : '';

          const status =
            editStatus.value;


          if (!sheet) {

            throw new Error(
              'Jenis konten belum dipilih.'
            );

          }


          if (!idValue) {

            throw new Error(
              'Konten yang akan diedit belum dipilih.'
            );

          }


          if (!title) {

            throw new Error(
              'Judul wajib diisi.'
            );

          }


          if (!date) {

            throw new Error(
              'Tanggal wajib diisi.'
            );

          }


          if (!body) {

            throw new Error(
              'Isi konten wajib diisi.'
            );

          }


          if (
            sheet !== 'BERITA' &&
            sheet !== 'PENGUMUMAN'
          ) {

            throw new Error(
              'Edit hanya tersedia untuk Berita dan Pengumuman.'
            );

          }


          updateContentButton.disabled =
            true;


          showEditStatus(
            'Menyimpan perubahan...',
            'loading'
          );


          const payload = {

            action: 'editKonten',

            sheetName: sheet,

            idValue: idValue,

            judul: title,

            tanggal: date,

            isi: body,

            kategori:
              sheet === 'BERITA'
                ? category
                : '',

            status: status

          };


          const response =
            await fetch(API_URL, {

              method: 'POST',

              body: JSON.stringify(
                payload
              )

            });


          if (!response.ok) {

            throw new Error(
              'HTTP Error ' +
              response.status
            );

          }


          const result =
            await response.json();


          if (!result.success) {

            throw new Error(
              result.message ||
              'Gagal memperbarui konten.'
            );

          }


          showEditStatus(
            'Konten berhasil diperbarui.',
            'success'
          );


          // REFRESH DATA EDIT

          await loadEditData();


          // KEMBALIKAN ID YANG SAMA

          if (idValue) {

            editIdValue.value =
              idValue;

            loadEditContent();

          }


          // REFRESH DAFTAR KONTEN

          await loadContentList();


          // REFRESH DATA UPLOAD

          if (
            sheetSelect &&
            sheetSelect.value === sheet
          ) {

            await loadData(sheet);

            if (idSelect) {

              idSelect.value =
                idValue;

            }

          }


        } catch (error) {

          console.error(
            'Edit konten error:',
            error
          );


          showEditStatus(
            error.message ||
            'Terjadi kesalahan.',
            'error'
          );

        } finally {

          updateContentButton.disabled =
            false;

        }

      }
    );

  }


  // =========================================================
  // LOAD DATA UNTUK UPLOAD
  // =========================================================

  async function loadData(
    sheetName
  ) {

    if (!idSelect) return;


    if (!sheetName) {

      idSelect.innerHTML =
        '<option value="">Pilih data...</option>';

      return;

    }


    try {

      idSelect.innerHTML =
        '<option value="">Memuat data...</option>';


      let action = '';


      switch (sheetName) {

        case 'INFORMASI_PUBLIK':
          action = 'informasi';
          break;

        case 'DIP':
          action = 'dip';
          break;

        case 'BERITA':
          action = 'berita';
          break;

        case 'PENGUMUMAN':
          action = 'pengumuman';
          break;


           case 'SOP':
  action = 'sop';
  break;

case 'REGULASI':
  action = 'regulasi';
  break;

    case 'LAPORAN':
  action = 'laporan';
  break;      
case 'PENGADAAN': action = 'pengadaan'; break;
          
        default:

          idSelect.innerHTML =
            '<option value="">Data belum tersedia</option>';

          return;

      }


      const response =
        await fetch(
          API_URL +
          '?action=' +
          encodeURIComponent(action)
        );


      if (!response.ok) {

        throw new Error(
          'HTTP Error ' +
          response.status
        );

      }


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          'Gagal mengambil data.'
        );

      }


      const data =
        Array.isArray(result.data)
          ? result.data
          : [];


      idSelect.innerHTML =
        '<option value="">Pilih data...</option>';


      data.forEach(
        function (item) {

          const option =
            document.createElement(
              'option'
            );


          option.value =
            item.id || '';


          let label =
  item.id || '';

if (sheetName === 'DIP') {

  label +=
    ' — ' +
    (
      item.nama_informasi ||
      item.judul ||
      ''
    );

} else if (sheetName === 'PENGADAAN') {

  label +=
    ' — ' +
    (
      item.nama_pekerjaan ||
      ''
    );

} else {

  label +=
    ' — ' +
    (
      item.judul ||
      item.nama_informasi ||
      ''
    );

}


          option.textContent =
            label;


          idSelect.appendChild(
            option
          );

        }
      );


      if (!data.length) {

        idSelect.innerHTML =
          '<option value="">Belum ada data</option>';

      }


    } catch (error) {

      console.error(
        'loadData error:',
        error
      );


      idSelect.innerHTML =
        '<option value="">Gagal memuat data</option>';


      showStatus(
        error.message ||
        'Gagal memuat data.',
        'error'
      );

    }

  }

async function loadLaporanUploadDropdown() {

  const select =
    document.getElementById('laporanUploadId');

  if (!select) return;

  try {

    const response = await fetch(
      API_URL + '?action=laporan'
    );

    if (!response.ok) {
      throw new Error(
        'HTTP Error ' + response.status
      );
    }

    const result =
      await response.json();

    if (!result.success) {
      throw new Error(
        result.message ||
        'Gagal mengambil data laporan.'
      );
    }

    const data =
      result.data || [];

    select.innerHTML =
      '<option value="">Pilih laporan</option>';

    data.forEach(function(item) {

      const option =
        document.createElement('option');

      option.value =
        item.id || '';

      option.textContent =
        (item.id || '') +
        ' — ' +
        (item.judul || '');

      select.appendChild(option);

    });

  } catch (error) {

    console.error(
      'ERROR LOAD LAPORAN:',
      error
    );

    select.innerHTML =
      '<option value="">Gagal memuat laporan</option>';
  }
}
  // =========================================================
  // MODE FORM UPLOAD
  // =========================================================

  function updateFormMode() {

    if (
      !sheetSelect ||
      !formTitle ||
      !formDescription
    ) {

      return;

    }


    const sheetName =
      sheetSelect.value;


    if (
      sheetName === 'BERITA'
    ) {

      formTitle.textContent =
        'Upload Gambar Berita';


      formDescription.textContent =
        'Upload gambar berita ke Google Drive dan simpan URL secara otomatis ke database.';


      if (fileInput) {

        fileInput.accept =
          '.jpg,.jpeg,.png,.webp';

      }


      if (fileLabel) {

        fileLabel.textContent =
          'Pilih gambar berita';

      }


      return;

    }


    if (
      sheetName === 'PENGUMUMAN'
    ) {

      formTitle.textContent =
        'Upload Gambar Pengumuman';


      formDescription.textContent =
        'Upload gambar pengumuman ke Google Drive dan simpan URL secara otomatis ke database.';


      if (fileInput) {

        fileInput.accept =
          '.jpg,.jpeg,.png,.webp';

      }


      if (fileLabel) {

        fileLabel.textContent =
          'Pilih gambar pengumuman';

      }


      return;

    }


    formTitle.textContent =
      'Upload Dokumen';


    formDescription.textContent =
      'Upload dokumen PDF ke Google Drive dan simpan URL dokumen secara otomatis ke database.';


    if (fileInput) {

      fileInput.accept =
        '.pdf';

    }


    if (fileLabel) {

      fileLabel.textContent =
        'Pilih dokumen PDF';

    }

  }


  // =========================================================
  // EVENT SHEET UPLOAD
  // =========================================================

  if (sheetSelect) {

    sheetSelect.addEventListener(
      'change',
      async function () {

        updateFormMode();

        if (fileInput) {
          fileInput.value = '';
        }

        if (fileInfo) {
          fileInfo.textContent = '';
        }

        await loadData(
          sheetSelect.value
        );

        await loadContentList();

      }
    );

  }


  // =========================================================
  // EVENT PILIH ID UPLOAD
  // =========================================================

  if (idSelect) {

    idSelect.addEventListener(
      'change',
      function () {

        const selected =
          idSelect.options[
            idSelect.selectedIndex
          ];


        if (
          dataInfo &&
          selected
        ) {

          dataInfo.textContent =
            selected.textContent || '';

        }

      }
    );

  }


  // =========================================================
  // FILE TO BASE64
  // =========================================================

  function fileToBase64(file) {

    return new Promise(
      function (resolve, reject) {

        const reader =
          new FileReader();


        reader.onload =
          function () {

            const result =
              reader.result;


            const base64 =
              String(result)
                .split(',')[1];


            resolve(base64);

          };


        reader.onerror =
          function () {

            reject(
              new Error(
                'Gagal membaca file.'
              )
            );

          };


        reader.readAsDataURL(file);

      }
    );

  }


  // =========================================================
  // FILE INPUT
  // =========================================================

  if (fileInput) {

    fileInput.addEventListener(
      'change',
      function () {

        const file =
          fileInput.files[0];


        if (!file) {

          if (fileInfo) {
            fileInfo.textContent = '';
          }

          return;

        }


        if (fileInfo) {

          fileInfo.textContent =
            file.name +
            ' (' +
            Math.round(
              file.size / 1024
            ) +
            ' KB)';

        }

      }
    );

  }


  // =========================================================
  // UPLOAD
  // =========================================================

  if (uploadForm) {

    uploadForm.addEventListener(
      'submit',
      async function (event) {

        event.preventDefault();


        try {

          const sheetName =
            sheetSelect.value;

          const idValue =
            idSelect.value;

          const file =
            fileInput.files[0];


          if (!sheetName) {

            throw new Error(
              'Jenis data belum dipilih.'
            );

          }


          if (!idValue) {

            throw new Error(
              'ID data belum dipilih.'
            );

          }


          if (!file) {

            throw new Error(
              'File belum dipilih.'
            );

          }


          const isImage =
            sheetName === 'BERITA' ||
            sheetName === 'PENGUMUMAN';


          // =================================================
          // VALIDASI FILE
          // =================================================

          if (isImage) {

            const allowedTypes = [
              'image/jpeg',
              'image/jpg',
              'image/png',
              'image/webp'
            ];


            if (
              !allowedTypes.includes(
                file.type
              )
            ) {

              throw new Error(
                'Untuk Berita/Pengumuman, file harus JPG, JPEG, PNG, atau WEBP.'
              );

            }

          } else {

            const isPDF =
              file.type ===
                'application/pdf' ||
              file.name
                .toLowerCase()
                .endsWith('.pdf');


            if (!isPDF) {

              throw new Error(
                'Dokumen harus berupa file PDF.'
              );

            }

          }


          uploadButton.disabled =
            true;


          showStatus(
            'Mengupload file...',
            'loading'
          );


          const fileData =
            await fileToBase64(
              file
            );


         let action = '';

if (sheetName === 'INFORMASI_PUBLIK') {
  action = 'upload';

} else if (sheetName === 'DIP') {
  action = 'upload';

} else if (sheetName === 'BERITA') {
  action = 'uploadBeritaImage';

} else if (sheetName === 'PENGUMUMAN') {
  action = 'uploadPengumumanImage';

} else if (sheetName === 'SOP') {
  action = 'uploadSOPDocument';

} else if (sheetName === 'REGULASI') {
  action = 'uploadRegulasiDocument';

} else if (sheetName === 'LAPORAN') {
  action = 'uploadLaporanDocument';

} else if (sheetName === 'PENGADAAN') {
  action = 'uploadPengadaanDocument';

} else {
  throw new Error(
    'Jenis data upload tidak dikenali: ' +
    sheetName
  );
}


          let folderName = '';

if (sheetName === 'INFORMASI_PUBLIK') {
  folderName = '02_INFORMASI_PUBLIK';

} else if (sheetName === 'DIP') {
  folderName = '03_DIP';

} else if (sheetName === 'BERITA') {
  folderName = '12_BERITA';

} else if (sheetName === 'PENGUMUMAN') {
  folderName = '13_PENGUMUMAN';

} else if (sheetName === 'SOP') {
  folderName = '05_SOP';

} else if (sheetName === 'REGULASI') {
  folderName = '06_REGULASI';

} else if (sheetName === 'LAPORAN') {
  folderName = '07_LAPORAN';

} else if (sheetName === 'PENGADAAN') {
  folderName = '08_PENGADAAN';
}


const payload = {

  action: action,

  sheetName:
    sheetName,

  idValue:
    idValue,

  fileData:
    fileData,

  fileName:
    file.name,

  folderName:
    folderName

};


          const response =
            await fetch(API_URL, {

              method: 'POST',

              body: JSON.stringify(
                payload
              )

            });


          if (!response.ok) {

            throw new Error(
              'HTTP Error ' +
              response.status
            );

          }


          const result =
            await response.json();


          if (!result.success) {

            throw new Error(
              result.message ||
              'Upload gagal.'
            );

          }


          showStatus(
            'File berhasil diupload.',
            'success'
          );


          if (dataInfo) {

            dataInfo.innerHTML =
              `
                <strong>Upload berhasil</strong><br>
                ID: ${escapeHTML(
                  result.id ||
                  idValue
                )}<br>
                File: ${escapeHTML(
                  result.fileName ||
                  file.name
                )}
              `;

          }


          // RESET FILE

          fileInput.value = '';

          if (fileInfo) {
            fileInfo.textContent = '';
          }


          // REFRESH DATA

          await loadData(
            sheetName
          );


          if (idSelect) {

            idSelect.value =
              idValue;

          }


        } catch (error) {

          console.error(
            'Upload error:',
            error
          );


          showStatus(
            error.message ||
            'Terjadi kesalahan saat upload.',
            'error'
          );

        } finally {

          uploadButton.disabled =
            false;

          updateFormMode();

        }

      }
    );

  }

// =========================================================
// ADMIN - PERMOHONAN & KEBERATAN
// =========================================================

// ---------------------------------------------------------
// HELPER STATUS
// ---------------------------------------------------------

function setAdminStatus(elementId, type, message) {

  const box = document.getElementById(elementId);

  if (!box) return;

  box.style.display = 'block';

  box.className = 'status ' + type;

  box.textContent = message;
}


// =========================================================
// TAMBAH PERMOHONAN
// =========================================================

const adminPermohonanForm =
  document.getElementById('permohonanForm');

if (adminPermohonanForm) {

  adminPermohonanForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      const button =
        document.getElementById(
          'savePermohonanButton'
        );

      const statusBox =
        document.getElementById(
          'permohonanStatusBox'
        );


      try {

        const nomorPermohonan =
          document.getElementById(
            'permohonanNomor'
          )?.value.trim() || '';

        const namaPemohon =
          document.getElementById(
            'permohonanNama'
          )?.value.trim() || '';

        const email =
          document.getElementById(
            'permohonanEmail'
          )?.value.trim() || '';

        const telepon =
          document.getElementById(
            'permohonanTelepon'
          )?.value.trim() || '';

        const tanggalMasuk =
          document.getElementById(
            'permohonanTanggal'
          )?.value || '';

        const status =
          document.getElementById(
            'permohonanStatus'
          )?.value || 'Diterima';

        const informasiDiminta =
          document.getElementById(
            'permohonanInformasi'
          )?.value.trim() || '';

        const tujuan =
          document.getElementById(
            'permohonanTujuan'
          )?.value.trim() || '';


        // -------------------------------------------------
        // VALIDASI
        // -------------------------------------------------

        if (!namaPemohon) {
          throw new Error(
            'Nama pemohon wajib diisi.'
          );
        }


        if (!informasiDiminta) {
          throw new Error(
            'Informasi yang diminta wajib diisi.'
          );
        }


        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        if (button) {

          button.disabled = true;

          button.textContent =
            'Menyimpan...';

        }


        setAdminStatus(
          'permohonanStatusBox',
          'loading',
          'Sedang menyimpan permohonan...'
        );


        // -------------------------------------------------
        // PAYLOAD
        // -------------------------------------------------

        const payload = {

          action:
            'tambahPermohonan',

          nomorPermohonan:
            nomorPermohonan,

          namaPemohon:
            namaPemohon,

          email:
            email,

          telepon:
            telepon,

          informasiDiminta:
            informasiDiminta,

          tujuan:
            tujuan,

          tanggalMasuk:
            tanggalMasuk,

          status:
            status,

          catatan:
            ''

        };


        console.log(
          'PAYLOAD PERMOHONAN:',
          payload
        );


        // -------------------------------------------------
        // KIRIM KE APPS SCRIPT
        // -------------------------------------------------

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'text/plain;charset=utf-8'
              },

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        const result =
          await response.json();


        console.log(
          'HASIL PERMOHONAN:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Permohonan gagal disimpan.'
          );

        }


        // -------------------------------------------------
        // SUKSES
        // -------------------------------------------------

        const nomorBaru =
          result.data?.nomor_permohonan ||
          result.nomor_permohonan ||
          nomorPermohonan ||
          'Berhasil dibuat';


        setAdminStatus(
          'permohonanStatusBox',
          'success',
          'Permohonan berhasil disimpan. Nomor Permohonan: ' +
          nomorBaru
        );


        // -------------------------------------------------
        // RESET
        // -------------------------------------------------

        adminPermohonanForm.reset();


        // tanggal kembali hari ini

        const tanggalInput =
          document.getElementById(
            'permohonanTanggal'
          );

        if (tanggalInput) {

          const today =
            new Date()
              .toISOString()
              .split('T')[0];

          tanggalInput.value =
            today;

        }


      } catch (error) {

        console.error(
          'ERROR PERMOHONAN:',
          error
        );


        setAdminStatus(
          'permohonanStatusBox',
          'error',
          error.message ||
          'Terjadi kesalahan saat menyimpan permohonan.'
        );


      } finally {

        if (button) {

          button.disabled = false;

          button.textContent =
            'Simpan Permohonan';

        }

      }

    }
  );

}


// =========================================================
// TAMBAH KEBERATAN
// =========================================================

const adminKeberatanForm =
  document.getElementById('keberatanForm');

if (adminKeberatanForm) {

  adminKeberatanForm.addEventListener(
    'submit',
    async function (event) {

      event.preventDefault();

      const button =
        document.getElementById(
          'saveKeberatanButton'
        );

      const statusBox =
        document.getElementById(
          'keberatanStatusBox'
        );


      try {

        const nomorPermohonan =
          document.getElementById(
            'keberatanNomorPermohonan'
          )?.value.trim() || '';

        const namaPemohon =
          document.getElementById(
            'keberatanNama'
          )?.value.trim() || '';

        const email =
          document.getElementById(
            'keberatanEmail'
          )?.value.trim() || '';

        const telepon =
          document.getElementById(
            'keberatanTelepon'
          )?.value.trim() || '';

        const alasanKeberatan =
          document.getElementById(
            'keberatanAlasan'
          )?.value.trim() || '';

        const tanggalMasuk =
          document.getElementById(
            'keberatanTanggal'
          )?.value || '';

        const status =
          document.getElementById(
            'keberatanStatus'
          )?.value || 'Diterima';

        const catatan =
          document.getElementById(
            'keberatanCatatan'
          )?.value.trim() || '';


        // -------------------------------------------------
        // VALIDASI
        // -------------------------------------------------

        if (!nomorPermohonan) {

          throw new Error(
            'Nomor permohonan wajib diisi.'
          );

        }


        if (!namaPemohon) {

          throw new Error(
            'Nama pemohon wajib diisi.'
          );

        }


        if (!alasanKeberatan) {

          throw new Error(
            'Alasan keberatan wajib diisi.'
          );

        }


        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        if (button) {

          button.disabled = true;

          button.textContent =
            'Menyimpan...';

        }


        setAdminStatus(
          'keberatanStatusBox',
          'loading',
          'Sedang menyimpan keberatan...'
        );


        // -------------------------------------------------
        // PAYLOAD
        // -------------------------------------------------

        const payload = {

          action:
            'tambahKeberatan',

          nomorKeberatan:
            '',

          nomorPermohonan:
            nomorPermohonan,

          namaPemohon:
            namaPemohon,

          email:
            email,

          telepon:
            telepon,

          alasanKeberatan:
            alasanKeberatan,

          tanggalMasuk:
            tanggalMasuk,

          status:
            status,

          catatan:
            catatan

        };


        console.log(
          'PAYLOAD KEBERATAN:',
          payload
        );


        // -------------------------------------------------
        // KIRIM KE APPS SCRIPT
        // -------------------------------------------------

        const response =
          await fetch(
            API_URL,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'text/plain;charset=utf-8'
              },

              body:
                JSON.stringify(payload)
            }
          );


        if (!response.ok) {

          throw new Error(
            'HTTP Error ' +
            response.status
          );

        }


        const result =
          await response.json();


        console.log(
          'HASIL KEBERATAN:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Keberatan gagal disimpan.'
          );

        }


        // -------------------------------------------------
        // SUKSES
        // -------------------------------------------------

        const nomorBaru =
          result.data?.nomor_keberatan ||
          result.nomor_keberatan ||
          'Berhasil dibuat';


        setAdminStatus(
          'keberatanStatusBox',
          'success',
          'Keberatan berhasil disimpan. Nomor Keberatan: ' +
          nomorBaru
        );


        // -------------------------------------------------
        // RESET
        // -------------------------------------------------

        adminKeberatanForm.reset();


        // tanggal kembali hari ini

        const tanggalInput =
          document.getElementById(
            'keberatanTanggal'
          );

        if (tanggalInput) {

          const today =
            new Date()
              .toISOString()
              .split('T')[0];

          tanggalInput.value =
            today;

        }


      } catch (error) {

        console.error(
          'ERROR KEBERATAN:',
          error
        );


        setAdminStatus(
          'keberatanStatusBox',
          'error',
          error.message ||
          'Terjadi kesalahan saat menyimpan keberatan.'
        );


      } finally {

        if (button) {

          button.disabled = false;

          button.textContent =
            'Simpan Keberatan';

        }

      }

    }
  );

}

  
  // =========================================================
  // INISIALISASI
  // =========================================================

  updateContentMode();

  updateEditMode();

  updateFormMode();


  // LOAD AWAL

  if (sheetSelect) {

    loadData(
      sheetSelect.value
    );

  }
loadLaporanUploadDropdown();

  if (contentType) {

    loadContentList();

  }


  if (editSheetName) {

    loadEditData();

  }

});




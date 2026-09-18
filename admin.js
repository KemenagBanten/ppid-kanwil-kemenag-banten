const API_URL =
'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';

document.addEventListener('DOMContentLoaded', function () {

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

// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

return String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');


}

// =========================================
// STATUS
// =========================================

function showStatus(message, type) {


if (!statusBox) return;

statusBox.className =
  'status ' + (type || '');

statusBox.textContent =
  message;


}

// =========================================
// TAMBAH BERITA / PENGUMUMAN
// =========================================

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


// =========================================
// STATUS KONTEN
// =========================================

function showContentStatus(
  message,
  type
) {

  if (!contentStatusBox) return;

  contentStatusBox.className =
    'status ' + (type || '');

  contentStatusBox.textContent =
    message;

}


// =========================================
// MODE KONTEN
// =========================================

function updateContentMode() {

  if (!contentType) return;


  if (
    contentType.value === 'BERITA'
  ) {

    categoryGroup.style.display =
      'block';

    contentCategory.required =
      false;

    return;

  }


  if (
    contentType.value === 'PENGUMUMAN'
  ) {

    categoryGroup.style.display =
      'none';

    contentCategory.value =
      '';

    contentCategory.required =
      false;

    return;

  }


  categoryGroup.style.display =
    'none';

}


// =========================================
// PILIH JENIS KONTEN
// =========================================

if (contentType) {

  contentType.addEventListener(
    'change',
    updateContentMode
  );

}


// =========================================
// SIMPAN KONTEN
// =========================================

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
          contentCategory.value.trim();

        const status =
          contentStatus.value;


        // ---------------------------------
        // VALIDASI
        // ---------------------------------

        if (!type) {

          throw new Error(
            'Silakan pilih Jenis Konten.'
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


        // ---------------------------------
        // TOMBOL
        // ---------------------------------

        saveContentButton.disabled =
          true;

        saveContentButton.textContent =
          'Menyimpan...';


        showContentStatus(
          'Sedang menyimpan data ke database...',
          'loading'
        );


        // ---------------------------------
        // ACTION
        // ---------------------------------

        let action = '';

        if (type === 'BERITA') {

          action =
            'tambahBerita';

        }

        else if (
          type === 'PENGUMUMAN'
        ) {

          action =
            'tambahPengumuman';

        }

        else {

          throw new Error(
            'Jenis konten tidak dikenali.'
          );

        }


        // ---------------------------------
        // REQUEST
        // ---------------------------------

        const requestBody = {

          action:
            action,

          judul:
            title,

          tanggal:
            date,

          isi:
            body,

          kategori:
            category,

          status:
            status

        };


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
                JSON.stringify(
                  requestBody
                )

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
          'Tambah konten result:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Data gagal disimpan.'
          );

        }


        // ---------------------------------
        // BERHASIL
        // ---------------------------------

        showContentStatus(
          (
            type === 'BERITA'
              ? 'Berita'
              : 'Pengumuman'
          ) +
          ' berhasil ditambahkan. ID: ' +
          result.id,
          'success'
        );


        // ---------------------------------
        // RESET FORM
        // ---------------------------------

        contentTitle.value =
          '';

        contentDate.value =
          '';

        contentCategory.value =
          '';

        contentBody.value =
          '';

        contentStatus.value =
          'Published';


        // ---------------------------------
        // REFRESH DROPDOWN UPLOAD
        // ---------------------------------

        if (
          sheetSelect.value === type
        ) {

          await loadData(type);

        }


        // ---------------------------------
        // PILIH DATA BARU OTOMATIS
        // ---------------------------------

        if (result.id) {

          idSelect.value =
            result.id;

          dataInfo.textContent =
            'Data baru berhasil dibuat. ID: ' +
            result.id +
            '. Silakan upload gambar.';

        }


      }

      catch (error) {

        console.error(
          'Tambah konten error:',
          error
        );


        showContentStatus(
          'Gagal menyimpan: ' +
          error.message,
          'error'
        );

      }

      finally {

        saveContentButton.disabled =
          false;

        saveContentButton.textContent =
          'Simpan Konten';

      }

    }
  );

}


// =========================================
// MODE AWAL KONTEN
// =========================================

updateContentMode();
  
// =========================================
// MODE FORM
// =========================================

function updateFormMode() {


const sheetName =
  sheetSelect.value;


// -----------------------------------------
// BERITA
// -----------------------------------------

if (sheetName === 'BERITA') {

  formTitle.textContent =
    'Upload Gambar Berita';

  formDescription.textContent =
    'Upload gambar berita ke Google Drive dan simpan URL gambar secara otomatis ke database Google Sheets.';

  fileLabel.textContent =
    'Gambar Berita';

  fileInput.accept =
    '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

  fileInfo.textContent =
    'Format yang diperbolehkan: JPG, JPEG, PNG, WEBP.';

  uploadButton.textContent =
    'Upload Gambar';

  return;

}


// -----------------------------------------
// PENGUMUMAN
// -----------------------------------------

if (sheetName === 'PENGUMUMAN') {

  formTitle.textContent =
    'Upload Gambar Pengumuman';

  formDescription.textContent =
    'Upload gambar pengumuman ke Google Drive dan simpan URL gambar secara otomatis ke database Google Sheets.';

  fileLabel.textContent =
    'Gambar Pengumuman';

  fileInput.accept =
    '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

  fileInfo.textContent =
    'Format yang diperbolehkan: JPG, JPEG, PNG, WEBP.';

  uploadButton.textContent =
    'Upload Gambar';

  return;

}


// -----------------------------------------
// DEFAULT / PDF
// -----------------------------------------

formTitle.textContent =
  'Upload Dokumen';

formDescription.textContent =
  'Upload dokumen PDF ke Google Drive dan simpan URL dokumen secara otomatis ke database Google Sheets.';

fileLabel.textContent =
  'Dokumen PDF';

fileInput.accept =
  '.pdf,application/pdf';

fileInfo.textContent =
  'Hanya file PDF.';

uploadButton.textContent =
  'Upload Dokumen';


}

// =========================================
// LOAD DATA
// =========================================

async function loadData(sheetName) {

idSelect.innerHTML =
  '<option value="">Memuat data...</option>';

dataInfo.textContent =
  'Mengambil data dari database...';


if (!sheetName) {

  idSelect.innerHTML =
    '<option value="">-- Pilih Data --</option>';

  dataInfo.textContent =
    'Pilih jenis data terlebih dahulu.';

  return;

}


try {

  let action = '';


  if (sheetName === 'INFORMASI_PUBLIK') {

    action = 'informasi';

  }

  else if (sheetName === 'DIP') {

    action = 'dip';

  }

  else if (sheetName === 'BERITA') {

    action = 'berita';

  }

  else if (sheetName === 'PENGUMUMAN') {

    action = 'pengumuman';

  }

  else {

    throw new Error(
      'Jenis data belum didukung.'
    );

  }


  console.log(
    'Memuat data:',
    sheetName,
    '→ action:',
    action
  );


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


  console.log(
    'Hasil API:',
    result
  );


  if (!result.success) {

    throw new Error(
      result.message ||
      'API mengembalikan success=false.'
    );

  }


  const data =
    Array.isArray(result.data)
      ? result.data
      : [];


  idSelect.innerHTML =
    '<option value="">-- Pilih Data --</option>';


  if (data.length === 0) {

    dataInfo.textContent =
      'Belum ada data pada database.';

    return;

  }


  let validCount = 0;


  data.forEach(function (row) {

    const id =
      row.id || '';


    if (!id) return;


    let judul = '';


    if (sheetName === 'DIP') {

      judul =
        row.nama_informasi ||
        'Tanpa Nama Informasi';

    }

    else {

      judul =
        row.judul ||
        'Tanpa Judul';

    }


    const option =
      document.createElement('option');


    option.value =
      id;

    option.textContent =
      id +
      ' — ' +
      judul;


    idSelect.appendChild(
      option
    );


    validCount++;

  });


  dataInfo.textContent =
    validCount +
    ' data tersedia.';


}

catch (error) {

  console.error(
    'loadData error:',
    error
  );


  idSelect.innerHTML =
    '<option value="">Gagal memuat data</option>';


  dataInfo.textContent =
    error.message;


  showStatus(
    'Gagal mengambil data: ' +
    error.message,
    'error'
  );

}


}

// =========================================
// PILIH JENIS DATA
// =========================================

sheetSelect.addEventListener(
'change',
function () {


  updateFormMode();

  fileInput.value = '';

  loadData(
    sheetSelect.value
  );

}


);

// =========================================
// PILIH ID
// =========================================

idSelect.addEventListener(
'change',
function () {


  if (!idSelect.value) {

    dataInfo.textContent =
      'Pilih data yang akan diproses.';

    return;

  }


  dataInfo.textContent =
    'ID yang dipilih: ' +
    idSelect.value;

}


);

// =========================================
// FILE → BASE64
// =========================================

function fileToBase64(file) {


return new Promise(
  function (resolve, reject) {

    const reader =
      new FileReader();


    reader.onload =
      function () {

        const result =
          reader.result;


        if (!result) {

          reject(
            new Error(
              'File tidak dapat dibaca.'
            )
          );

          return;

        }


        const parts =
          String(result)
            .split(',');


        if (parts.length < 2) {

          reject(
            new Error(
              'Format file tidak dapat diproses.'
            )
          );

          return;

        }


        resolve(
          parts[1]
        );

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

// =========================================
// UPLOAD
// =========================================

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


    // -------------------------------------
    // VALIDASI DASAR
    // -------------------------------------

    if (!sheetName) {

      throw new Error(
        'Silakan pilih Jenis Data.'
      );

    }


    if (!idValue) {

      throw new Error(
        'Silakan pilih ID Data.'
      );

    }


    if (!file) {

      throw new Error(
        (
          sheetName === 'BERITA' ||
          sheetName === 'PENGUMUMAN'
        )
          ? 'Silakan pilih gambar.'
          : 'Silakan pilih file PDF.'
      );

    }


    const fileName =
      file.name;


    // -------------------------------------
    // MODE GAMBAR
    // BERITA + PENGUMUMAN
    // -------------------------------------

    if (
      sheetName === 'BERITA' ||
      sheetName === 'PENGUMUMAN'
    ) {

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
      ];


      const extension =
        fileName
          .toLowerCase()
          .split('.')
          .pop();


      const allowedExtensions = [
        'jpg',
        'jpeg',
        'png',
        'webp'
      ];


      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(extension)
      ) {

        throw new Error(
          'Gambar harus berformat JPG, JPEG, PNG, atau WEBP.'
        );

      }


      uploadButton.disabled =
        true;

      uploadButton.textContent =
        'Mengupload...';


      showStatus(
        'Sedang mengupload gambar ' +
        fileName +
        '...',
        'loading'
      );


      const fileData =
        await fileToBase64(file);


      // -----------------------------------
      // BERITA
      // -----------------------------------

      if (sheetName === 'BERITA') {

        const requestBody = {

          action:
            'uploadBeritaImage',

          idValue:
            idValue,

          fileData:
            fileData,

          fileName:
            fileName,

          folderName:
            '12_BERITA'

        };


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
                JSON.stringify(
                  requestBody
                )

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
          'Upload gambar berita result:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Upload gambar berita gagal.'
          );

        }


        showStatus(
          'Upload gambar berita berhasil.',
          'success'
        );


        dataInfo.innerHTML =
          '<strong>Upload gambar berhasil</strong><br>' +
          'ID Berita: ' +
          escapeHTML(
            result.id ||
            idValue
          ) +
          '<br>' +
          'File: ' +
          escapeHTML(
            result.fileName ||
            fileName
          ) +
          '<br>' +
          'Folder: ' +
          escapeHTML(
            result.folder ||
            '12_BERITA'
          ) +
          '<br>' +
          '<a href="' +
          escapeHTML(
            result.fileUrl ||
            '#'
          ) +
          '" target="_blank" rel="noopener">' +
          'Lihat Gambar di Google Drive →' +
          '</a>';


        fileInput.value =
          '';

        return;

      }


      // -----------------------------------
      // PENGUMUMAN
      // -----------------------------------

      if (sheetName === 'PENGUMUMAN') {

        const requestBody = {

          action:
            'uploadPengumumanImage',

          idValue:
            idValue,

          fileData:
            fileData,

          fileName:
            fileName,

          folderName:
            '13_PENGUMUMAN'

        };


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
                JSON.stringify(
                  requestBody
                )

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
          'Upload gambar pengumuman result:',
          result
        );


        if (!result.success) {

          throw new Error(
            result.message ||
            'Upload gambar pengumuman gagal.'
          );

        }


        showStatus(
          'Upload gambar pengumuman berhasil.',
          'success'
        );


        dataInfo.innerHTML =
          '<strong>Upload gambar berhasil</strong><br>' +
          'ID Pengumuman: ' +
          escapeHTML(
            result.id ||
            idValue
          ) +
          '<br>' +
          'File: ' +
          escapeHTML(
            result.fileName ||
            fileName
          ) +
          '<br>' +
          'Folder: ' +
          escapeHTML(
            result.folder ||
            '13_PENGUMUMAN'
          ) +
          '<br>' +
          '<a href="' +
          escapeHTML(
            result.fileUrl ||
            '#'
          ) +
          '" target="_blank" rel="noopener">' +
          'Lihat Gambar di Google Drive →' +
          '</a>';


        fileInput.value =
          '';

        return;

      }

    }


    // -------------------------------------
    // MODE PDF
    // -------------------------------------

    if (
      file.type !== 'application/pdf' &&
      !fileName
        .toLowerCase()
        .endsWith('.pdf')
    ) {

      throw new Error(
        'File harus berformat PDF.'
      );

    }


    let folderName =
      '';


    if (
      sheetName === 'INFORMASI_PUBLIK'
    ) {

      folderName =
        '02_INFORMASI_PUBLIK';

    }

    else if (
      sheetName === 'DIP'
    ) {

      folderName =
        '03_DIP';

    }

    else {

      throw new Error(
        'Folder upload belum tersedia.'
      );

    }


    uploadButton.disabled =
      true;

    uploadButton.textContent =
      'Mengupload...';


    showStatus(
      'Sedang mengupload ' +
      fileName +
      '...',
      'loading'
    );


    const fileData =
      await fileToBase64(file);


    const requestBody = {

      action:
        'upload',

      sheetName:
        sheetName,

      idValue:
        idValue,

      fileData:
        fileData,

      fileName:
        fileName,

      folderName:
        folderName

    };


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
            JSON.stringify(
              requestBody
            )

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
      'Upload PDF result:',
      result
    );


    if (!result.success) {

      throw new Error(
        result.message ||
        'Upload gagal.'
      );

    }


    showStatus(
      'Upload berhasil. Dokumen ' +
      (result.id || '') +
      ' telah ditambahkan ke DOKUMEN.',
      'success'
    );


    dataInfo.innerHTML =
      '<strong>Upload berhasil</strong><br>' +
      'ID Dokumen: ' +
      escapeHTML(
        result.id ||
        '-'
      ) +
      '<br>' +
      'Informasi ID: ' +
      escapeHTML(
        result.informasiId ||
        idValue
      ) +
      '<br>' +
      'File: ' +
      escapeHTML(
        result.fileName ||
        fileName
      ) +
      '<br>' +
      'Folder: ' +
      escapeHTML(
        result.folder ||
        folderName
      ) +
      '<br>' +
      '<a href="' +
      escapeHTML(
        result.fileUrl ||
        '#'
      ) +
      '" target="_blank" rel="noopener">' +
      'Lihat File di Google Drive →' +
      '</a>';


    fileInput.value =
      '';


  }

  catch (error) {

    console.error(
      'Upload error:',
      error
    );


    showStatus(
      'Upload gagal: ' +
      error.message,
      'error'
    );

  }

  finally {

    uploadButton.disabled =
      false;

    updateFormMode();

  }

}

);

// =========================================
// INITIAL
// =========================================

updateFormMode();

});

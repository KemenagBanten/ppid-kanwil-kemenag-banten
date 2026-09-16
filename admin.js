const API_URL =
  'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';


const uploadForm =
  document.getElementById('uploadForm');

const uploadButton =
  document.getElementById('uploadButton');

const statusBox =
  document.getElementById('status');

const sheetSelect =
  document.getElementById('sheetName');

const idSelect =
  document.getElementById('idValue');

const dataInfo =
  document.getElementById('dataInfo');


/* =====================================================
   STATUS
===================================================== */

function showStatus(message, type) {

  statusBox.className =
    'status ' + type;

  statusBox.innerHTML =
    message;

}


/* =====================================================
   LOAD DATA DARI GOOGLE SHEETS
===================================================== */

async function loadData(sheetName) {

  idSelect.innerHTML = `
    <option value="">
      Memuat data...
    </option>
  `;

  idSelect.disabled = true;

  dataInfo.textContent =
    'Mengambil data dari Google Sheets...';


  let action;

  if (sheetName === 'INFORMASI_PUBLIK') {

    action = 'informasi';

  } else if (sheetName === 'DIP') {

    action = 'dip';

  } else {

    idSelect.innerHTML = `
      <option value="">
        -- Pilih Dokumen --
      </option>
    `;

    dataInfo.textContent =
      'Jenis data belum tersedia.';

    return;
  }


  try {

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
        'Data gagal dimuat.'
      );

    }


    const data =
      result.data;


    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {

      idSelect.innerHTML = `
        <option value="">
          Tidak ada data
        </option>
      `;

      dataInfo.textContent =
        'Belum ada data pada Google Sheets.';

      return;
    }


    /* -------------------------------------------------
       ISI DROPDOWN
    ------------------------------------------------- */

    idSelect.innerHTML = `
      <option value="">
        -- Pilih Dokumen --
      </option>
    `;


    data.forEach(function(row) {

      const id =
        row.id || '';

      const judul =
        row.judul || 'Tanpa Judul';


      if (!id) {
        return;
      }


      const option =
        document.createElement('option');


      option.value = id;

      option.textContent =
        id + ' — ' + judul;


      idSelect.appendChild(option);

    });


    idSelect.disabled = false;


    dataInfo.textContent =
      data.length +
      ' data tersedia dari Google Sheets.';


  } catch (error) {

    console.error(
      'LOAD DATA ERROR:',
      error
    );


    idSelect.innerHTML = `
      <option value="">
        Gagal memuat data
      </option>
    `;


    dataInfo.textContent =
      error.message;


    showStatus(
      'Data Google Sheets gagal dimuat: ' +
      escapeHTML(error.message),
      'error'
    );

  }

}


/* =====================================================
   PERUBAHAN JENIS DATA
===================================================== */

sheetSelect.addEventListener(
  'change',
  function() {

    const sheetName =
      this.value;


    if (!sheetName) {

      idSelect.innerHTML = `
        <option value="">
          -- Pilih Dokumen --
        </option>
      `;

      idSelect.disabled = true;

      dataInfo.textContent =
        'Pilih jenis data terlebih dahulu.';

      return;
    }


    loadData(sheetName);

  }
);


/* =====================================================
   FILE → BASE64
===================================================== */

function fileToBase64(file) {

  return new Promise(function(resolve, reject) {

    const reader =
      new FileReader();


    reader.onload =
      function() {

        const result =
          reader.result;

        const base64 =
          result.split(',')[1];

        resolve(base64);

      };


    reader.onerror =
      function() {

        reject(
          new Error(
            'File gagal dibaca.'
          )
        );

      };


    reader.readAsDataURL(file);

  });

}


/* =====================================================
   UPLOAD
===================================================== */

uploadForm.addEventListener(
  'submit',
  async function(event) {

    event.preventDefault();


    const sheetName =
      sheetSelect.value;


    const idValue =
      idSelect.value;


    const file =
      document.getElementById(
        'file'
      ).files[0];


    /* -------------------------------------------------
       VALIDASI
    ------------------------------------------------- */

    if (!sheetName) {

      showStatus(
        'Silakan pilih jenis data.',
        'error'
      );

      return;
    }


    if (!idValue) {

      showStatus(
        'Silakan pilih dokumen.',
        'error'
      );

      return;
    }


    if (!file) {

      showStatus(
        'Silakan pilih file PDF.',
        'error'
      );

      return;
    }


    if (
      file.type !== 'application/pdf' &&
      !file.name
        .toLowerCase()
        .endsWith('.pdf')
    ) {

      showStatus(
        'File harus berformat PDF.',
        'error'
      );

      return;
    }


    try {

      uploadButton.disabled =
        true;

      uploadButton.textContent =
        'Mengupload...';


      showStatus(
        'Sedang mengupload dokumen...',
        'loading'
      );


      /* -------------------------------------------------
         CONVERT PDF
      ------------------------------------------------- */

      const fileData =
        await fileToBase64(file);


      /* -------------------------------------------------
         ID COLUMN
      ------------------------------------------------- */

      const idColumnName =
        'id';


      /* -------------------------------------------------
         FOLDER
      ------------------------------------------------- */

      let folderName;


      if (
        sheetName ===
        'INFORMASI_PUBLIK'
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


      /* -------------------------------------------------
         REQUEST
      ------------------------------------------------- */

      const requestData = {

        action:
          'upload',

        sheetName:
          sheetName,

        idColumnName:
          idColumnName,

        idValue:
          idValue,

        fileData:
          fileData,

        fileName:
          file.name,

        folderName:
          folderName

      };


      /* -------------------------------------------------
         POST
      ------------------------------------------------- */

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
                requestData
              )
          }
        );


      if (!response.ok) {

        throw new Error(
          'Server mengembalikan HTTP ' +
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


      /* -------------------------------------------------
         SUKSES
      ------------------------------------------------- */

      showStatus(
        `
        <strong>Upload berhasil.</strong><br><br>

        File:
        ${escapeHTML(
          result.fileName
        )}<br>

        Folder:
        ${escapeHTML(
          result.folder
        )}<br><br>

        <a
          href="${escapeAttribute(
            result.fileUrl
          )}"
          target="_blank"
          rel="noopener"
        >
          Buka Dokumen
        </a>
        `,
        'success'
      );


      uploadForm.reset();


      idSelect.innerHTML = `
        <option value="">
          -- Pilih Dokumen --
        </option>
      `;

      idSelect.disabled = true;

      dataInfo.textContent =
        'Pilih jenis data terlebih dahulu.';


  } catch (error) {

      console.error(
        'UPLOAD ERROR:',
        error
      );


      showStatus(
        `
        <strong>Upload gagal.</strong><br>
        ${escapeHTML(
          error.message
        )}
        `,
        'error'
      );


    } finally {

      uploadButton.disabled =
        false;

      uploadButton.textContent =
        'Upload Dokumen';

    }

  }
);


/* =====================================================
   SECURITY HELPER
===================================================== */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}


function escapeAttribute(value) {

  return String(value)
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}

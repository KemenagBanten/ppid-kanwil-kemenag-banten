const API_URL =
  'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';


const uploadForm =
  document.getElementById('uploadForm');

const uploadButton =
  document.getElementById('uploadButton');

const statusBox =
  document.getElementById('status');


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
   FILE → BASE64
===================================================== */

function fileToBase64(file) {

  return new Promise(function(resolve, reject) {

    const reader = new FileReader();

    reader.onload = function() {

      const result =
        reader.result;

      const base64 =
        result.split(',')[1];

      resolve(base64);

    };

    reader.onerror = function() {

      reject(
        new Error('File gagal dibaca.')
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
      document.getElementById(
        'sheetName'
      ).value;

    const idValue =
      document.getElementById(
        'idValue'
      ).value.trim();

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
        'ID data wajib diisi.',
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
      !file.name.toLowerCase().endsWith('.pdf')
    ) {

      showStatus(
        'File harus berformat PDF.',
        'error'
      );

      return;
    }


    try {

      uploadButton.disabled = true;

      uploadButton.textContent =
        'Mengupload...';


      showStatus(
        'Sedang mengupload dokumen. Mohon tunggu...',
        'loading'
      );


      /* -------------------------------------------------
         CONVERT PDF
      ------------------------------------------------- */

      const fileData =
        await fileToBase64(file);


      /* -------------------------------------------------
         TENTUKAN KOLOM ID
      ------------------------------------------------- */

      let idColumnName =
        'id';

      if (sheetName === 'INFORMASI_PUBLIK') {

        idColumnName =
          'id';

      }

      if (sheetName === 'DIP') {

        idColumnName =
          'id';

      }


      /* -------------------------------------------------
         FOLDER DRIVE
      ------------------------------------------------- */

      let folderName =
        '02_INFORMASI_PUBLIK';

      if (sheetName === 'DIP') {

        folderName =
          '03_DIP';

      }


      /* -------------------------------------------------
         REQUEST
      ------------------------------------------------- */

      const requestData = {

        action: 'upload',

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
         POST KE APPS SCRIPT
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
          'HTTP Error ' +
          response.status
        );

      }


      const result =
        await response.json();


      /* -------------------------------------------------
         HASIL
      ------------------------------------------------- */

      if (!result.success) {

        throw new Error(
          result.message ||
          'Upload gagal.'
        );

      }


      showStatus(
        `
        <strong>Upload berhasil.</strong><br>
        File: ${result.fileName}<br>
        Folder: ${result.folder}<br>
        <a
          href="${result.fileUrl}"
          target="_blank"
        >
          Buka Dokumen
        </a>
        `,
        'success'
      );


      uploadForm.reset();


    } catch (error) {

      console.error(error);

      showStatus(
        `
        <strong>Upload gagal.</strong><br>
        ${error.message}
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

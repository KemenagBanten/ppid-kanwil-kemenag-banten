const API_URL =
  'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';


const uploadForm = document.getElementById('uploadForm');
const uploadButton = document.getElementById('uploadButton');
const statusBox = document.getElementById('status');


/* =====================================================
   STATUS
===================================================== */

function showStatus(message, type) {

  statusBox.className = 'status ' + type;
  statusBox.innerHTML = message;

}


/* =====================================================
   FILE → BASE64
===================================================== */

function fileToBase64(file) {

  return new Promise(function(resolve, reject) {

    const reader = new FileReader();

    reader.onload = function() {

      const result = reader.result;

      const base64 = result.split(',')[1];

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
   UPLOAD FORM
===================================================== */

uploadForm.addEventListener(
  'submit',
  async function(event) {

    event.preventDefault();

    const sheetName =
      document.getElementById('sheetName').value;

    const idValue =
      document.getElementById('idValue').value.trim();

    const file =
      document.getElementById('file').files[0];


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
         TENTUKAN ID COLUMN
      ------------------------------------------------- */

      const idColumnName = 'id';


      /* -------------------------------------------------
         TENTUKAN FOLDER
      ------------------------------------------------- */

      let folderName;

      if (sheetName === 'INFORMASI_PUBLIK') {

        folderName =
          '02_INFORMASI_PUBLIK';

      } else if (sheetName === 'DIP') {

        folderName =
          '03_DIP';

      } else {

        throw new Error(
          'Jenis data belum memiliki folder upload.'
        );

      }


      /* -------------------------------------------------
         REQUEST DATA
      ------------------------------------------------- */

      const requestData = {

        action: 'upload',

        sheetName: sheetName,

        idColumnName: idColumnName,

        idValue: idValue,

        fileData: fileData,

        fileName: file.name,

        folderName: folderName

      };


      console.log(
        'Mengirim upload ke Apps Script...'
      );


      /* -------------------------------------------------
         POST
      ------------------------------------------------- */

      const response = await fetch(
        API_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:
            JSON.stringify(requestData)
        }
      );


      console.log(
        'HTTP status:',
        response.status
      );


      if (!response.ok) {

        throw new Error(
          'Server mengembalikan HTTP ' +
          response.status
        );

      }


      const result =
        await response.json();


      console.log(
        'Response Apps Script:',
        result
      );


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
        <strong>Upload berhasil.</strong><br><br>

        File:
        ${escapeHTML(result.fileName)}<br>

        Folder:
        ${escapeHTML(result.folder)}<br><br>

        <a
          href="${escapeAttribute(result.fileUrl)}"
          target="_blank"
          rel="noopener"
        >
          Buka Dokumen
        </a>
        `,
        'success'
      );


      uploadForm.reset();


    } catch (error) {

      console.error(
        'UPLOAD ERROR:',
        error
      );


      showStatus(
        `
        <strong>Upload gagal.</strong><br>
        ${escapeHTML(error.message)}
        `,
        'error'
      );


    } finally {

      uploadButton.disabled = false;

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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


function escapeAttribute(value) {

  return String(value)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}

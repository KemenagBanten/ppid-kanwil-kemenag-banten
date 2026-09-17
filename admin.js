const API_URL =
  'https://script.google.com/macros/s/AKfycby74M5l9jbsxZOHMq9_svivqRHK9xbK-Ms-iNfSmiggTlUjdnmQbfMC2OeuRVs3M2zT/exec';

document.addEventListener('DOMContentLoaded', function () {

  const uploadForm =
    document.getElementById('uploadForm');

  const uploadButton =
    document.getElementById('uploadButton');

  const statusBox =
    document.getElementById('statusBox');

  const sheetSelect =
    document.getElementById('sheetName');

  const idSelect =
    document.getElementById('idValue');

  const dataInfo =
    document.getElementById('dataInfo');

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
  // TAMPILKAN STATUS
  // =========================================

  function showStatus(message, type) {

    if (!statusBox) return;

    statusBox.innerHTML =
      '<div class="status ' +
      escapeHTML(type || '') +
      '">' +
      escapeHTML(message) +
      '</div>';
  }

  // =========================================
  // LOAD DATA UNTUK DROPDOWN
  // =========================================

  async function loadData(sheetName) {

    idSelect.innerHTML =
      '<option value="">Memuat data...</option>';

    dataInfo.textContent =
      'Mengambil data dari database...';

    if (!sheetName) {

      idSelect.innerHTML =
        '<option value="">-- Pilih Dokumen --</option>';

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

      else {
        throw new Error(
          'Jenis data belum didukung.'
        );
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
          'API mengembalikan success=false.'
        );
      }

      const data =
        Array.isArray(result.data)
          ? result.data
          : [];

      idSelect.innerHTML =
        '<option value="">-- Pilih Dokumen --</option>';

      if (data.length === 0) {

        dataInfo.textContent =
          'Belum ada data pada database.';

        return;
      }

      data.forEach(function (row) {

        const id =
          row.id || '';

        let judul = '';

        if (sheetName === 'DIP') {

          judul =
            row.nama_informasi ||
            'Tanpa Nama Informasi';

        } else {

          judul =
            row.judul ||
            'Tanpa Judul';

        }

        if (!id) return;

        const option =
          document.createElement('option');

        option.value = id;

        option.textContent =
          id +
          ' — ' +
          judul;

        idSelect.appendChild(option);
      });

      dataInfo.textContent =
        data.length +
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

      loadData(
        sheetSelect.value
      );

    }
  );

  // =========================================
  // SAAT PILIH ID
  // =========================================

  idSelect.addEventListener(
    'change',
    function () {

      if (!idSelect.value) {

        dataInfo.textContent =
          'Pilih dokumen yang akan di-upload.';

        return;
      }

      dataInfo.textContent =
        'ID yang dipilih: ' +
        idSelect.value;
    }
  );

  // =========================================
  // KONVERSI FILE KE BASE64
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

        const fileInput =
          document.getElementById('file');

        const file =
          fileInput.files[0];

        // -------------------------------------
        // VALIDASI
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
            'Silakan pilih file PDF.'
          );
        }

        const fileName =
          file.name;

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

        // -------------------------------------
        // TENTUKAN FOLDER DRIVE
        // -------------------------------------

        let folderName = '';

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

        // -------------------------------------
        // UI UPLOAD
        // -------------------------------------

        uploadButton.disabled = true;

        uploadButton.textContent =
          'Mengupload...';

        showStatus(
          'Sedang mengupload ' +
          fileName +
          '...',
          'loading'
        );

        // -------------------------------------
        // FILE → BASE64
        // -------------------------------------

        const fileData =
          await fileToBase64(file);

        // -------------------------------------
        // REQUEST
        // -------------------------------------

        const requestBody = {

          action: 'upload',

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

        // -------------------------------------
        // KIRIM KE APPS SCRIPT
        // -------------------------------------

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
          'Upload result:',
          result
        );

        if (!result.success) {

          throw new Error(
            result.message ||
            'Upload gagal.'
          );
        }

        // -------------------------------------
        // BERHASIL
        // -------------------------------------

        showStatus(
          'Upload berhasil. ' +
          'Dokumen ' +
          (result.id || '') +
          ' telah ditambahkan ke DOKUMEN.',
          'success'
        );

        // -------------------------------------
        // INFORMASI HASIL
        // -------------------------------------

        dataInfo.innerHTML =
          '<strong>Upload berhasil</strong><br>' +
          'ID Dokumen: ' +
          escapeHTML(
            result.id || '-'
          ) +
          '<br>' +
          'Informasi ID: ' +
          escapeHTML(
            result.informasiId || idValue
          ) +
          '<br>' +
          'File: ' +
          escapeHTML(
            result.fileName || fileName
          ) +
          '<br>' +
          'Folder: ' +
          escapeHTML(
            result.folder || folderName
          ) +
          '<br>' +
          '<a href="' +
          escapeHTML(
            result.fileUrl || '#'
          ) +
          '" target="_blank" rel="noopener">' +
          'Lihat File di Google Drive →' +
          '</a>';

        // -------------------------------------
        // RESET FILE
        // -------------------------------------

        fileInput.value = '';

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

        uploadButton.textContent =
          'Upload Dokumen';
      }

    }
  );

});

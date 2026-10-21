/* Konfigurasi website.
   adminUrl : alamat panel admin (CodeIgniter) untuk mode "live" (opsional).
              Kosong ('') = website memakai data statis (catalog-data.js + jobs-data.js)
              sehingga Product & Career SELALU tampil tanpa server admin menyala.
              Bila diisi (mis. 'http://localhost/bumm-admin/'), data diambil live dari admin
              dan otomatis jatuh ke data statis jika admin tidak bisa dijangkau.
   applyUrl : alamat endpoint form lamaran (career/apply). Server admin yang
              menerima data form lalu mengirimnya ke email HRD.
              Isi dengan alamat admin + 'api/apply', mis. 'https://admin.bumm.co.id/api/apply'.
              Kosong = otomatis memakai adminUrl + 'api/apply'.
              Jika keduanya kosong, form menampilkan pesan error + tautan email cadangan.
   hrEmail  : hanya dipakai sebagai tautan email cadangan bila form tidak bisa mengirim.
              Email tujuan lamaran yang sebenarnya diatur di server admin
              (application/config/bumm.php -> hr_email). */
window.BUMM_SITE = {
  adminUrl: '',
  applyUrl: '',
  hrEmail: 'untari@bumm.co.id'
};

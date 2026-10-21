/* Konfigurasi website.
   adminUrl : alamat panel admin (CodeIgniter) untuk mode "live" (opsional).
              Kosong ('') = website memakai data statis (catalog-data.js + jobs-data.js)
              sehingga Product & Career SELALU tampil tanpa server admin menyala.
              Bila diisi (mis. 'http://localhost/bumm-admin/'), data diambil live dari admin
              dan otomatis jatuh ke data statis jika admin tidak bisa dijangkau.
   hrEmail  : tujuan tombol "Lamar via Email" di tiap lowongan. */
window.BUMM_SITE = {
  adminUrl: '',
  hrEmail: 'untari@bumm.co.id'
};

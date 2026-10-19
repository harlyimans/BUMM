/* Memuat data katalog dari panel admin (api/catalog.js), lalu menjalankan catalog.js.
   Jika admin tidak bisa dijangkau, jatuh kembali ke catalog-data.js (data statis). */
(function () {
  var cfg  = window.BUMM_SITE || {};
  var me   = document.currentScript && document.currentScript.src;
  var base = me ? me.replace(/catalog-loader\.js.*$/, '') : '../assets/js/';

  function load(src, ok, fail) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = ok;
    s.onerror = fail || ok;
    document.body.appendChild(s);
  }
  function run() { load(base + 'catalog.js'); }
  function fallback() { load(base + 'catalog-data.js', run, run); }

  if (cfg.adminUrl) {
    load(cfg.adminUrl.replace(/\/?$/, '/') + 'api/catalog.js', run, fallback);
  } else {
    fallback();
  }
})();

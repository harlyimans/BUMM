/* Menampilkan lowongan di halaman Career.
   Sumber data (berurutan):
   1) window.BUMM_JOBS  -> assets/js/jobs-data.js (statis, hasil Export admin) -- default, selalu tersedia
   2) api/jobs di panel admin -> hanya bila BUMM_SITE.adminUrl diisi (mode live)
   Tiap lowongan punya tombol "Lamar via Email" sendiri (subjek berisi judul posisi). */
(function () {
  var cfg   = window.BUMM_SITE || {};
  var list  = document.getElementById('jobList');
  var empty = document.getElementById('jobEmpty');
  if (!list) return;

  var HR_EMAIL = cfg.hrEmail || 'untari@bumm.co.id';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;       // textContent = aman dari XSS
    return e;
  }
  function bullets(text) {
    var lines = String(text || '').split(/\r?\n/).map(function (l) {
      return l.replace(/^\s*[-•*]\s*/, '').trim();
    }).filter(Boolean);
    if (!lines.length) return null;
    var ul = el('ul', 'mb-3');
    lines.forEach(function (l) { ul.appendChild(el('li', null, l)); });
    return ul;
  }
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function todayIso() {
    var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  // Data statis bisa berumur beberapa hari -> buang yang deadline-nya sudah lewat.
  function stillOpen(j) { return !j.deadline || j.deadline >= todayIso(); }

  function mailLink(j) {
    var subject = 'Lamaran: ' + j.title + ' - PT BUMM';
    var body = 'Yth. HRD PT BUMM,\n\nSaya ingin melamar posisi "' + j.title + '"' +
      (j.location ? ' (' + j.location + ')' : '') +
      '.\nTerlampir CV dan dokumen pendukung saya.\n\nTerima kasih.';
    return 'mailto:' + HR_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function card(j) {
    var box = el('div', 'bumm-job-card');
    box.appendChild(el('div', 'bumm-job-title', j.title));

    var meta = el('div', 'bumm-job-meta');
    [j.location, j.type, j.deadline ? 'Sampai ' + fmtDate(j.deadline) : ''].forEach(function (t) {
      if (t) meta.appendChild(el('span', 'bumm-job-tag', t));
    });
    box.appendChild(meta);
    box.appendChild(el('p', 'bumm-job-desc', j.summary));

    var d = bullets(j.description), r = bullets(j.requirements);
    if (d || r) {
      var det = el('details', 'mt-3');
      det.appendChild(el('summary', 'fw-semibold', 'Detail posisi'));
      var body = el('div', 'mt-3 bumm-job-desc');
      if (d) { body.appendChild(el('div', 'fw-semibold mb-1', 'Deskripsi pekerjaan')); body.appendChild(d); }
      if (r) { body.appendChild(el('div', 'fw-semibold mb-1', 'Kualifikasi')); body.appendChild(r); }
      det.appendChild(body);
      box.appendChild(det);
    }

    // Tombol email langsung, khusus untuk lowongan ini
    var apply = el('a', 'btn btn-bumm-primary btn-sm mt-3');
    apply.href = mailLink(j);
    var ic = el('i', 'bi bi-envelope-fill me-2');
    ic.setAttribute('aria-hidden', 'true');
    apply.appendChild(ic);
    apply.appendChild(document.createTextNode('Lamar via Email'));
    box.appendChild(apply);
    return box;
  }

  function show(jobs) {
    jobs = (jobs || []).filter(stillOpen);
    if (!jobs.length) return;                      // kosong -> biarkan empty state tampil
    jobs.forEach(function (j) { list.appendChild(card(j)); });
    if (empty) empty.style.display = 'none';
  }

  // 1) Data statis (default)
  if (window.BUMM_JOBS && window.BUMM_JOBS.jobs && window.BUMM_JOBS.jobs.length) {
    show(window.BUMM_JOBS.jobs);
    return;
  }

  // 2) Mode live (opsional)
  if (!cfg.adminUrl) return;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', cfg.adminUrl.replace(/\/?$/, '/') + 'api/jobs');
  xhr.onload = function () {
    if (xhr.status !== 200) return;
    try { show(JSON.parse(xhr.responseText).jobs || []); } catch (e) { /* abaikan */ }
  };
  xhr.send();
})();

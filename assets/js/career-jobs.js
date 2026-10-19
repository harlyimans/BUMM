/* Menampilkan lowongan dari panel admin (api/jobs) di halaman Career. */
(function () {
  var cfg   = window.BUMM_SITE || {};
  var list  = document.getElementById('jobList');
  var empty = document.getElementById('jobEmpty');
  if (!cfg.adminUrl || !list) return;

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
    return box;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', cfg.adminUrl.replace(/\/?$/, '/') + 'api/jobs');
  xhr.onload = function () {
    if (xhr.status !== 200) return;
    var jobs;
    try { jobs = JSON.parse(xhr.responseText).jobs || []; } catch (e) { return; }
    if (!jobs.length) return;                      // kosong -> biarkan empty state tampil
    jobs.forEach(function (j) { list.appendChild(card(j)); });
    if (empty) empty.style.display = 'none';
  };
  xhr.send();
})();

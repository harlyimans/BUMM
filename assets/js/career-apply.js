/* Form lamaran kerja (career/apply).
   - Pilihan posisi diisi dari jobs-data.js (atau ?job=ID dari tombol "Lamar Sekarang").
   - Data + CV dikirim (multipart) ke endpoint admin: api/apply.
   - Server admin yang mengirim email ke HRD. */
(function () {
  var cfg  = window.BUMM_SITE || {};
  var form = document.getElementById('applyForm');
  if (!form) return;

  var MAX_BYTES = 2 * 1024 * 1024;
  var ALLOWED   = /\.(pdf|docx?|PDF|DOCX?)$/;
  var HR_EMAIL  = cfg.hrEmail || 'untari@bumm.co.id';

  var $alert = document.getElementById('applyAlert');
  var $btn   = document.getElementById('applyBtn');
  var $sel   = document.getElementById('fPosition');
  var $cv    = document.getElementById('fCv');

  function endpoint() {
    if (cfg.applyUrl) return cfg.applyUrl;
    if (cfg.adminUrl) return cfg.adminUrl.replace(/\/?$/, '/') + 'api/apply';
    return '';
  }

  function todayIso() {
    var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  // ---- Isi pilihan posisi
  var jobs = ((window.BUMM_JOBS && window.BUMM_JOBS.jobs) || []).filter(function (j) {
    return !j.deadline || j.deadline >= todayIso();
  });
  jobs.forEach(function (j) {
    var o = document.createElement('option');
    o.value = j.id;
    o.textContent = j.title + (j.location ? ' — ' + j.location : '');
    $sel.appendChild(o);
  });
  var m = /[?&]job=(\d+)/.exec(location.search);
  if (m) {
    for (var i = 0; i < $sel.options.length; i++) {
      if ($sel.options[i].value === m[1]) { $sel.selectedIndex = i; break; }
    }
  }

  document.getElementById('fTs').value = String(Date.now());   // anti-bot: waktu halaman dibuka

  // ---- Helper tampilan
  function showError(html) {
    $alert.innerHTML = html;
    $alert.classList.remove('d-none');
    $alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function clearError() { $alert.classList.add('d-none'); $alert.textContent = ''; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function setBusy(b) {
    $btn.disabled = b;
    $btn.querySelector('span').textContent = b ? 'Mengirim…' : 'Kirim Lamaran';
  }
  function fallbackMail() {
    var title = $sel.options[$sel.selectedIndex].textContent;
    var href = 'mailto:' + HR_EMAIL + '?subject=' + encodeURIComponent('Lamaran: ' + title + ' - PT BUMM');
    return 'Silakan kirim lamaran langsung ke <a href="' + esc(href) + '">' + esc(HR_EMAIL) + '</a>.';
  }

  // ---- Validasi di browser (server tetap memvalidasi ulang)
  function validate() {
    var errs = [];
    var name = form.full_name.value.trim(), email = form.email.value.trim(), phone = form.phone.value.trim();
    if (!name) errs.push('Nama lengkap wajib diisi.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push('Format email tidak valid.');
    if (phone.replace(/\D/g, '').length < 8) errs.push('No. HP / WhatsApp tidak valid.');
    if (!form.education.value) errs.push('Pilih pendidikan terakhir.');
    var f = $cv.files && $cv.files[0];
    if (!f) errs.push('CV wajib diunggah.');
    else if (!ALLOWED.test(f.name)) errs.push('CV harus berformat PDF, DOC, atau DOCX.');
    else if (f.size > MAX_BYTES) errs.push('Ukuran CV maksimal 2 MB.');
    if (!document.getElementById('fConsent').checked) errs.push('Centang pernyataan persetujuan terlebih dahulu.');
    return errs;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    var errs = validate();
    if (errs.length) { showError('<ul class="mb-0"><li>' + errs.map(esc).join('</li><li>') + '</li></ul>'); return; }

    var url = endpoint();
    if (!url) { showError('Form belum terhubung ke server. ' + fallbackMail()); return; }

    var fd = new FormData(form);
    setBusy(true);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = 60000;                      // upload CV bisa lambat di koneksi seluler
    xhr.onload = function () {
      var res = null;
      try { res = JSON.parse(xhr.responseText); } catch (err) {}
      if (xhr.status === 200 && res && res.ok) {
        form.classList.add('d-none');
        document.getElementById('applyDone').classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setBusy(false);
      if (res && res.errors) {
        var list = [];
        Object.keys(res.errors).forEach(function (k) { list.push(res.errors[k]); });
        showError('<ul class="mb-0"><li>' + list.map(esc).join('</li><li>') + '</li></ul>');
      } else {
        showError(esc((res && res.message) || 'Lamaran gagal dikirim.') + ' ' + fallbackMail());
      }
    };
    xhr.onerror = xhr.ontimeout = function () {
      setBusy(false);
      showError('Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi. ' + fallbackMail());
    };
    xhr.send(fd);
  });
})();

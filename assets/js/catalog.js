/* Product catalog — renders cards from window.BUMM_CATALOG (catalog-data.js)
   and filters them by segment, customer and a free-text search
   (part name / material number).
   - product/index.html: all segments, with segment chips.
   - product/<segment>.html: #catalog has data-segment="<key>", so the list is
     locked to that segment and the chips are not used. */
(function () {
  var data = window.BUMM_CATALOG;
  var root = document.getElementById('catalog');
  if (!data || !root) return;

  var IMG_BASE = '../assets/img/';
  var locked = root.getAttribute('data-segment') || '';
  var els = {
    chips: root.querySelector('[data-cat-chips]'),
    customer: root.querySelector('[data-cat-customer]'),
    search: root.querySelector('[data-cat-search]'),
    reset: root.querySelector('[data-cat-reset]'),
    grid: root.querySelector('[data-cat-grid]'),
    count: root.querySelector('[data-cat-count]'),
    empty: root.querySelector('[data-cat-empty]')
  };
  var base = { segment: locked || 'all', customer: 'all', q: '' };
  var state = { segment: base.segment, customer: 'all', q: '' };

  // Awalnya hanya tampil ROWS baris; sisanya lewat tombol "Show all".
  var ROWS = 2;
  var expanded = false;
  var current = [];
  var moreWrap = document.createElement('div');
  moreWrap.className = 'bumm-cat-more';
  moreWrap.hidden = true;
  moreWrap.innerHTML = '<button type="button" class="btn btn-bumm-secondary bumm-cat-more-btn" aria-expanded="false"></button>';
  els.grid.parentNode.insertBefore(moreWrap, els.grid.nextSibling);
  var moreBtn = moreWrap.firstChild;

  // Jumlah kolom aktual (auto-fill) -> batas = kolom x ROWS, jadi baris selalu penuh.
  function perRow() {
    var cols = getComputedStyle(els.grid).gridTemplateColumns.split(' ').filter(Boolean).length;
    return Math.max(cols, 1);
  }

  var segLabel = {};
  data.segments.forEach(function (s) { segLabel[s.key] = s.label; });

  var scope = data.parts.filter(function (p) { return !locked || p.segment === locked; });

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function imgSrc(p) { return /^(https?:)?\/\/|\//.test(p) ? p : IMG_BASE + p; }

  function setChips(activeKey) {
    if (!els.chips) return;
    Array.prototype.forEach.call(els.chips.children, function (c) {
      var on = c.getAttribute('data-seg') === activeKey;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
  }

  function buildChips() {
    if (!els.chips) return;
    var counts = { all: data.parts.length };
    data.parts.forEach(function (p) { counts[p.segment] = (counts[p.segment] || 0) + 1; });
    var items = [{ key: 'all', label: 'All' }].concat(data.segments);
    els.chips.innerHTML = items.map(function (s) {
      return '<button type="button" class="bumm-cat-chip' + (s.key === 'all' ? ' is-active' : '') +
        '" data-seg="' + esc(s.key) + '" aria-pressed="' + (s.key === 'all') + '">' +
        esc(s.label) + ' <span class="bumm-cat-chip-n">' + (counts[s.key] || 0) + '</span></button>';
    }).join('');
  }

  function buildCustomers() {
    var seen = {};
    scope.forEach(function (p) { seen[p.customer] = true; });
    var names = Object.keys(seen).sort();
    els.customer.innerHTML = '<option value="all">All customers</option>' +
      names.map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + '</option>'; }).join('');
  }

  function card(p) {
    return '<article class="bumm-cat-card">' +
      '<div class="bumm-cat-thumb">' +
        '<img src="' + esc(imgSrc(p.image)) + '" alt="' + esc(p.partName) + '" loading="lazy" ' +
        'onerror="this.parentNode.classList.add(\'is-placeholder\');this.remove();">' +
      '</div>' +
      '<div class="bumm-cat-body">' +
        '<span class="bumm-cat-seg">' + esc(segLabel[p.segment] || p.segment) + '</span>' +
        '<h3 class="bumm-cat-name">' + esc(p.partName) + '</h3>' +
        '<dl class="bumm-cat-meta">' +
          '<div><dt>Customer</dt><dd>' + esc(p.customer) + '</dd></div>' +
          '<div><dt>Material</dt><dd class="bumm-cat-mat">' + esc(p.materialNo) + '</dd></div>' +
        '</dl>' +
      '</div></article>';
  }

  function paint() {
    var limit = perRow() * ROWS;
    var canCollapse = current.length > limit;
    var shown = (expanded || !canCollapse) ? current : current.slice(0, limit);
    els.grid.innerHTML = shown.map(card).join('');
    els.empty.hidden = current.length > 0;
    els.count.textContent = (canCollapse && !expanded)
      ? 'Showing ' + shown.length + ' of ' + current.length + ' parts'
      : current.length + (current.length === 1 ? ' part' : ' parts');
    moreWrap.hidden = !canCollapse;
    moreBtn.textContent = expanded ? 'Show less' : 'Show all (' + current.length + ')';
    moreBtn.setAttribute('aria-expanded', String(expanded));
  }

  function render() {
    var q = state.q.trim().toLowerCase();
    current = data.parts.filter(function (p) {
      if (state.segment !== 'all' && p.segment !== state.segment) return false;
      if (state.customer !== 'all' && p.customer !== state.customer) return false;
      if (q && (p.partName + ' ' + p.materialNo).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    expanded = false; // filter berubah -> kembali ke tampilan ringkas
    paint();
    els.reset.hidden = !(state.segment !== base.segment || state.customer !== 'all' || q !== '');
  }

  moreBtn.addEventListener('click', function () {
    expanded = !expanded;
    paint();
    if (!expanded) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(paint, 150);
  });

  if (els.chips) {
    els.chips.addEventListener('click', function (e) {
      var b = e.target.closest('.bumm-cat-chip');
      if (!b) return;
      state.segment = b.getAttribute('data-seg');
      setChips(state.segment);
      render();
    });
  }
  els.customer.addEventListener('change', function () { state.customer = this.value; render(); });
  els.search.addEventListener('input', function () { state.q = this.value; render(); });
  els.reset.addEventListener('click', function () {
    state = { segment: base.segment, customer: 'all', q: '' };
    els.customer.value = 'all';
    els.search.value = '';
    setChips(base.segment);
    render();
  });

  buildChips();
  buildCustomers();
  render();
})();

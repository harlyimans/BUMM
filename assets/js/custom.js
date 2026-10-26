$(function () {
  // --------------------------------------------------------------------
  // Hero background video — optional enhancement on top of the poster
  // image. The <img> already covers LCP/SEO/no-JS cases; this only adds
  // a video when it's actually worth the bytes: desktop-sized viewport,
  // no data-saver flag, decent connection, and motion is welcome.
  // --------------------------------------------------------------------
  function heroVideoIsEligible() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (window.innerWidth < 992) return false; // skip on mobile/tablet

    var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    if (conn) {
      if (conn.saveData) return false;
      if (/^(slow-2g|2g|3g)$/.test(conn.effectiveType || '')) return false;
    }
    return true;
  }

  function loadHeroVideo() {
    if (!heroVideoIsEligible()) return;

    var $media = $('.bumm-hero-media');
    if (!$media.length || $media.find('video').length) return;

    var video = document.createElement('video');
    video.className = 'bumm-hero-bg-video';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    // TODO(client): assets/video/hero-foundry.webm/.mp4 don't exist yet in
    // this build, so the <video> below will always hit the 'error' listener
    // and get removed, leaving the poster image — safe fallback, but add
    // the real video files to actually get the motion effect.
    video.setAttribute('poster', 'assets/img/foundry.webp');
    video.innerHTML =
      '<source src="assets/video/hero-foundry.webm" type="video/webm">' +
      '<source src="assets/video/hero-foundry.mp4" type="video/mp4">';

    video.addEventListener('canplay', function () {
      video.classList.add('is-ready');
    });
    // If the file is missing/errors, just quietly keep the poster image.
    video.addEventListener('error', function () {
      $(video).remove();
    });

    $media.append(video);
    video.load();
    video.play().catch(function () {
      // Autoplay blocked — poster image remains, no harm done.
    });
  }

  // Dinonaktifkan sementara: assets/video/hero-foundry.webm/.mp4 belum ada, jadi
  // setiap load menghasilkan request 404. Aktifkan lagi setelah filenya ditambahkan.
  // loadHeroVideo();

  // Footer video: autoplays muted + looped on every page. Visitors who
  // ask the OS for reduced motion get it paused with controls instead.
  $('.bumm-footer-video video').each(function () {
    var v = this;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay');
      v.pause();
      v.setAttribute('controls', '');
    } else if ('IntersectionObserver' in window) {
      // Video footer berat: baru diunduh & diputar saat footer mendekati layar.
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.disconnect();
          v.preload = 'auto';
          var play = v.play();
          if (play && play.catch) play.catch(function () {});
        });
      }, { rootMargin: '300px 0px' });
      io.observe(v);
    } else {
      var play = v.play();
      if (play && play.catch) play.catch(function () {});
    }
  });

  // --------------------------------------------------------------------
  // Site copy — English only (the Indonesian version and the EN/ID
  // switch were removed). Elements with data-i18n get their text from here.
  // --------------------------------------------------------------------
  var translations = {
    en: {
      nav_home: 'Home',
      nav_career: 'Career',
      nav_about: 'About',
      nav_product: 'Product',
      nav_news: 'News',
      nav_about_profile: 'Company Profile',
      nav_about_vision: 'Vision & Mission',
      nav_about_value: 'Corporate Value',
      nav_about_management: 'Management',
      mgmt_eyebrow: 'Our Management',
      nav_about_facility: 'Facility',
      nav_prod_automotive: 'Automotive',
      nav_prod_agriculture: 'Agriculture',
      nav_prod_heavy: 'Heavy Duty',
      nav_prod_general: 'General Casting',
      nav_prod_train: 'Train Component',
      fac_eyebrow: 'Our Facility',
      fac_heading: 'INTEGRATED FOUNDRY <span class="bumm-heading-accent">FACILITY</span>',
      fac_lead: 'Integrated production facilities covering every stage, from core making to final inspection, ensuring consistent quality and precision.',
      insp_heading_1: 'INSPECTION',
      insp_heading_2: 'FACILITY',
      insp_lead: 'Ensuring consistent product quality through precise inspection, material verification, and dimensional accuracy.',
      insp_1_label: 'Chemical Analysis',
      insp_1_desc: 'Analyzes casting material composition to ensure quality and compliance.',
      insp_2_label: 'Sand Analysis',
      insp_2_desc: 'Evaluates molding sand quality for consistent casting results.',
      insp_3_label: 'Mechanical Analysis',
      insp_3_desc: 'Evaluates the strength and hardness of iron castings.',
      insp_4_label: 'Measuring Analysis',
      insp_4_desc: 'Verifies casting dimensions against product specifications.',
      insp_5_label: 'Non Destructive Test Analysis',
      insp_5_desc: 'Detects internal casting defects without damaging the product.',
      contact_us: 'Contact Us',
      hero_eyebrow_group: 'A SUBSIDIARY OF BAKRIE AUTOPARTS',
      hero_headline: "“Casting perfection through quality.”",
      // Split across two lines in the hero so each line can take its own
      // type treatment (solid / outlined); hero_headline above stays as the
      // single-string version for any other surface that needs it.
      hero_headline_cast: 'Casting perfection',
      hero_headline_last: 'through quality',
      hero_lead: 'A trusted foundry partner for high quality iron casting solutions for automotive, heavy duty, agriculture, train component and general casting.',
      btn_view_product: 'View Products',
      plate_title: 'Company Profile',
      plate_established_label: 'Established',
      plate_experience_label: 'Foundry Experience',
      plate_experience_value: '40+ years',
      plate_oem_label: 'OEM Partners',
      plate_parent_label: 'Parent Company',
      trusted_label: 'Trusted by',
      about_intro_eyebrow: 'About BUMM',
      about_intro_heading: 'MORE THAN JUST CASTING',
      about_intro_cta: 'Learn About BUMM',
      experience_heading_1: 'BUILT ON',
      experience_heading_2: 'EXPERIENCE',
      experience_lead: 'Decades of Foundry Expertise, Delivering Precision Iron Casting Solutions Engineered for Quality, Reliability, and Performance.',
      experience_stat_established: 'Established',
      experience_stat_ownership: 'Bakrie Autoparts ownership',
      experience_stat_years: 'Years Of Experience',
      experience_stat_capacity: 'Ton Installed Capacity',
      about_eyebrow: 'Our Values',
      about_heading: 'THE VALUES WE UPHOLD',
      about_home_lead: 'The principles that shape our culture, guide our decisions, and drive our commitment to excellence.',
      about_lead: "PT Bina Usaha Mandiri Mizusawa (BUMM), established in 1983 as a subsidiary of Bakrie Autoparts, is a trusted iron casting manufacturer based in Jatiuwung, Tangerang, Indonesia. Specializing in foundry solutions for automotive, heavy equipment, agricultural machinery, railway components, and general industrial applications, BUMM is committed to producing high-quality castings that meet the evolving demands of various industries.",
      victory_v_desc: 'Looking ahead to anticipate what our industry and customers will need next.',
      victory_i_desc: "Doing what's right, consistently, even when no one's checking.",
      victory_c_desc: "Every process is built around what makes our customers' operations succeed.",
      victory_t_desc: 'Complex casting work only holds together when the whole team does.',
      victory_o_desc: 'Refining the process itself, not just the output.',
      victory_v_title: 'Visionary',
      victory_i_title: 'Integrity',
      victory_c_title: 'Customer-oriented',
      victory_t_title: 'Teamwork',
      victory_o_title: 'Operational Excellence',
      victory_r_title: 'Responsibility',
      victory_y_title: 'Yield Orientation',
      victory_r_desc: 'Owning the outcome — for our people, our product and the environment around the plant.',
      victory_y_desc: 'Measuring success by real, usable output — not just activity.',
      capability_eyebrow: 'Capability',
      capability_heading: 'Built to supply, not just to cast.',
      capability_lead: 'From single-piece prototypes to recurring OEM production runs, our foundry supports both automotive supply chains and general industrial casting needs.',
      capability_1_title: 'Direct OEM Supply',
      capability_1_desc: 'Supplying cast components directly into automotive and heavy-equipment OEM supply chains.',
      capability_2_title: 'General & Custom Casting',
      capability_2_desc: 'Beyond automotive parts, we also produce general iron casting to custom specification for a range of industrial needs.',
      capability_3_title: 'Backed by Bakrie Autoparts',
      capability_3_desc: 'Part of the Bakrie Autoparts group, giving BUMM the scale and resources of an established industrial group.',
      capability_4_title: 'Quality-First Process',
      capability_4_desc: 'Every batch goes through in-house quality control before it leaves the foundry.',
      capflow_eyebrow: 'Our Capabilities',
      capflow_heading_1: 'INTEGRATED MANUFACTURING &',
      capflow_heading_2: 'QUALITY CONTROL',
      capflow_lead: 'From casting and machining to precision inspection, our integrated facilities and quality control processes ensure reliable products that meet customer specifications and industry standards.',
      capflow_1_label: 'Core Making',
      capflow_1_desc: 'Sand cores are precision-formed to shape the internal cavities and passages of each casting.',
      capflow_2_label: 'Molding',
      capflow_2_desc: 'Molds are built from the core and pattern to define the exact external geometry of the part.',
      capflow_3_label: 'Melting',
      capflow_3_desc: "Iron is melted and refined in-house until its chemical composition matches each product's specification.",
      capflow_4_label: 'Pouring',
      capflow_4_desc: 'Molten iron is poured into the mold under controlled temperature and timing for a sound, defect-free casting.',
      capflow_5_label: 'Laboratory',
      capflow_5_desc: 'In-house metallurgy testing confirms chemical composition, hardness and microstructure meet the required standard.',
      capflow_6_label: 'Machining',
      capflow_6_desc: 'CNC machining brings each casting to its final dimensions, tolerances and surface finish.',
      capflow_7_label: 'Dimensional Inspection',
      capflow_7_desc: 'Every batch is measured against drawing tolerances using CMM and precision gauging equipment.',
      capflow_8_label: 'Quality Inspection',
      capflow_8_desc: 'A final quality inspection clears each part for packing and delivery to the customer.',
      cert_caption: 'Certification — confirm standard & number',
      product_segment_eyebrow: 'Our Product',
      product_segment_heading: 'Product <span class="bumm-heading-accent">Segment</span>',
      product_segment_lead: 'High quality casting solutions for various industries, supporting a stronger and more sustainable future.',
      segment_automotive_title: 'Automotive',
      segment_agriculture_title: 'Agriculture',
      segment_heavy_duty_title: 'Heavy Duty',
      segment_general_casting_title: 'General Casting',
      segment_train_title: 'Train Component',
      segment_learn_more: 'Learn More',
      product_eyebrow: 'Product',
      product_heading1: 'CASTING EXCELLENCE,',
      product_heading2: 'BUILT TO LAST',
      product_lead: '5 Key Industries: High-quality casting solutions for various industries, driving stronger and more sustainable industrial growth.',
      product_1_desc: 'Precision-cast water pump housings and components for automotive cooling systems.',
      product_2_desc: 'Cast components built for diesel engine systems, from housings to structural parts.',
      product_3_desc: 'Heavy-duty iron cast parts engineered for construction and industrial machinery.',
      product_4_desc: 'General automotive components cast to OEM specification.',
      product_view_detail: 'View Details →',
      btn_view_all_products: 'View All Products',
      achievement_eyebrow: 'Achievement',
      achievement_heading: 'Recognized by the OEMs we supply.',
      achievement_lead: 'A track record of appreciation from long-term automotive and heavy-equipment partners — not marketing claims, but recognitions given for actual performance.',
      news_eyebrow: 'News & Activity',
      news_heading: "What's happening at the foundry.",
      news_page_heading: 'What\'s happening at the <span class="bumm-heading-accent">foundry.</span>',
      news_view_all: 'View All News →',
      cta_heading: 'LOOKING FOR THE BEST IRON CAST AND FOUNDRY COMPANY?',
      cta_lead: 'Let us know — our team will get back to you.',
      contact_eyebrow: 'Contact Us',
      contact_heading_1: "Let's talk about your",
      contact_heading_2: 'production needs.',
      contact_plate_title: 'Contact Details',
      contact_phone_label: 'Phone',
      contact_address_label: 'Address',
      contact_email_label: 'Email',
      contact_form_title: 'Send a Message',
      contact_form_name: 'Name',
      contact_form_email: 'Email',
      contact_form_subject: 'Subject',
      contact_form_message: 'Message',
      contact_form_send: 'Send',
      footer_company: 'Company',
      footer_certification: 'Certification',
      footer_video: 'Company Video',
      footer_location: 'Location',
      footer_copyright: '© PT. Bina Usaha Mandiri Mizusawa. All rights reserved.'
    }
  };

  var DEFAULT_LANG = 'en';

  function applyCopy() {
    var dict = translations[DEFAULT_LANG];
    $('[data-i18n]').each(function () {
      var key = $(this).data('i18n');
      if (dict[key] !== undefined) {
        // Entri yang memakai <span> (kata beraksen warna) ditulis sebagai HTML
        if (/<span\b/.test(dict[key])) { $(this).html(dict[key]); }
        else { $(this).text(dict[key]); }
      }
    });
    document.documentElement.setAttribute('lang', DEFAULT_LANG);
  }

  applyCopy();

  // Pause the client-logo marquee when the tab isn't visible, so it isn't
  // silently animating (and burning a repaint cycle) in a background tab.
  document.addEventListener('visibilitychange', function () {
    var $track = $('.bumm-marquee-track');
    if (document.hidden) {
      $track.css('animation-play-state', 'paused');
    } else {
      $track.css('animation-play-state', 'running');
    }
  });

  // Subtle navbar depth once the page scrolls, so it reads as "lifted"
  // above the hero rather than just a flat bar.
  var $nav = $('.bumm-navbar');
  function syncNavbar() {
    $nav.toggleClass('is-scrolled', $(window).scrollTop() > 8);
  }
  $(window).on('scroll', syncNavbar);
  syncNavbar(); // also correct on load / refresh while already scrolled

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // Navbar dropdowns. Desktop opens on hover/focus via CSS and the parent
  // link navigates normally. On the mobile menu a tap toggles the sub-menu;
  // on touch screens wider than that, the first tap opens it and a second
  // tap follows the parent link.
  // --------------------------------------------------------------------
  var $dropdowns = $('.bumm-dropdown');
  function closeDropdowns($except) {
    $dropdowns.not($except || $()).removeClass('is-open')
      .children('.dropdown-toggle').attr('aria-expanded', 'false');
  }
  $dropdowns.children('.dropdown-toggle').on('click', function (e) {
    var $li = $(this).parent();
    var mobileNav = window.matchMedia('(max-width: 991.98px)').matches;
    var touch = window.matchMedia('(hover: none)').matches;
    if (!mobileNav && !touch) { return; }
    var open = $li.hasClass('is-open');
    if (mobileNav || !open) {
      e.preventDefault();
      closeDropdowns($li);
      $li.toggleClass('is-open', !open);
      $(this).attr('aria-expanded', String(!open));
    }
  });
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.bumm-dropdown').length) { closeDropdowns(); }
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDropdowns();
      var $focused = $(document.activeElement).closest('.bumm-dropdown');
      if ($focused.length) { $focused.children('.dropdown-toggle').trigger('focus'); document.activeElement.blur(); }
    }
  });

  // Light / dark mode toggle. The actual attribute (data-bumm-theme on
  // <html>) is already set as early as possible by the inline script in
  // <head> — before CSS renders — to avoid a flash of the wrong theme.
  // This just wires up the button and keeps localStorage in sync.
  // --------------------------------------------------------------------
  var $root = $(document.documentElement);
  var $toggle = $('.bumm-theme-toggle');

  function currentTheme() {
    return $root.attr('data-bumm-theme') === 'dark' ? 'dark' : 'light';
  }

  function reflectTheme(theme) {
    var isDark = theme === 'dark';
    $toggle
      .attr('aria-pressed', isDark ? 'true' : 'false')
      .attr('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
      .attr('data-label', isDark ? 'Light mode' : 'Dark mode')
      .find('i').attr('class', isDark ? 'bi bi-sun' : 'bi bi-moon-stars');
  }

  reflectTheme(currentTheme());

  $toggle.on('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    $root.attr('data-bumm-theme', next);
    try { localStorage.setItem('bumm-theme', next); } catch (e) { /* storage unavailable — theme still applies for this view */ }
    reflectTheme(next);
  });

});

// ----------------------------------------------------------------------
// Scroll reveal per section (homepage). Tanpa library: satu
// IntersectionObserver, hanya menambah kelas .is-in; animasinya murni CSS
// (opacity + translate). Dilewati jika <html> tidak punya .bumm-reveal
// (reduce motion / bukan homepage). Selector harus sama dengan custom.css.
// ----------------------------------------------------------------------
(function () {
  if (!document.documentElement.classList.contains('bumm-reveal')) return;

  var REVEAL_SELECTORS = [
    '.bumm-trusted .container',

    '.bumm-about-intro-copy',

    '.bumm-experience .col-lg-7',

    '.bumm-stat-card',

    '.bumm-about .col-lg-8',

    '.bumm-vb-card',

    '.bumm-cap-banner-text',

    '.bumm-cap-card',

    '.bumm-cert-strip',

    '.bumm-insp-card',

    '.bumm-products .col-lg-8',

    '.bumm-segment-card',

    '.bumm-cert-head',

    '.bumm-cert-card',

    '.bumm-contact-head',

    '.bumm-contact .col-lg-7',

    '.bumm-contact .col-lg-5',

    '.bumm-about-intro-media'
  ];

  var els = document.querySelectorAll(REVEAL_SELECTORS.join(','));
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
    return;
  }

  // Jeda bertingkat antar saudara sekandung (maks. 4 langkah) supaya kartu
  // dalam satu baris muncul berurutan, bukan serentak.
  var seen = new Map();
  for (var j = 0; j < els.length; j++) {
    var p = els[j].parentElement;
    var n = seen.get(p) || 0;
    seen.set(p, n + 1);
    if (n % 4) els[j].style.setProperty('--rv-d', (n % 4) * 80 + 'ms');
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  for (var k = 0; k < els.length; k++) io.observe(els[k]);
})();

// ----------------------------------------------------------------------
// Count-up angka statistik ("Built on Experience"). Berjalan sekali saat
// angka masuk viewport. Teks akhir sudah ada di HTML, jadi tanpa JS /
// reduce motion / tanpa IntersectionObserver angka tetap tampil benar.
// ----------------------------------------------------------------------
(function () {
  var els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function format(el, v) {
    var d = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
    var txt = v.toFixed(d);
    if (!el.hasAttribute('data-count-plain')) {
      var parts = txt.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      txt = parts.join('.');
    }
    return txt + (el.getAttribute('data-count-suffix') || '');
  }

  function run(el) {
    var to = parseFloat(el.getAttribute('data-count-to'));
    var dur = 1800;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = format(el, to * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(el, to);
    }
    requestAnimationFrame(step);
  }

  // Mulai dari 0 hanya setelah JS siap; hindari kedipan angka final.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      run(en.target);
    });
  }, { threshold: 0.4 });

  for (var i = 0; i < els.length; i++) {
    els[i].textContent = format(els[i], 0);
    io.observe(els[i]);
  }
})();


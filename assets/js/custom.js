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

  loadHeroVideo();

  // --------------------------------------------------------------------
  // Language switch — default English, persisted per visitor.
  // Add more keys here as you translate more sections of the site.
  // --------------------------------------------------------------------
  var translations = {
    en: {
      nav_home: 'Home',
      nav_career: 'Career',
      nav_about: 'About',
      nav_product: 'Product',
      nav_news: 'News',
      contact_us: 'Contact Us',
      hero_eyebrow_group: 'a subsidiary of Bakrie Autoparts',
      hero_headline: "“Made to cast, build to last.”",
      // Split across two lines in the hero so each line can take its own
      // type treatment (solid / outlined); hero_headline above stays as the
      // single-string version for any other surface that needs it.
      hero_headline_cast: 'Made to cast,',
      hero_headline_last: 'build to last.',
      hero_lead: 'From precision iron casting to high-performance components for automotive, heavy duty, agriculture and industrial applications.',
      btn_view_product: 'View Products',
      plate_title: 'Company Profile',
      plate_established_label: 'Established',
      plate_experience_label: 'Foundry Experience',
      plate_experience_value: '40+ years',
      plate_oem_label: 'OEM Partners',
      plate_parent_label: 'Parent Company',
      trusted_label: 'Trusted by',
      about_intro_eyebrow: 'About BUMM',
      about_intro_heading: 'More than just casting.',
      about_intro_cta: 'Learn About BUMM',
      experience_heading_1: 'Built On',
      experience_heading_2: 'Experience',
      experience_lead: 'Decades of commitment in delivering high quality iron casting solutions for a stronger, more sustainable industry',
      experience_stat_established: 'Established',
      experience_stat_ownership: 'Bakrie Autoparts ownership',
      experience_stat_years: 'Years Of Experience',
      experience_stat_capacity: 'Ton Installed Capacity',
      about_eyebrow: 'Our Values',
      about_heading: 'Built on seven operating principles.',
      about_lead: "PT. Bina Usaha Mandiri Mizusawa (BUMM) was established in 1983 and is a subsidiary of Bakrie Autoparts, based in Jatiuwung, Tangerang. We specialize in auto components and general casting — foundry manufacturing built to meet the demands of Indonesia's automotive and heavy-equipment industry.",
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
      cert_caption: 'Certification — confirm standard & number',
      product_eyebrow: 'Product',
      product_heading: 'Cast for the systems that keep running.',
      product_lead: 'Four categories of iron cast components, engineered and finished to the tolerances automotive and heavy-equipment production lines require.',
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
      news_view_all: 'View All News →',
      cta_heading: 'Looking for the best iron cast and foundry company?',
      cta_lead: 'Let us know — our team will get back to you.',
      contact_eyebrow: 'Contact',
      contact_heading: "Let's talk about your production needs.",
      contact_plate_title: 'Contact Details',
      contact_phone_label: 'Phone',
      contact_address_label: 'Address',
      contact_email_label: 'Email',
      contact_form_name: 'Name',
      contact_form_email: 'Email',
      contact_form_subject: 'Subject',
      contact_form_message: 'Message',
      contact_form_send: 'Send',
      footer_company: 'Company',
      footer_certification: 'Certification',
      footer_copyright: '© PT. Bina Usaha Mandiri Mizusawa. All rights reserved.'
    },
    id: {
      nav_home: 'Home',
      nav_career: 'Karier',
      nav_about: 'Tentang',
      nav_product: 'Produk',
      nav_news: 'Berita',
      contact_us: 'Hubungi Kami',
      hero_eyebrow_group: 'anak perusahaan Bakrie Autoparts',
      hero_headline: '“Dibuat untuk mengecor, dibangun untuk bertahan.”',
      hero_headline_cast: 'Dibuat untuk mengecor,',
      hero_headline_last: 'dibangun untuk bertahan.',
      hero_lead: 'Dari pengecoran besi presisi hingga komponen berperforma tinggi untuk aplikasi otomotif, alat berat, pertanian, dan industri.',
      btn_view_product: 'Lihat Produk',
      plate_title: 'Profil Perusahaan',
      plate_established_label: 'Berdiri Sejak',
      plate_experience_label: 'Pengalaman Foundry',
      plate_experience_value: '40+ tahun',
      plate_oem_label: 'Mitra OEM',
      plate_parent_label: 'Induk Usaha',
      trusted_label: 'Dipercaya oleh',
      about_intro_eyebrow: 'Tentang BUMM',
      about_intro_heading: 'Lebih dari sekadar mengecor.',
      about_intro_cta: 'Pelajari BUMM',
      experience_heading_1: 'Dibangun Dari',
      experience_heading_2: 'Pengalaman',
      experience_lead: 'Puluhan tahun komitmen dalam menghadirkan solusi iron casting berkualitas tinggi untuk industri yang lebih kuat dan berkelanjutan',
      experience_stat_established: 'Berdiri Sejak',
      experience_stat_ownership: 'Kepemilikan Bakrie Autoparts',
      experience_stat_years: 'Tahun Pengalaman',
      experience_stat_capacity: 'Ton Kapasitas Terpasang',
      about_eyebrow: 'Nilai Kami',
      about_heading: 'Dibangun di atas tujuh prinsip kerja.',
      about_lead: 'PT. Bina Usaha Mandiri Mizusawa (BUMM) berdiri sejak 1983 dan merupakan anak perusahaan Bakrie Autoparts, berlokasi di Jatiuwung, Tangerang. Kami berfokus pada komponen otomotif dan general casting — foundry manufacturing yang dibangun untuk memenuhi kebutuhan industri otomotif dan alat berat di Indonesia.',
      victory_v_desc: 'Melihat ke depan untuk mengantisipasi kebutuhan industri dan pelanggan berikutnya.',
      victory_i_desc: 'Melakukan hal yang benar secara konsisten, bahkan saat tidak ada yang mengawasi.',
      victory_c_desc: 'Setiap proses dibangun berdasarkan apa yang membuat operasional pelanggan berhasil.',
      victory_t_desc: 'Pekerjaan pengecoran yang kompleks hanya berjalan baik kalau seluruh tim solid.',
      victory_o_desc: 'Menyempurnakan proses itu sendiri, bukan cuma hasil akhirnya.',
      victory_v_title: 'Visioner',
      victory_i_title: 'Integritas',
      victory_c_title: 'Berorientasi Pelanggan',
      victory_t_title: 'Kerja Sama Tim',
      victory_o_title: 'Keunggulan Operasional',
      victory_r_title: 'Tanggung Jawab',
      victory_y_title: 'Orientasi Hasil',
      victory_r_desc: 'Bertanggung jawab atas hasil kerja — bagi karyawan, produk, dan lingkungan di sekitar pabrik.',
      victory_y_desc: 'Mengukur keberhasilan dari hasil nyata yang bisa dipakai — bukan sekadar aktivitas.',
      capability_eyebrow: 'Kapabilitas',
      capability_heading: 'Dibangun untuk memasok, bukan sekadar mencetak.',
      capability_lead: 'Dari prototipe satu unit hingga produksi rutin untuk OEM, foundry kami mendukung kebutuhan rantai pasok otomotif maupun general casting industri lainnya.',
      capability_1_title: 'Pemasok Langsung OEM',
      capability_1_desc: 'Memasok komponen cor langsung ke rantai pasok OEM otomotif dan alat berat.',
      capability_2_title: 'General & Custom Casting',
      capability_2_desc: 'Selain komponen otomotif, kami juga memproduksi general iron casting sesuai spesifikasi khusus untuk berbagai kebutuhan industri.',
      capability_3_title: 'Didukung Bakrie Autoparts',
      capability_3_desc: 'Bagian dari grup Bakrie Autoparts, memberi BUMM skala dan sumber daya grup industri yang mapan.',
      capability_4_title: 'Proses Mengutamakan Kualitas',
      capability_4_desc: 'Setiap batch melalui quality control internal sebelum keluar dari foundry.',
      cert_caption: 'Sertifikasi — konfirmasi standar & nomornya',
      product_eyebrow: 'Produk',
      product_heading: 'Dicor untuk sistem yang harus terus berjalan.',
      product_lead: 'Empat kategori komponen cor besi, dirancang dan diselesaikan sesuai toleransi yang dibutuhkan lini produksi otomotif dan alat berat.',
      product_1_desc: 'Housing dan komponen water pump hasil cor presisi untuk sistem pendingin otomotif.',
      product_2_desc: 'Komponen cor untuk sistem mesin diesel, dari housing hingga bagian struktural.',
      product_3_desc: 'Part cor besi heavy duty yang dirancang untuk mesin konstruksi dan industri.',
      product_4_desc: 'Komponen otomotif umum yang dicor sesuai spesifikasi OEM.',
      product_view_detail: 'Lihat Detail →',
      btn_view_all_products: 'Lihat Semua Produk',
      achievement_eyebrow: 'Pencapaian',
      achievement_heading: 'Diakui oleh OEM yang kami pasok.',
      achievement_lead: 'Rekam jejak apresiasi dari mitra otomotif dan alat berat jangka panjang — bukan klaim marketing, tapi pengakuan yang diberikan atas performa nyata.',
      news_eyebrow: 'Berita & Aktivitas',
      news_heading: 'Kabar terbaru dari foundry kami.',
      news_view_all: 'Lihat Semua Berita →',
      cta_heading: 'Mencari perusahaan iron cast dan foundry terbaik?',
      cta_lead: 'Beri tahu kami — tim kami akan segera menghubungi Anda kembali.',
      contact_eyebrow: 'Kontak',
      contact_heading: 'Mari bicarakan kebutuhan produksi Anda.',
      contact_plate_title: 'Detail Kontak',
      contact_phone_label: 'Telepon',
      contact_address_label: 'Alamat',
      contact_email_label: 'Email',
      contact_form_name: 'Nama',
      contact_form_email: 'Email',
      contact_form_subject: 'Subjek',
      contact_form_message: 'Pesan',
      contact_form_send: 'Kirim',
      footer_company: 'Perusahaan',
      footer_certification: 'Sertifikasi',
      footer_copyright: '© PT. Bina Usaha Mandiri Mizusawa. Hak cipta dilindungi.'
    }
  };

  var LANG_STORAGE_KEY = 'bumm-lang';
  var DEFAULT_LANG = 'en';

  function applyLanguage(lang) {
    var dict = translations[lang] || translations[DEFAULT_LANG];
    $('[data-i18n]').each(function () {
      var key = $(this).data('i18n');
      if (dict[key] !== undefined) {
        $(this).text(dict[key]);
      }
    });
    $('.bumm-lang-btn').removeClass('is-active').attr('aria-pressed', 'false');
    $('.bumm-lang-btn[data-lang="' + lang + '"]').addClass('is-active').attr('aria-pressed', 'true');
    document.documentElement.setAttribute('lang', lang);
  }

  var savedLang = null;
  try {
    savedLang = window.localStorage.getItem(LANG_STORAGE_KEY);
  } catch (e) {
    // localStorage unavailable (privacy mode, etc.) — fall back to default.
  }
  applyLanguage(savedLang || DEFAULT_LANG);

  $('.bumm-lang-btn').on('click', function () {
    var lang = $(this).data('lang');
    applyLanguage(lang);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      // ignore if storage isn't available
    }
  });

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
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 8) {
      $nav.addClass('is-scrolled');
    } else {
      $nav.removeClass('is-scrolled');
    }
  });

  // --------------------------------------------------------------------
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

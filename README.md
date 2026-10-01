# PT BUMM — Company Profile Website

Situs statis berbasis **Jekyll** (dibangun otomatis oleh GitHub Pages) + Bootstrap 5.3.8,
Bootstrap Icons 1.13.1, dan jQuery 4.

## Struktur

```
_config.yml              Konfigurasi: baseurl, domain produksi, OG image default
_data/navigation.yml     Daftar menu navbar & footer (satu tempat)
_layouts/default.html    Kerangka halaman: head + navbar + <main> + footer + scripts
_includes/
  head.html              <head>: meta, SEO, Open Graph, CSS, JSON-LD
  navbar.html            Navbar (menu aktif otomatis dari front matter `nav`)
  footer.html            Footer (+ peta lokasi bila `footer_map: true`)
  scripts.html           jQuery, Bootstrap, custom.js
  schema-organization.html  JSON-LD Organization (beranda)

index.html               Beranda        ┐
about/*/index.html       About          │ hanya front matter + isi <main>
product/*.html           Produk         │
career/  news/           Career, News   ┘
Project/dashboard/       Halaman internal (statis, tanpa layout, tidak di-index)
assets/                  css, js, img, bootstrap, jquery
```

## Menambah halaman baru

Buat file mis. `about/history/index.html`:

```html
---
layout: default
title: "History — PT BUMM"
description: "Deskripsi singkat untuk SEO."
nav: about                      # menu yang ditandai aktif (home/career/about/product/news)
breadcrumb:                     # opsional, untuk JSON-LD BreadcrumbList
  - { name: "Home", url: "/" }
  - { name: "History", url: "/about/history/" }
---
<header class="bumm-page-header"> ... </header>
<section> ... isi halaman ... </section>
```

Navbar, footer, `<head>`, dan script otomatis ikut dari layout.

### Field front matter

| Field | Fungsi |
|---|---|
| `title`, `description` | `<title>`, meta description, Open Graph, Twitter |
| `nav` | id menu aktif (`career`, `about`, `product`, `news`); kosongkan di beranda |
| `og_image` | gambar share khusus (path dari root, mis. `/assets/img/x.png`) |
| `og_description`, `twitter_description` | jika berbeda dari `description` |
| `robots` | mis. `"noindex, follow"` (default `index, follow`) |
| `navbar_overlay: true` | navbar transparan di atas hero (beranda) |
| `footer_map: true` | footer versi lengkap dengan peta lokasi (beranda) |
| `breadcrumb`, `product` | data JSON-LD (BreadcrumbList, Product) |

## Mengubah menu

Edit `_data/navigation.yml`. Item `hidden: true` disembunyikan (saat ini **News**,
karena halamannya masih placeholder). Ubah ke `false`/hapus barisnya untuk menampilkan.

## Aturan link

- Di dalam konten, link & aset ditulis dengan filter `relative_url`:
  `href="{{ '/career/' | relative_url }}"` dan `src="{{ '/assets/img/x.webp' | relative_url }}"`.
  Jangan menulis `/career` atau `/assets/...` mentah — itu yang membuat 404 di GitHub Pages.
- Folder diakhiri `/` (`/product/`); file tunggal pakai ekstensi (`/product/diesel.html`).
- Nama file case-sensitive di GitHub Pages.

## Pindah ke domain sendiri (bumm.co.id)

Di `_config.yml`:

```yaml
url: "https://bumm.co.id"
baseurl: ""
```

## Preview lokal (opsional)

Butuh Ruby. Lalu:

```
bundle install
bundle exec jekyll serve
```

Buka http://localhost:4000/BUMM/ (sesuai `baseurl`). Tanpa preview lokal pun bisa:
cukup push, GitHub Pages yang membangun.

## Deploy

Settings → Pages → Deploy from a branch → `main` / `(root)`.
**Jangan** menambahkan file `.nojekyll` — itu mematikan Jekyll dan layout tidak akan jalan.

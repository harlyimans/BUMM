# PT BUMM — Company Profile Website

Situs statis murni: HTML + CSS + JavaScript, dengan Bootstrap 5.3.8,
Bootstrap Icons 1.13.1, dan jQuery 4. Tidak butuh Ruby, Jekyll, maupun build step apa pun.

## Struktur

```
index.html               Beranda
about/*/index.html       About (company-profile, vision-mission, corporate-value, management)
product/*.html           Produk
career/  news/           Career, News
Project/dashboard/       Halaman internal (statis, tidak di-index)
assets/                  css, js, img, bootstrap, jquery
robots.txt  sitemap.xml  SEO
.nojekyll                Matikan Jekyll di GitHub Pages (situs disajikan apa adanya)
```

Navbar, footer, dan `<head>` kini ditulis langsung di setiap halaman. Kalau mengubah menu
atau footer, edit di semua file `.html` (cari `class="navbar` dan `class="bumm-footer"`).

## Aturan link

- Semua link dan aset memakai **path relatif** sesuai kedalaman folder halaman:
  - dari root (`index.html`): `career/`, `assets/img/x.webp`
  - dari `career/index.html`: `../`, `../assets/img/x.webp`
  - dari `about/xxx/index.html`: `../../`, `../../assets/img/x.webp`
- Dengan path relatif, situs jalan di GitHub Pages (`/BUMM/`), di domain sendiri, atau
  di folder mana pun tanpa pengaturan `baseurl`.
- Folder diakhiri `/` (`product/`); file tunggal pakai ekstensi (`product/diesel.html`).
- Nama file case-sensitive di GitHub Pages.

## Meta SEO

Canonical, Open Graph, dan JSON-LD memakai domain produksi `https://bumm.co.id`
(ditulis langsung di `<head>` tiap halaman). Kalau domain berubah, cari-ganti
`https://bumm.co.id` di seluruh file, termasuk `robots.txt` dan `sitemap.xml`.

## Preview lokal

Buka `index.html` langsung di browser, atau jalankan server statis apa saja, mis.:

```
python3 -m http.server 8000
```

Lalu buka http://localhost:8000/

## Deploy

Settings → Pages → Deploy from a branch → `main` / `(root)`.
File `.nojekyll` sebaiknya tetap ada.

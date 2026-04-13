# VSE JE TU

Statična večstranska spletna stran za GitHub Pages + Supabase obrazce.

## Kaj je vključeno

- landing page / domov
- e-shop za spominke
- e-shop za 3D izdelke
- turizem in vodene ture
- sodelovanje
- kontaktna stran
- basket / povpraševanje flow prek `localStorage`
- Supabase schema za obrazce
- SEO osnova: meta tags, Open Graph, robots, sitemap, manifest, structured data
- mobile-first responsive dizajn

## Struktura projekta

```text
vse-je-tu/
├─ index.html
├─ spominki.html
├─ 3d-izdelki.html
├─ turizem.html
├─ sodelovanje.html
├─ kontakt.html
├─ 404.html
├─ robots.txt
├─ sitemap.xml
├─ site.webmanifest
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ img/
│  │  ├─ favicon.svg
│  │  └─ og-image.svg
│  └─ js/
│     ├─ config.js
│     ├─ config.example.js
│     ├─ supabase-client.js
│     ├─ main.js
│     └─ forms.js
└─ supabase/
   └─ schema.sql
```

## 1) Lokalni test

Na Windows lahko odpreš mapo in dvojno klikneš `index.html`, ampak priporočam lokalni server.

### Opcija A — VS Code Live Server
1. Odpri mapo v VS Code.
2. Namesti razširitev **Live Server**.
3. Desni klik na `index.html`.
4. Klikni **Open with Live Server**.

### Opcija B — Python lokalni server
Če imaš Python:

```bash
cd vse-je-tu
python -m http.server 5500
```

Potem odpri:

```text
http://localhost:5500
```

## 2) GitHub repo + GitHub Pages

### Ustvari repo
1. Na GitHub ustvari nov repository, npr. `vse-je-tu`.
2. Prenesi to mapo v repo.

### Git ukazi

```bash
git init
git add .
git commit -m "Initial VSE JE TU website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Vklop GitHub Pages
1. Pojdi v **Settings** repoja.
2. Odpri **Pages**.
3. Pod **Build and deployment** izberi:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Shrani.

GitHub bo objavil stran na svojem Pages URL-ju.

## 3) Supabase nastavitev

### Ustvari projekt
1. Odpri Supabase.
2. Ustvari nov projekt.
3. Ko je projekt ustvarjen, odpri **SQL Editor**.
4. Kopiraj vse iz `supabase/schema.sql`.
5. Zaženi SQL.

### Dobi URL in anon key
1. Odpri **Project Settings**.
2. Odpri **API**.
3. Kopiraj:
   - Project URL
   - public anon key

### Vpiši v config
Odpri datoteko:

```text
assets/js/config.js
```

Zamenjaj vsebino z:

```js
window.VSETU_SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
window.VSETU_SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";
window.VSETU_SITE_URL = "https://YOUR-DOMAIN.si";
```

## 4) Kaj dela obrazec

- Če je `config.js` izpolnjen, se obrazci shranijo v Supabase.
- Če `config.js` ni izpolnjen, se odpre mailto fallback na `maj@klemenc.org`.

## 5) Menjava vsebine

### Kontakt podatki
Povsod so trenutno:
- Maj Klemenc
- `maj@klemenc.org`
- `031/628-462`
- `Trubarjeva ulica 14`

Če jih želiš spremeniti:
- odpri vse `.html` datoteke
- poišči te vrednosti
- zamenjaj

### Menjava kartic izdelkov
Odpri:
- `spominki.html`
- `3d-izdelki.html`
- `turizem.html`

Vsaka kartica ima:
- naslov
- opis
- meta pillse
- ceno
- gumb `data-add-to-cart`

## 6) SEO popravki po objavi

Ko boš imel končno domeno:
1. zamenjaj `https://vsejetu.si` v:
   - vseh `.html` datotekah, kjer je canonical / OG URL
   - `assets/js/config.js`
   - `robots.txt`
   - `sitemap.xml`

## 7) Kaj lahko nadgradiš naprej

- dodaš realne fotografije izdelkov
- dodaš Stripe checkout
- dodaš admin nadzor za izdelke
- dodaš blog / novice
- dodaš več jezikov
- dodaš dejanski booking calendar

## 8) Hiter QA pred objavo

- preveri vse menijske povezave
- testiraj dodajanje v povpraševanje
- testiraj oddajo obrazca
- preveri telefon in email linke
- preveri mobile pogled
- po objavi testiraj canonical, robots in sitemap
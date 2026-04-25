# Kütyű Műhely — Kollekció 2026

Prémium, enyhén abszurd, editorial hangulatú bemutató oldal a világ
legfeleslegesebb hétköznapi kütyűiről. Iskolai projekt — statikus HTML,
külső keretrendszer nélkül.

## Oldalak

- `index.html` — főoldal (masthead, kiáltvány, négy kollekció, easter egg)
- `mentett.html` — mentett kütyűk (localStorage, fizetés szándékosan tiltva)
- `hirlevel.html` — hírlevél-feliratkozás és termékjavaslat

## Futtatás

Nincs build-lépés. Bármelyik statikus szerverrel megnyitható, pl.:

```bash
python3 -m http.server 8000
# majd: http://localhost:8000/
```

## Deploy

- **GitHub Pages** — töltsd fel a repo gyökerét, minden útvonal relatív.
- **Vercel / Netlify** — "static site" preset, publish directory: repo root.

## Struktúra

```
.
├── index.html
├── mentett.html
├── hirlevel.html
├── assets/
│   ├── system.css   # közös design system (noir / editorial paletta)
│   ├── app.js       # mentés localStorage + reveal-on-scroll + toast
│   ├── data.js      # kütyü-adatok (négy kollekció)
│   └── images/      # termékfotók (slug.jpg) — lásd assets/images/README.md
└── public/
    └── favicon.svg
```

## Új kütyü hozzáadása

`assets/data.js` — add hozzá a megfelelő kollekció tömbjéhez:

```js
{
  slug: 'egyedi-slug',
  name: 'Név',
  slogan: 'Prémium szlogen.',
  what: 'Mi ez?',
  silly: 'Miért tűnik teljes hülyeségnek?',
  genius: 'Mikor derül ki, hogy mégis zseniális?',
  features: ['Funkció 1', 'Funkció 2'],
  badges: ['Címke 1', 'Címke 2'],
  review: { quote: 'Idézet.', author: 'Szerző' },
}
```

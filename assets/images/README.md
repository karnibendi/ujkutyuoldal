# Termékképek

Tedd ide a kütyük termékfotóit. A fájlnév kötelezően a kütyü `slug`-ja
legyen (`assets/data.js`-ben szerepel). **Bármelyik extension működik** —
a renderer ebben a sorrendben próbálkozik: `.png` → `.jpg` → `.jpeg` →
`.webp`. Vegyíthető is, kütyűnként más-más formátum.

## Aktuális slug-ok

```
pizza-ollo
spagetti-mero
jegkocka
avokado-kes
wc-papir-tarto
fogkrem-adagolo
habos-szappan
zokni-rendezo
mini-zseblampa
cuccfogo
kabel-rendezo
pomodoro-kocka
monitor-led
```

Pl. ha a Geminivel `pizza-ollo.png`-t generáltál, csak dobd ide — semmit
nem kell átírni.

## Hogyan működik a fallback

1. A renderer beilleszt egy `<img src="assets/images/<slug>.png">`-et.
2. Ha a `.png` nem létezik, a böngésző `onerror`-t dob, és a script
   automatikusan átvált `.jpg`-re, majd `.jpeg`-re, végül `.webp`-re.
3. Ha egyik se találat, az `<img>` elrejtődik, és a sávozott
   „Termékfotó · Név" placeholder marad. Nincs törött ikon.

## Ajánlott méret

- **Arány**: 4:5 (portré) — a kártya magasabb, mint széles.
- **Felbontás**: legalább 1200×1500px (retina-barát).
- **Tömörítés**: 200–400 KB / kép. Nagyobb fájlok lassítják az oldalt.
  PNG-nél érdemes [tinypng](https://tinypng.com)-vel átengedni.
- Egyedi path/extension: `assets/data.js`-ben add hozzá az adott
  kütyűhöz `image: 'valami/teljes/path.gif'` mezőt — ez felülírja a
  konvenciót, és csak ezt az egy URL-t próbálja.

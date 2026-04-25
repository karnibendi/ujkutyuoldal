# Termékképek

Tedd ide a kütyük termékfotóit. A fájlnév kötelezően a kütyü `slug`-ja
legyen (`assets/data.js`-ben szerepel), `.jpg` kiterjesztéssel.

## Aktuális slug-ok

```
pizza-ollo.jpg
spagetti-mero.jpg
jegkocka.jpg
avokado-kes.jpg
wc-papir-tarto.jpg
fogkrem-adagolo.jpg
habos-szappan.jpg
zokni-rendezo.jpg
mini-zseblampa.jpg
cuccfogo.jpg
kabel-rendezo.jpg
pomodoro-kocka.jpg
monitor-led.jpg
```

## Hogyan jelenik meg

A renderer minden kütyühöz beilleszt egy `<img>`-et erre a path-ra. Ha a
fájl nincs ott, a böngésző kidobja (`onerror`), és visszaesik a sávozott
„Termékfotó · Név" placeholderre — semmi nem törik el.

## Ajánlott méret

- **Arány**: 4:5 (portré) — a kártya magasabb, mint széles.
- **Felbontás**: legalább 1200×1500px (retina-barát).
- **Tömörítés**: 70–80% jpeg, 200–400 KB / kép. Nagyobb fájlok lassítják az oldalt.
- Ha más kiterjesztést szeretnél (`.png`, `.webp`), nyisd meg az
  `assets/data.js`-t és add hozzá `image: 'assets/images/foo.webp'` mezőt
  ahhoz a kütyűhöz — ez felülírja a slug-os konvenciót.

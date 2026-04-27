/* ============================================================================
   KÜTYÜ MŰHELY — shared client logic
   - saved items (localStorage)
   - reveal-on-scroll
   - nav active state
   - toast
   ========================================================================== */

(function () {
  const SAVED_KEY = 'kutyu.saved.v1';
  const isEnglish = document.documentElement.lang?.toLowerCase().startsWith('en');
  const i18n = {
    city: isEnglish ? 'Budapest, Atrium studio' : 'Budapest, Átrium studio',
    updated: isEnglish ? 'Updated: 2026-04-20' : 'Frissítve: 2026.04.20.',
    heroTitleA: isEnglish ? 'Gadgets' : 'Kütyük',
    heroTitleB: isEnglish ? 'you never knew' : 'amikről nem tudtad,',
    heroTitleC: isEnglish ? 'you needed' : 'hogy kellenek',
    heroLabel: isEnglish ? 'Editorial introduction' : 'Szerkesztőségi bevezető',
    heroLead: isEnglish
      ? 'Thirteen objectively unnecessary tools. Thirteen lifestyle shifts that last forever. One website taking itself way too seriously.'
      : 'Tizenhárom objektíven felesleges eszköz. Tizenhárom életen át tartó életmódváltás. Egy weboldal, amely kétségbeesetten komolyan veszi önmagát.',
    heroSig: isEnglish ? '— THE EDITORIAL TEAM' : '— A SZERKESZTŐSÉG',
    principles: isEnglish ? 'Principles' : 'Alapelveink',
    pages: isEnglish ? 'Pages' : 'Oldalak',
    noteNewsletter: isEnglish
      ? 'Demo form: no external data transfer, no real subscription. Feedback happens locally.'
      : 'Demo űrlap: nincs külső adatküldés, nincs valódi feliratkozás. A visszajelzés helyben születik.',
    noteSuggest: isEnglish
      ? 'Suggestions stay in this browser only. No real submission, just a premium illusion.'
      : 'A javaslat csak ebben a böngészőben kerül a falra. Nincs valódi beküldés, csak prémium illúzió.',
    required: isEnglish
      ? 'Something is missing · please check the required fields'
      : 'Hiányzik valami · nézd át a kötelező mezőket',
    clearConfirm: isEnglish
      ? 'Confirm clearing · click once more'
      : 'Törlés megerősítése · kattints még egyszer',
    clearButtonArmed: isEnglish
      ? 'One more click and the list is empty<span class="arrow"></span>'
      : 'Még egy kattintás, és üres a lista<span class="arrow"></span>',
    clearButtonIdle: isEnglish
      ? 'Remove all<span class="arrow"></span>'
      : 'Mindet eltávolít<span class="arrow"></span>',
    clearDone: isEnglish ? 'Wishlist cleared' : 'A kívánságlista kiürítve',
  };

  window.KutyuStore = {
    get() {
      try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
      catch { return []; }
    },
    set(arr) {
      localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
      this._notify();
    },
    has(slug) { return this.get().includes(slug); },
    toggle(slug) {
      const arr = this.get();
      const i = arr.indexOf(slug);
      if (i >= 0) { arr.splice(i, 1); }
      else { arr.push(slug); }
      this.set(arr);
      return i < 0; // true if added
    },
    remove(slug) {
      this.set(this.get().filter(s => s !== slug));
    },
    clear() { this.set([]); },
    count() { return this.get().length; },
    _listeners: [],
    onChange(fn) { this._listeners.push(fn); },
    _notify() { this._listeners.forEach(fn => { try { fn(this.get()); } catch (e) {} }); },
  };

  function normalizeGadgetCopy() {
    const collections = window.GADGETS?.collections || [];
    collections.forEach(collection => {
      (collection.gadgets || []).forEach(gadget => {
        if (gadget.name === 'Habos szappanadagoló') gadget.name = 'Szappanhab adagoló';
      });
    });
    if (Array.isArray(window.GADGETS_FLAT)) {
      window.GADGETS_FLAT.forEach(gadget => {
        if (gadget.name === 'Habos szappanadagoló') gadget.name = 'Szappanhab adagoló';
      });
    }
  }
  normalizeGadgetCopy();

  function localizeDataForEnglish() {
    if (!isEnglish || !window.GADGETS?.collections) return;

    const collectionCopy = {
      konyhai: {
        title: 'Kitchen gadgets',
        subtitle: 'The Kitchen Collection',
        lead: 'Cooking is no longer art — it is precision engineering. You can technically eat without these tools, but why live like that?',
      },
      furdoszobai: {
        title: 'Bathroom gadgets',
        subtitle: 'The Ritual Collection',
        lead: 'The bathroom is not a room. It is a mood, a ritual, a platform. These products help you take that very seriously.',
      },
      eletmento: {
        title: 'Unexpected tiny lifesavers',
        subtitle: 'The Everyday Collection',
        lead: 'These are the products you never planned to buy. Then you did. Now you talk about them like you invented them in lockdown.',
      },
      iroda: {
        title: 'Office & productivity',
        subtitle: 'The Focus Collection',
        lead: 'Work is ritual. The monitor is a shrine. The mug coaster is now a life philosophy. These tools let you take yourself seriously at 7:30 AM.',
      },
    };

    const gadgetCopy = {
      'pizza-ollo': {
        name: 'Pizza scissors', slogan: 'Precision slicing. Zero topping loss.', price: 'Questionably expensive',
        what: 'A dedicated scissor built for pizza cutting, with a heavier blade and a very confident price tag.',
        silly: 'A knife already works. A pizza wheel already works. This is dramatic overkill in premium packaging.',
        genius: 'When toppings stop sliding and slices finally stay intact, you suddenly understand why this exists.',
      },
      'spagetti-mero': {
        name: 'Spaghetti measurer', slogan: 'Carb math, finally objective.', price: 'Reasonable if you avoid overthinking',
        what: 'A plate with portion holes that tells you exactly how much dry pasta to cook.',
        silly: 'You can weigh pasta in grams — or just eyeball it like everyone has for decades.',
        genius: 'No more overcooking for four and eating leftovers for three days straight.',
      },
      jegkocka: {
        name: 'Extreme ice mold', slogan: 'Even ice can be art.', price: 'Great as a gift',
        what: 'A silicone mold for diamond, skull, rose, and sculpture-shaped ice cubes.',
        silly: 'Ice melts while you are still posting it. A normal cube cools drinks just fine.',
        genius: 'One dramatic cube in a glass can instantly upgrade the whole evening.',
      },
      'avokado-kes': {
        name: 'Avocado knife set', slogan: 'Three blades. One fruit. A full lifestyle.', price: 'Brunch-compatible',
        what: 'A three-piece set for cutting, pitting, and slicing avocados — and almost nothing else.',
        silly: 'A regular knife and spoon can do the same job at zero extra cost.',
        genius: 'If you make avocado toast often, this removes the daily micro-chaos.',
      },
      'wc-papir-tarto': {
        name: 'Toilet roll + phone holder', slogan: 'Hygiene infrastructure for the mobile era.', price: 'Home-office investment',
        what: 'A wall-mounted holder that gives your toilet paper and your phone one shared docking area.',
        silly: 'People survived by placing phones on random surfaces for years.',
        genius: 'In hybrid-work reality, this tiny tray can feel weirdly mission-critical.',
      },
      'fogkrem-adagolo': {
        name: 'Automatic toothpaste dispenser', slogan: 'Zero-touch hygiene, maximum style.', price: 'Worth it before coffee',
        what: 'A wall unit that dispenses a consistent amount of toothpaste with one push.',
        silly: 'Squeezing a tube is not exactly a problem technology needed to solve.',
        genius: 'At 7 AM, one less tiny decision can feel like genuine progress.',
      },
      'habos-szappan': {
        name: 'Foaming soap dispenser', slogan: 'Soap, but in executive form.', price: 'Guest-ready price tier',
        what: 'A pump that turns diluted liquid soap into rich foam.',
        silly: 'Your hands can make foam on their own, free of charge.',
        genius: 'Guests press once, see foam, and instantly think your home is upgraded.',
      },
      'zokni-rendezo': {
        name: 'Sock organizer', slogan: 'The final answer to sock chaos.', price: 'Morning-panic prevention',
        what: 'A drawer insert with separate cells for each pair of socks.',
        silly: 'Socks already lived in drawers before this product existed.',
        genius: 'Dark mornings get easier when every pair has a fixed location.',
      },
      'mini-zseblampa': {
        name: 'Mini keychain flashlight', slogan: 'Pocket safety. Room-level light.', price: 'Price of peace of mind',
        what: 'A tiny rechargeable LED light that hangs on your keychain.',
        silly: 'Your phone has a flashlight too, and you already carry it.',
        genius: 'When your phone is nearly dead, this backup light becomes the hero.',
      },
      cuccfogo: {
        name: 'Bedside pocket caddy', slogan: 'The age of the nightstand is over.', price: 'Mattress-level investment',
        what: 'A fabric or faux-leather pocket that tucks under your mattress edge.',
        silly: 'Nightstands solved this in the 17th century and still work.',
        genius: 'No more fishing your phone out from the gap beside the bed at 2 AM.',
      },
      'kabel-rendezo': {
        name: 'Magnetic cable organizer', slogan: 'At last, organized chaos.', price: 'Surprisingly affordable',
        what: 'Small clips that keep charging and peripheral cables fixed at desk level.',
        silly: 'A rubber band can imitate this for almost nothing.',
        genius: 'When your cable is always where your hand expects it, desk life improves fast.',
      },
      'pomodoro-kocka': {
        name: 'Pomodoro timer cube', slogan: 'Your focus, now in physical form.', price: 'Deep-work premium',
        what: 'A physical timer cube with preset durations on each face.',
        silly: 'Phones and laptops already include timers, plus reminders.',
        genius: 'Turning a real object can reduce distractions and trigger instant focus.',
      },
      'monitor-led': {
        name: 'Monitor light bar', slogan: 'Less glare. More pro energy.', price: 'Ergonomics surcharge',
        what: 'A clip-on lamp that illuminates the desk without shining into your eyes.',
        silly: 'Most rooms already have ceiling lights for this job.',
        genius: 'Evening work becomes less tiring when contrast and glare are controlled.',
      },
    };

    window.GADGETS.collections.forEach(collection => {
      const copy = collectionCopy[collection.id];
      if (copy) Object.assign(collection, copy);
      (collection.gadgets || []).forEach(gadget => {
        const gCopy = gadgetCopy[gadget.slug];
        if (gCopy) Object.assign(gadget, gCopy);
      });
    });

    window.GADGETS_FLAT = window.GADGETS.collections.flatMap(c =>
      c.gadgets.map(g => ({ ...g, collection: c.title, collectionId: c.id, collectionNumber: c.number }))
    );
  }
  localizeDataForEnglish();

  function updateNavCount() {
    document.querySelectorAll('[data-saved-count]').forEach(el => {
      el.textContent = String(KutyuStore.count()).padStart(2, '0');
    });
  }
  KutyuStore.onChange(updateNavCount);
  document.addEventListener('DOMContentLoaded', updateNavCount);

  // Reveal on scroll
  function setupReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-stagger');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach(el => io.observe(el));
  }
  document.addEventListener('DOMContentLoaded', setupReveal);

  // Toast
  let toastEl = null;
  let toastTimer = null;
  window.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.replaceChildren();
    const dot = document.createElement('span');
    dot.className = 'dot';
    const text = document.createElement('span');
    text.textContent = msg;
    toastEl.append(dot, text);
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  // Mobile nav
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.nav__burger');
    if (!nav || !burger) return;

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'main-nav');
    const center = nav.querySelector('.nav__center');
    if (center && !center.id) center.id = 'main-nav';

    function setMenu(open) {
      nav.classList.toggle('nav--menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    burger.addEventListener('click', () => setMenu(!nav.classList.contains('nav--menu-open')));
    nav.querySelectorAll('.nav__center a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
  });

  function ensureHomeHero() {
    const anchor = document.getElementById('kollekciok') || document.getElementById('collections-root');
    if (!anchor) return;

    const section = document.querySelector('.hero') || document.createElement('section');
    section.className = 'hero shell';
    section.id = 'masthead';
    section.setAttribute('aria-labelledby', 'home-hero-title');
    section.innerHTML = `
      <div class="hero__meta">
          <span>№ 01 · Masthead</span>
        <div class="hero__meta-right">
          <span>${i18n.city}</span>
          <span>${i18n.updated}</span>
        </div>
      </div>
      <div class="hero__grid">
        <div class="hero__head">
          <h1 class="hero__title" id="home-hero-title">
            <span class="hero__title-word"><span>${i18n.heroTitleA}</span></span>
            <span class="hero__title-word italic"><span>${i18n.heroTitleB}</span></span>
            <span class="hero__title-word"><span>${i18n.heroTitleC}</span></span>
          </h1>
          <aside class="hero__pull" aria-label="${i18n.heroLabel}">
            <p style="color: var(--ink-mute); font-size: clamp(15px, 1.35vw, 17px); line-height: 1.42;">${i18n.heroLead}<em style="color: var(--ink-mute); text-transform: uppercase; letter-spacing: 0.22em;">${i18n.heroSig}</em></p>
          </aside>
        </div>
      </div>
    `;
    anchor.before(section);
  }

  // Static-export routing polish: keep the full principles page separate, while
  // the home page opens with the editorial masthead before the collections.
  document.addEventListener('DOMContentLoaded', () => {
    const principlesHref = isEnglish ? 'alapelveink-en.html' : 'alapelveink.html';
    const homeHref = isEnglish ? 'index-en.html' : 'index.html';
    document.querySelectorAll('a[href="#manifesto"], a[href="index.html#manifesto"], a[href="index-en.html#manifesto"]').forEach(link => {
      link.setAttribute('href', principlesHref);
      if (link.textContent.trim() === 'Kiáltvány' || link.textContent.trim() === 'Manifesto') {
        link.textContent = i18n.principles;
      }
    });

    document.querySelectorAll('.foot__col').forEach(col => {
      if (col.querySelector('h4')?.textContent.trim() !== i18n.pages) return;
      if (col.querySelector(`a[href="${principlesHref}"]`)) return;
      const home = col.querySelector(`a[href="${homeHref}"]`)?.closest('li');
      if (!home) return;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = principlesHref;
      link.textContent = i18n.principles;
      item.append(link);
      home.after(item);
    });

    const isHome = document.body?.dataset.screenLabel === '01 Főoldal' || document.body?.dataset.screenLabel === '01 Home';
    if (!isHome) return;
    document.querySelector('.home-principle')?.remove();
    document.querySelector('.manifesto')?.remove();
    document.querySelector('.breaker')?.remove();
    document.querySelector('.final-cta')?.remove();
    ensureHomeHero();
  });

  // Static-export polish: add demo/privacy notes and validation without touching
  // every exported HTML file.
  document.addEventListener('DOMContentLoaded', () => {
    const newsletter = document.getElementById('newsletter-form');
    if (newsletter && !newsletter.querySelector('.form-note')) {
      const note = document.createElement('p');
      note.className = 'form-note';
      note.textContent = i18n.noteNewsletter;
      newsletter.querySelector('.submit')?.before(note);
    }

    const suggest = document.getElementById('suggest-form');
    if (suggest && !suggest.querySelector('.form-note')) {
      const note = document.createElement('p');
      note.className = 'form-note';
      note.textContent = i18n.noteSuggest;
      suggest.querySelector('.submit')?.before(note);
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.id !== 'newsletter-form' && form.id !== 'suggest-form') return;
    if (form.checkValidity()) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    form.reportValidity();
    toast(i18n.required);
  }, true);

  // Copy polish: keep the product and newsletter phrasing elevated.
  document.addEventListener('DOMContentLoaded', () => {
    const oldUpper = 'Küty\u0171';
    const oldLower = 'küty\u0171';
    document.title = document.title.replaceAll(oldUpper, 'Kütyü').replaceAll(oldLower, 'kütyü');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node = walker.nextNode();
    while (node) {
      if (
        node.nodeValue.includes('Miért hülye?') ||
        node.nodeValue.includes('25 000 Ft felett') ||
        node.nodeValue.includes('Habos szappanadagoló') ||
        node.nodeValue.includes(oldUpper) ||
        node.nodeValue.includes(oldLower)
      ) {
        nodes.push(node);
      }
      node = walker.nextNode();
    }
    nodes.forEach(textNode => {
      textNode.nodeValue = textNode.nodeValue
        .replaceAll('Miért hülye?', 'Miért abszurd?')
        .replaceAll('25 000 Ft felett', '2 500 000 Ft felett')
        .replaceAll('Habos szappanadagoló', 'Szappanhab adagoló')
        .replaceAll(oldUpper, 'Kütyü')
        .replaceAll(oldLower, 'kütyü');
    });
  });

  // Replace the native confirm dialog on the wishlist with an in-page two-click
  // confirmation that keeps the editorial feel intact.
  let clearArmed = false;
  let clearTimer = null;
  document.addEventListener('click', (e) => {
    const clearBtn = e.target.closest('#clear-all');
    if (!clearBtn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (!clearArmed) {
      clearArmed = true;
      clearBtn.classList.add('confirming');
      clearBtn.innerHTML = i18n.clearButtonArmed;
      toast(i18n.clearConfirm);
      clearTimer = setTimeout(() => {
        clearArmed = false;
        clearBtn.classList.remove('confirming');
        clearBtn.innerHTML = i18n.clearButtonIdle;
      }, 3600);
      return;
    }

    clearTimeout(clearTimer);
    clearArmed = false;
    KutyuStore.clear();
    toast(i18n.clearDone);
  }, true);

  // Details modal focus polish, layered over the page-specific modal code.
  let detailsReturnFocus = null;
  document.addEventListener('click', (e) => {
    const detailsBtn = e.target.closest('.details-btn');
    if (detailsBtn) {
      detailsReturnFocus = detailsBtn;
      setTimeout(() => document.querySelector('.details-card__close')?.focus(), 0);
    }
  }, true);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-close]')) return;
    setTimeout(() => {
      if (detailsReturnFocus && typeof detailsReturnFocus.focus === 'function') {
        detailsReturnFocus.focus();
      }
    }, 0);
  });

  // Image extension fallback: assets/images/<slug>.png → .jpg → .jpeg → .webp → hide.
  // Used by inline onerror on <img data-slug="...">.
  const IMG_EXTS = ['png', 'jpg', 'jpeg', 'webp'];
  window.tryNextExt = function (img) {
    const slug = img.dataset.slug;
    const next = parseInt(img.dataset.extI || '0', 10) + 1;
    if (!slug || next >= IMG_EXTS.length) {
      img.removeAttribute('src');
      img.style.display = 'none';
      return;
    }
    img.dataset.extI = next;
    img.src = `assets/images/${slug}.${IMG_EXTS[next]}`;
  };
})();

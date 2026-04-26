/* ============================================================================
   KÜTYÜ MŰHELY — shared client logic
   - saved items (localStorage)
   - reveal-on-scroll
   - nav active state
   - toast
   ========================================================================== */

(function () {
  const SAVED_KEY = 'kutyu.saved.v1';

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

  // Static-export polish: add demo/privacy notes and validation without touching
  // every exported HTML file.
  document.addEventListener('DOMContentLoaded', () => {
    const newsletter = document.getElementById('newsletter-form');
    if (newsletter && !newsletter.querySelector('.form-note')) {
      const note = document.createElement('p');
      note.className = 'form-note';
      note.textContent = 'Demo űrlap: nincs külső adatküldés, nincs valódi feliratkozás. A visszajelzés helyben születik.';
      newsletter.querySelector('.submit')?.before(note);
    }

    const suggest = document.getElementById('suggest-form');
    if (suggest && !suggest.querySelector('.form-note')) {
      const note = document.createElement('p');
      note.className = 'form-note';
      note.textContent = 'A javaslat csak ebben a böngészőben kerül a falra. Nincs valódi beküldés, csak prémium illúzió.';
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
    toast('Hiányzik valami · nézd át a kötelező mezőket');
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
      clearBtn.innerHTML = 'Még egy kattintás, és üres a lista<span class="arrow"></span>';
      toast('Törlés megerősítése · kattints még egyszer');
      clearTimer = setTimeout(() => {
        clearArmed = false;
        clearBtn.classList.remove('confirming');
        clearBtn.innerHTML = 'Mindet eltávolít<span class="arrow"></span>';
      }, 3600);
      return;
    }

    clearTimeout(clearTimer);
    clearArmed = false;
    KutyuStore.clear();
    toast('A kívánságlista kiürítve');
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

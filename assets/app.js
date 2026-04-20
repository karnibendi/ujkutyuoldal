/* ==========================================================================
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
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<span class="dot"></span>' + msg;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  };

  // Mobile nav
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.nav__burger');
    if (burger) burger.addEventListener('click', () => nav.classList.toggle('nav--menu-open'));
  });
})();

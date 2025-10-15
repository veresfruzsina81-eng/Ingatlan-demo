/* ========= SEGÉDEK ========= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ========= MODÁLOK ========= */
function openModal(el) {
  if (!el) return;
  el.setAttribute('aria-hidden', 'false');
}
function closeModal(el) {
  if (!el) return;
  el.setAttribute('aria-hidden', 'true');
}
$$('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
});
$$('.modal').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) closeModal(m);
  });
});
$$('[data-open]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const id = btn.getAttribute('data-open');
    if (id === 'postModal') {
      e.preventDefault();
      showQuickPost(); // dinamikus mini űrlap
      return;
    }
    openModal(document.getElementById(id));
  });
});

/* ========= DINAMIKUS HIRDETÉS FELADÁS (mini form) ========= */
let postModalEl = null;
function showQuickPost() {
  if (!postModalEl) {
    postModalEl = document.createElement('div');
    postModalEl.className = 'modal';
    postModalEl.id = 'postModal';
    postModalEl.setAttribute('aria-hidden', 'true');
    postModalEl.innerHTML = `
      <div class="modal__dialog">
        <button class="modal__close" data-close>×</button>
        <h3 data-i18n="post_title">Hirdetés feladása</h3>
        <form class="stack" id="quickPostForm">
          <select name="deal">
            <option value="elado" data-i18n="sale">Eladó</option>
            <option value="kiado" data-i18n="rent">Kiadó</option>
          </select>
          <select name="type">
            <option data-i18n="flat">Lakás</option>
            <option data-i18n="house">Ház</option>
            <option data-i18n="land">Telek</option>
          </select>
          <input name="city" placeholder="Település" data-i18n-placeholder="city_ph">
          <input name="price" placeholder="Ár (millió Ft)" inputmode="numeric">
          <input name="size" placeholder="Alapterület (m²)" inputmode="numeric">
          <button class="btn btn--primary" type="submit" data-i18n="post_cta">Hirdetés közzététele</button>
        </form>
      </div>`;
    document.body.appendChild(postModalEl);

    // újonnan beszúrt modálhoz események
    $('[data-close]', postModalEl).addEventListener('click', () => closeModal(postModalEl));
    postModalEl.addEventListener('click', (e) => { if (e.target === postModalEl) closeModal(postModalEl); });
    $('#quickPostForm', postModalEl).addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(postModalEl);
      // siker üzenet
      const success = document.getElementById('successModal');
      openModal(success);
      setTimeout(() => closeModal(success), 1800);
    });

    // azonnal lokalizáljuk, ha EN a nyelv
    if (currentLang === 'en') applyI18n('en', postModalEl);
  }
  openModal(postModalEl);
}

/* ========= PARTNER KARUSSZEL ========= */
(function initCarousel(){
  const track = document.getElementById('partnerTrack');
  const prev = $('.carousel__nav.prev');
  const next = $('.carousel__nav.next');
  if (!track || !prev || !next) return;
  const step = 280;
  prev.addEventListener('click', () => track.scrollBy({ left: -step, behavior: 'smooth'}));
  next.addEventListener('click', () => track.scrollBy({ left: step, behavior: 'smooth'}));
})();

/* ========= AUTH TABS ========= */
$$('.tabs.small').forEach(group => {
  group.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    group.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const key = tab.getAttribute('data-tab');
    const panes = group.nextElementSibling;
    panes.querySelectorAll('.stack').forEach(p => p.classList.remove('is-active'));
    $('#pane-' + key, panes)?.classList.add('is-active');
  });
});

/* ========= KERESŐ DEMO ========= */
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(searchForm);
    alert(`${t('search_started')}\n${fd.get('deal')} ${fd.get('type')} – ${fd.get('where') || t('anywhere')}`);
  });
}

/* ========= FINOM ANIMÁCIÓK ========= */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('fade-in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
$$('section, .agent, .strip__inner, .cta__inner').forEach(el => io.observe(el));

/* ========= NYELVVÁLTÁS (HU/EN) ========= */
const DICT = {
  hu: {
    hero_title: "Mindenhol jó, de a legjobb itt vár rád.",
    sale: "Eladó",
    rent: "Kiadó",
    flat: "Lakás",
    house: "Ház",
    land: "Telek",
    where: "Hol keresel?",
    search: "Keresés",
    fix_text: "Első ingatlanod? Keresd a FIX 3% jelölésű hirdetéseket – kedvezményes lakáshitel lehetőség.",
    more: "Bővebben",
    valuer_title: "Tudd meg, mennyit ér az ingatlanod!",
    valuer_desc: "Ingyenes, gyors értékbecslés becslési sávval és környék-összehasonlítással.",
    view: "Megnézem →",
    app_title: "Töltsd le a mobilappot!",
    app_text: "Vidd magaddal az ingatlanok teljes kínálatát a zsebedben.",
    post_title: "Hirdetés feladása",
    post_cta: "Hirdetés közzététele",
    city_ph: "Település",
    search_started: "Keresés elindítva:",
    anywhere: "bárhol"
  },
  en: {
    hero_title: "Everywhere is good, but the best is waiting here.",
    sale: "For sale",
    rent: "For rent",
    flat: "Apartment",
    house: "House",
    land: "Land",
    where: "Where are you searching?",
    search: "Search",
    fix_text: "First home? Look for the FIX 3% badge – you may be eligible for a discounted mortgage.",
    more: "Learn more",
    valuer_title: "See how much your property is worth!",
    valuer_desc: "Free instant estimate with local comparisons.",
    view: "View →",
    app_title: "Get the mobile app!",
    app_text: "Carry the full listing inventory in your pocket.",
    post_title: "Post a listing",
    post_cta: "Publish listing",
    city_ph: "City",
    search_started: "Search started:",
    anywhere: "anywhere"
  }
};
let currentLang = localStorage.getItem('lang') || 'hu';

function t(key){ return (DICT[currentLang] && DICT[currentLang][key]) || key; }

function applyI18n(lang, scope = document) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  // data-i18n szövegek
  $$('[data-i18n]', scope).forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && DICT[lang][key] != null) el.textContent = DICT[lang][key];
  });
  // placeholder fordítás
  $$('[data-i18n-placeholder]', scope).forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && DICT[lang][key] != null) el.setAttribute('placeholder', DICT[lang][key]);
  });

  // Fejlécben levő „Bejelentkezés / Regisztráció” link átírása példaként
  const authBtn = $(`.link-btn[data-open="authModal"]`);
  if (authBtn) authBtn.textContent = (lang === 'en') ? 'Login / Sign up' : 'Bejelentkezés / Regisztráció';

  // Hirdetés feladása gomb
  const postBtn = $('.btn--outline[data-open="postModal"]');
  if (postBtn) postBtn.textContent = (lang === 'en') ? 'Post a listing' : 'Hirdetés feladása';

  // Footer mini-copyright
  const fb = $('.footer__bottom');
  if (fb) fb.textContent = (lang === 'en') ? '© 2025 Real Estate Demo' : '© 2025 Ingatlan Demo';
}

// induláskor alkalmazzuk
applyI18n(currentLang);

// zászlók
const flagHu = document.getElementById('flagHu');
const flagEn = document.getElementById('flagEn');
flagHu?.addEventListener('click', () => applyI18n('hu'));
flagEn?.addEventListener('click', () => applyI18n('en'));

/* ========= APRÓ UX FINOMSÁGOK ========= */
// Enter a modál űrlapokon ne zárja be véletlenül
$$('.modal form').forEach(f => {
  f.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
    }
  });
});

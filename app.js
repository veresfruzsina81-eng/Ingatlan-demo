// Nav mobile
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('nav-list');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}

// Modal handling + hozzáférhetőség (ESC, fókuszcsapda)
const openButtons = document.querySelectorAll('[data-open]');
const closeButtons = document.querySelectorAll('[data-close]');
const modals = document.querySelectorAll('.modal');

let lastFocused = null;

openButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-open');
    const m = document.getElementById(id);
    if(m){
      lastFocused = document.activeElement;
      m.setAttribute('aria-hidden','false');
      const focusables = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length) focusables[0].focus();
      enableTrap(m);
    }
  });
});

closeButtons.forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const modal = btn.closest('.modal');
    closeModal(modal);
  });
});

modals.forEach(m=>{
  m.addEventListener('click', (e)=>{
    if(e.target === m) closeModal(m);
  });
  m.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') { e.stopPropagation(); closeModal(m); }
  });
});

function closeModal(m){
  if(!m) return;
  m.setAttribute('aria-hidden','true');
  disableTrap(m);
  if (lastFocused) { try{ lastFocused.focus(); }catch{} }
}

function enableTrap(m){
  const focusables = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  function trap(e){
    if(e.key !== 'Tab') return;
    const focusable = Array.from(focusables).filter(el=>!el.hasAttribute('disabled') && el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
  }
  m.__trapHandler = trap;
  m.addEventListener('keydown', trap);
}
function disableTrap(m){
  if(m.__trapHandler) m.removeEventListener('keydown', m.__trapHandler);
  delete m.__trapHandler;
}

// Tabs (generic) + ARIA (auth modál)
document.querySelectorAll('.tabs').forEach(group=>{
  group.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tab');
    if(!btn) return;
    const parent = btn.parentElement;
    parent.querySelectorAll('.tab').forEach(t=>{
      t.classList.remove('is-active');
      if (t.hasAttribute('aria-selected')) t.setAttribute('aria-selected','false');
    });
    btn.classList.add('is-active');
    if (btn.hasAttribute('aria-selected')) btn.setAttribute('aria-selected','true');

    const panes = parent.nextElementSibling?.classList?.contains('tabpanes')
      ? parent.nextElementSibling
      : parent.parentElement.querySelector('.tabpanes');

    if(!panes) return;

    panes.querySelectorAll('.tabpane').forEach(p=>{
      p.classList.remove('is-active');
      if (p.hasAttribute('aria-hidden')) p.setAttribute('aria-hidden','true');
    });

    const ctlId = btn.getAttribute('aria-controls');
    const paneByCtl = ctlId ? panes.querySelector('#'+ctlId) : null;

    if (paneByCtl){
      paneByCtl.classList.add('is-active');
      paneByCtl.setAttribute('aria-hidden','false');
      const firstInput = paneByCtl.querySelector('input, button');
      if (firstInput) firstInput.focus();
      return;
    }

    const tabKey = btn.getAttribute('data-tab');
    const paneFallback = document.querySelector(`#pane-${tabKey}`) || panes.firstElementChild;
    paneFallback.classList.add('is-active');
    if (paneFallback.hasAttribute('aria-hidden')) paneFallback.setAttribute('aria-hidden','false');
  });

  group.addEventListener('keydown', (e)=>{
    const tabs = Array.from(group.querySelectorAll('.tab'));
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight'){ (tabs[i+1] || tabs[0]).focus(); e.preventDefault(); }
    if (e.key === 'ArrowLeft'){ (tabs[i-1] || tabs[tabs.length-1]).focus(); e.preventDefault(); }
  });
});

// Carousel (nyilak + billentyű)
const track = document.getElementById('partnerTrack');
const prev = document.querySelector('.carousel .prev');
const next = document.querySelector('.carousel .next');
if(track && prev && next){
  const step = 280;
  function updateArrows(){
    prev.disabled = track.scrollLeft <= 0;
    const max = track.scrollWidth - track.clientWidth - 1;
    next.disabled = track.scrollLeft >= max;
    prev.setAttribute('aria-disabled', String(prev.disabled));
    next.setAttribute('aria-disabled', String(next.disabled));
  }
  prev.addEventListener('click', ()=> { track.scrollBy({left: -step, behavior:'smooth'}); });
  next.addEventListener('click', ()=> { track.scrollBy({left: step, behavior:'smooth'}); });
  track.addEventListener('scroll', updateArrows, {passive:true});
  track.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowRight') { next.click(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { prev.click(); e.preventDefault(); }
  });
  updateArrows();
}

// SearchForm demo submit
const searchForm = document.getElementById('searchForm');
if(searchForm){
  searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = new FormData(searchForm);
    alert(`Keresés elindítva:\n${q.get('deal')} ${q.get('type')} – ${q.get('where') || 'bárhol'}\nÁr: ${q.get('price')||'—'} M Ft, Alapterület: ${q.get('size')||'—'} m², Szobák: ${q.get('rooms')||'—'}`);
  });
}

// Pills (csak vizuális)
document.querySelectorAll('.pill').forEach(p=>{
  p.addEventListener('click', ()=>{
    document.querySelectorAll('.pill').forEach(x=>x.classList.remove('is-active'));
    p.classList.add('is-active');
  });
});

// Demo nyelvváltó (HU/EN) – a dizájnt nem érinti, csak a data-i18n feliratokat cseréli
const i18n = {
  hu: {
    'nav.fix':'FIX 3%-os lakáshitel','nav.csok':'CSOK+','nav.search':'Ingatlankereső','nav.tips':'Lakásvásárlási tippek','nav.auth':'Bejelentkezés / Regisztráció',
    'cta.post':'Hirdetésfeladás','ad.label':'Hirdetés',
    'hero.title':'Mindenhol jó, de a legjobb itt vár rád.',
    'search.sale':'Eladó','search.rent':'Kiadó','search.type':'Típus','search.where':'Hol keresel?','search.price':'Ár','search.size':'Alapterület','search.rooms':'Szobaszám','search.advanced':'Részletes kereső',
    'type.flat':'lakás','type.house':'ház','type.plot':'telek','type.office':'iroda','type.garage':'garázs',
    'filter.new':'Új építésű',
    'fix.q':'Első ingatlanod?','fix.desc':'Keresd a FIX 3% jelölésű hirdetéseket – ezek megfelelhetnek a FIX 3%-os lakáshitel feltételeinek.','fix.more':'Bővebben a FIX 3% -os lakáshitelről','fix.modal':'Demo tájékoztató...','fix.ok':'Értettem',
    'val.title':'Tudd meg, mennyit ér az ingatlanod!','val.desc':'Ingyenes, gyors értékbecslés becslési sávval és környék-összehasonlítással.','val.btn':'Megnézem →','val.modalTitle':'Ingatlan értékbecslő (demo)','val.ask':'Becsült érték kérése',
    'parks.title':'Lakóparkba költöznél?','partner.title':'Prémium Partner','partner.badge':'Partner Program','partner.all':'Megnézem az összes Partnert',
    'news.title':'Legfrissebb hírek, cikkek',
    'app.title':'Töltsd le a mobilappot!','app.desc':'Eladó vagy kiadó ingatlant keresel? Vidd magaddal a teljes kínálatot, bárhol, bármikor.',
    'auth.title':'Bejelentkezés / Regisztráció','auth.loginTab':'Bejelentkezés','auth.signupTab':'Regisztráció','auth.loginBtn':'Belépés','auth.signupBtn':'Regisztráció',
    'post.title':'Hirdetés feladása','post.publish':'Hirdetés közzététele',
    'adv.title':'Részletes kereső','adv.btn':'Keresés indítása'
  },
  en: {
    'nav.fix':'FIX 3% mortgage','nav.csok':'CSOK+','nav.search':'Property search','nav.tips':'Buying tips','nav.auth':'Sign in / Sign up',
    'cta.post':'Post listing','ad.label':'Advertisement',
    'hero.title':'Everywhere is nice — but the best is here.',
    'search.sale':'For sale','search.rent':'For rent','search.type':'Type','search.where':'Where?','search.price':'Price','search.size':'Floor area','search.rooms':'Rooms','search.advanced':'Advanced search',
    'type.flat':'flat','type.house':'house','type.plot':'plot','type.office':'office','type.garage':'garage',
    'filter.new':'New build',
    'fix.q':'First property?','fix.desc':'Look for the FIX 3% label — these may meet the program’s conditions.','fix.more':'More about the FIX 3% mortgage','fix.modal':'Demo notice...','fix.ok':'Got it',
    'val.title':'Find out your property’s value!','val.desc':'Free, quick valuation with range and neighborhood comparison.','val.btn':'Show me →','val.modalTitle':'Property valuation (demo)','val.ask':'Request estimate',
    'parks.title':'Moving to a residential park?','partner.title':'Premium Partner','partner.badge':'Partner Program','partner.all':'See all Partners',
    'news.title':'Latest news & articles',
    'app.title':'Get the mobile app!','app.desc':'Search the full marketplace anytime, anywhere.',
    'auth.title':'Sign in / Sign up','auth.loginTab':'Sign in','auth.signupTab':'Sign up','auth.loginBtn':'Sign in','auth.signupBtn':'Sign up',
    'post.title':'Post a listing','post.publish':'Publish listing',
    'adv.title':'Advanced search','adv.btn':'Start search'
  }
};

function applyLang(lang){
  const dict = i18n[lang] || i18n.hu;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
}

document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const lang = btn.getAttribute('data-lang');
    applyLang(lang);
  });
});

// Alapértelmezés: HU
applyLang('hu');

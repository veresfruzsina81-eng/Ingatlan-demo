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

// Modal handling + modernizált hozzáférhetőség (ESC, fókuszcsapda)
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
      // kezdő fókusz: első fókuszolható
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
  // háttérkatt zár
  m.addEventListener('click', (e)=>{
    if(e.target === m) closeModal(m);
  });
  // ESC zár
  m.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') {
      e.stopPropagation();
      closeModal(m);
    }
  });
});

function closeModal(m){
  if(!m) return;
  m.setAttribute('aria-hidden','true');
  disableTrap(m);
  if (lastFocused) { try{ lastFocused.focus(); }catch{} }
}

// fókuszcsapda
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

// Tabs (generic) + ARIA frissítés az auth modálhoz
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

    // find nearest tabpanes sibling
    const panes = parent.nextElementSibling?.classList?.contains('tabpanes')
      ? parent.nextElementSibling
      : parent.parentElement.querySelector('.tabpanes');

    if(!panes) return;

    panes.querySelectorAll('.tabpane').forEach(p=>{
      p.classList.remove('is-active');
      if (p.hasAttribute('aria-hidden')) p.setAttribute('aria-hidden','true');
    });

    const tabKey = btn.getAttribute('data-tab');
    // auth modál: aria-controls kapcsolat
    const ctlId = btn.getAttribute('aria-controls');
    const paneByCtl = ctlId ? panes.querySelector('#'+ctlId) : null;

    if (paneByCtl){
      paneByCtl.classList.add('is-active');
      paneByCtl.setAttribute('aria-hidden','false');
      // fókusz első mezőre
      const firstInput = paneByCtl.querySelector('input, button');
      if (firstInput) firstInput.focus();
      return;
    }

    if(!tabKey){
      const first = panes.firstElementChild;
      first.classList.add('is-active');
      if (first.hasAttribute('aria-hidden')) first.setAttribute('aria-hidden','false');
      return;
    }
    const pane = document.querySelector(`#pane-${tabKey}`) || panes.firstElementChild;
    pane.classList.add('is-active');
    if (pane.hasAttribute('aria-hidden')) pane.setAttribute('aria-hidden','false');
  });

  // billentyűzetes fülnavigáció
  group.addEventListener('keydown', (e)=>{
    const tabs = Array.from(group.querySelectorAll('.tab'));
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight'){ (tabs[i+1] || tabs[0]).focus(); e.preventDefault(); }
    if (e.key === 'ArrowLeft'){ (tabs[i-1] || tabs[tabs.length-1]).focus(); e.preventDefault(); }
  });
});

// Carousel (működő, nyilakkal és billentyűzettel)
const track = document.getElementById('partnerTrack');
const prev = document.querySelector('.carousel .prev');
const next = document.querySelector('.carousel .next');
if(track && prev && next){
  const step = 280; // px
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
  // init
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

// Nyelv zászlók (előkezelt – most csak vizuális)
document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const lang = btn.getAttribute('data-lang');
    alert(`Nyelv váltása (demo): ${lang.toUpperCase()}`);
  });
});


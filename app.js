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

// Modal handling
const openButtons = document.querySelectorAll('[data-open]');
const closeButtons = document.querySelectorAll('[data-close]');
const modals = document.querySelectorAll('.modal');

openButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-open');
    const m = document.getElementById(id);
    if(m){ m.setAttribute('aria-hidden','false'); }
  });
});
closeButtons.forEach(btn=>{
  btn.addEventListener('click', ()=> btn.closest('.modal').setAttribute('aria-hidden','true'));
});
modals.forEach(m=>{
  m.addEventListener('click', (e)=>{
    if(e.target === m) m.setAttribute('aria-hidden','true');
  });
});

// Tabs (generic)
document.querySelectorAll('.tabs').forEach(group=>{
  group.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tab');
    if(!btn) return;
    const parent = btn.parentElement;
    parent.querySelectorAll('.tab').forEach(t=>t.classList.remove('is-active'));
    btn.classList.add('is-active');

    // find nearest tabpanes sibling
    const panes = parent.nextElementSibling?.classList.contains('tabpanes')
      ? parent.nextElementSibling
      : parent.parentElement.querySelector('.tabpanes');

    if(!panes) return;

    panes.querySelectorAll('.tabpane').forEach(p=>p.classList.remove('is-active'));

    const tabKey = btn.getAttribute('data-tab');
    if(!tabKey){ // auth modal small tabs
      panes.firstElementChild.classList.add('is-active');
      return;
    }
    const pane = document.querySelector(`#pane-${tabKey}`) || panes.firstElementChild;
    pane.classList.add('is-active');
  });
});

// Carousel (simple)
const track = document.getElementById('partnerTrack');
const prev = document.querySelector('.carousel .prev');
const next = document.querySelector('.carousel .next');
if(track && prev && next){
  const step = 280; // px
  prev.addEventListener('click', ()=> track.scrollBy({left: -step, behavior:'smooth'}));
  next.addEventListener('click', ()=> track.scrollBy({left: step, behavior:'smooth'}));
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

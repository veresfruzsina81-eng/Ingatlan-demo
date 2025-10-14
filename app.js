// ----- Demo dataset -------------------------------------------------------
const DATA = [
  {id:1,type:'elado',kind:'lakás',title:'Panel lakás – XIV.',
    city:'Budapest XIV.', price:45.9, area:52, rooms:2, newBuild:false, fix3:true,
    img:'https://picsum.photos/seed/panel/600/380', desc:'Napfényes, erkélyes panel lakás a város közelében.'},
  {id:2,type:'elado',kind:'lakás',title:'Tégla lakás – V.',
    city:'Budapest V.', price:98, area:64, rooms:3, newBuild:false, fix3:false,
    img:'https://picsum.photos/seed/tegla/600/380', desc:'Felújított, belvárosi lakás liftes házban.'},
  {id:3,type:'elado',kind:'ház',title:'Családi ház – Budakeszi',
    city:'Budakeszi', price:89, area:130, rooms:4, newBuild:true, fix3:false,
    img:'https://picsum.photos/seed/haz/600/380', desc:'Új építésű családi ház garázzsal és kerttel.'},
  {id:4,type:'kiado',kind:'lakás',title:'Albérlet – XI.',
    city:'Budapest XI.', price:0.32, area:38, rooms:1, newBuild:false, fix3:false,
    img:'https://picsum.photos/seed/rent/600/380', desc:'Bútorozott garzon kiváló közlekedéssel.'},
  {id:5,type:'elado',kind:'lakás',title:'Erkélyes lakás – XIII.',
    city:'Budapest XIII.', price:79, area:54, rooms:2, newBuild:false, fix3:true,
    img:'https://picsum.photos/seed/balcony/600/380', desc:'Csendes utcában, zöldre néző erkély.'},
];

// ----- Elements -----------------------------------------------------------
const results = document.getElementById('results');
const tabs = document.querySelectorAll('.tab');
const loginModal = document.getElementById('loginModal');
const postModal  = document.getElementById('postModal');
const detailsModal = document.getElementById('detailsModal');

const state = { type:'elado' };

// ----- Helpers ------------------------------------------------------------
function fmtPrice(m){ // millió Ft
  return (Math.round(m*10)/10).toLocaleString('hu-HU', {minimumFractionDigits:1, maximumFractionDigits:1}) + ' M Ft';
}
function renderCards(list){
  results.innerHTML = '';
  if(!list.length){ results.innerHTML = '<div class="muted">Nincs találat a megadott szűrőkre.</div>'; return; }
  list.forEach(x=>{
    const c = document.createElement('article'); c.className='card';
    c.innerHTML = `
      <div class="img" style="background-image:url('${x.img}');background-size:cover;background-position:center">
        <span class="badge">${x.area} m² • ${x.rooms} szoba</span>
      </div>
      <div class="body">
        <div class="title">${x.title}</div>
        <div class="muted">${x.city} • ${x.kind}</div>
        <div class="price">${fmtPrice(x.price)}</div>
        <div class="cta">
          <button class="btn" data-details="${x.id}">Részletek</button>
          <button class="btn ghost" onclick="alert('Elmentve kedvencek közé – demó')">Mentés</button>
        </div>
      </div>`;
    results.appendChild(c);
  });
  // attach details buttons
  document.querySelectorAll('[data-details]').forEach(b=>{
    b.onclick = () => openDetails( Number(b.getAttribute('data-details')) );
  });
}

function collectFilters(){
  const toNum = v => v ? Number(v) : null;
  return {
    kind: document.getElementById('kind').value,
    city: document.getElementById('city').value.trim().toLowerCase(),
    priceMin: toNum(document.getElementById('priceMin').value),
    priceMax: toNum(document.getElementById('priceMax').value),
    areaMin : toNum(document.getElementById('areaMin').value),
    rooms   : toNum(document.getElementById('rooms').value),
    fix3    : document.getElementById('fix3').checked,
    newBuild: document.getElementById('newBuild').checked
  };
}

function applyFilters(){
  const f = collectFilters();
  const list = DATA.filter(x=>{
    if(x.type!==state.type) return false;
    if(f.kind && x.kind!==f.kind) return false;
    if(f.city && !x.city.toLowerCase().includes(f.city)) return false;
    if(f.priceMin!=null && x.price < f.priceMin) return false;
    if(f.priceMax!=null && x.price > f.priceMax) return false;
    if(f.areaMin!=null  && x.area  < f.areaMin) return false;
    if(f.rooms!=null    && x.rooms < f.rooms) return false;
    if(f.fix3 && !x.fix3) return false;
    if(f.newBuild && !x.newBuild) return false;
    return true;
  });
  renderCards(list);
}

function openDetails(id){
  const x = DATA.find(d=>d.id===id);
  if(!x) return;
  document.getElementById('dTitle').textContent = x.title;
  document.getElementById('dImg').src = x.img;
  document.getElementById('dMeta').textContent = `${x.area} m² • ${x.rooms} szoba • ${x.kind}`;
  document.getElementById('dCity').textContent = x.city;
  document.getElementById('dPrice').textContent = fmtPrice(x.price);
  document.getElementById('dDesc').textContent = x.desc;
  detailsModal.showModal();
}

// ----- Tab switching ------------------------------------------------------
tabs.forEach(t=>{
  t.onclick = () => {
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    state.type = t.dataset.type;
    applyFilters();
  }
});

// ----- Search controls ----------------------------------------------------
document.getElementById('btnSearch').onclick = applyFilters;
document.getElementById('btnReset').onclick = ()=>{
  document.querySelectorAll('input').forEach(i=>{ if(i.type!=='checkbox') i.value=''; else i.checked=false; });
  document.getElementById('kind').selectedIndex=0;
  applyFilters();
}
document.getElementById('toggle-advanced').onclick = ()=>{
  const adv = document.getElementById('advanced');
  adv.classList.toggle('hidden');
}

// ----- Login modal --------------------------------------------------------
document.getElementById('nav-login').onclick = (e)=>{ e.preventDefault(); loginModal.showModal(); }
document.getElementById('loginSubmit').onclick = (e)=>{
  e.preventDefault();
  const email=document.getElementById('loginEmail').value, pass=document.getElementById('loginPass').value;
  const ok = /^\S+@\S+\.\S+$/.test(email) && pass.length>=6;
  if(ok){ loginModal.close(); alert('Sikeres bejelentkezés (demó).'); }
  else{ alert('Adj meg valós e-mail formátumot és min. 6 karakteres jelszót.'); }
}

// ----- Post modal ---------------------------------------------------------
document.getElementById('nav-post').onclick = (e)=>{ e.preventDefault(); postModal.showModal(); }
document.getElementById('pImage').addEventListener('change', (ev)=>{
  const file = ev.target.files?.[0];
  if(!file) return;
  const img = document.getElementById('pPreview');
  img.src = URL.createObjectURL(file);
  img.style.display='block';
});

// ----- "Új keresés" link scroll ------------------------------------------
document.getElementById('nav-search').onclick = (e)=>{ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }

// Initial render
applyFilters();

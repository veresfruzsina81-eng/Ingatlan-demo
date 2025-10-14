// Drawer
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
const openMenu = document.getElementById('openMenu');
const drawerClose = document.getElementById('drawerClose');
const toggleDrawer = (show)=> {
  drawer.classList.toggle('open', show);
  backdrop.classList.toggle('show', show);
  drawer.setAttribute('aria-hidden', !show);
  backdrop.setAttribute('aria-hidden', !show);
};
openMenu.addEventListener('click', ()=>toggleDrawer(true));
drawerClose.addEventListener('click', ()=>toggleDrawer(false));
backdrop.addEventListener('click', ()=>toggleDrawer(false));

// Tabs (Eladó/Kiadó)
let currentKind = 'elado';
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentKind = btn.dataset.kind;
    runSearch();
  });
});

// FIX 3% modal
const fixModal = document.getElementById('fixModal');
document.getElementById('openFix')?.addEventListener('click', ()=>fixModal.showModal());
document.getElementById('openFix2')?.addEventListener('click', ()=>fixModal.showModal());

// Login modal + mock auth
const loginModal = document.getElementById('loginModal');
const postModal  = document.getElementById('postModal');
const loginOpen = document.getElementById('loginOpen');
const loginOpen2 = document.getElementById('loginOpen2');
const postOpen = document.getElementById('postOpen');
loginOpen.addEventListener('click', ()=>loginModal.showModal());
loginOpen2.addEventListener('click', ()=>loginModal.showModal());
postOpen.addEventListener('click', ()=>postModal.showModal());

const loginForm = document.getElementById('loginForm');
const loginMsg  = document.getElementById('loginMsg');
const loginEmail= document.getElementById('loginEmail');
const loginPass = document.getElementById('loginPass');
const remember  = document.getElementById('remember');

function setLoggedIn(email){
  document.querySelectorAll('#loginOpen,#loginOpen2').forEach(b=>b.textContent = email ? 'Kijelentkezés' : 'Bejelentkezés');
  document.querySelectorAll('#loginOpen,#loginOpen2').forEach(b=>{
    b.onclick = email 
      ? ()=>{ localStorage.removeItem('demoUser'); setLoggedIn(null); }
      : ()=>loginModal.showModal();
  });
  if(email){
    loginModal.close();
    loginMsg.textContent = '';
  }
}
const saved = localStorage.getItem('demoUser');
if(saved) setLoggedIn(saved);

loginForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = (loginEmail.value||'').trim().toLowerCase();
  const pass  = loginPass.value||'';
  // very basic demo auth
  if((email === 'demo@demo.hu' || email === 'admin@demo.hu') && pass === 'demo123'){
    if(remember.checked) localStorage.setItem('demoUser', email);
    setLoggedIn(email);
  }else{
    loginMsg.textContent = 'Hibás e-mail vagy jelszó (demó: demo@demo.hu / demo123).';
  }
});

// Search + mock data
const resultsEl = document.getElementById('results');
const noResults = document.getElementById('noResults');

// minimal fake dataset
const DATA = [
  {id:1, kind:'elado', type:'lakas', city:'Budapest XI.', price:74, size:52, rooms:2, year:2012, floor:3, balcony:true, newBuild:false, fix:true, img:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'},
  {id:2, kind:'elado', type:'lakas', city:'Győr', price:42, size:48, rooms:2, year:2006, floor:2, balcony:false, newBuild:false, fix:false, img:'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1200&auto=format&fit=crop'},
  {id:3, kind:'kiado', type:'lakas', city:'Debrecen', price:180, size:65, rooms:3, year:2021, floor:6, balcony:true, newBuild:true, fix:true, img:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop'},
  {id:4, kind:'elado', type:'haz', city:'Szeged', price:95, size:110, rooms:4, year:1998, floor:0, balcony:false, newBuild:false, fix:false, img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop'},
  {id:5, kind:'kiado', type:'lakas', city:'Budapest XIII.', price:240, size:72, rooms:3, year:2023, floor:8, balcony:true, newBuild:true, fix:false, img:'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'}
];

function runSearch(){
  const t = document.getElementById('type').value;
  const where = document.getElementById('where').value.toLowerCase().trim();
  const price = parseInt(document.getElementById('price').value, 10);
  const size  = parseInt(document.getElementById('size').value, 10);
  const rooms = parseInt(document.getElementById('rooms').value, 10);
  const fix   = document.getElementById('fixChk').checked;
  const nbuild= document.getElementById('newBuild').checked;
  const yMin  = parseInt(document.getElementById('yearMin').value,10);
  const yMax  = parseInt(document.getElementById('yearMax').value,10);
  const floor = parseInt(document.getElementById('floor').value,10);
  const balcony = (document.getElementById('balcony').value||'').toLowerCase();

  const results = DATA.filter(it=>{
    if(it.kind !== currentKind) return false;
    if(t && it.type !== t) return false;
    if(where && !it.city.toLowerCase().includes(where)) return false;
    if(!Number.isNaN(price) && it.price > price) return false;
    if(!Number.isNaN(size) && it.size < size) return false;
    if(!Number.isNaN(rooms) && it.rooms < rooms) return false;
    if(fix && !it.fix) return false;
    if(nbuild && !it.newBuild) return false;
    if(!Number.isNaN(yMin) && it.year < yMin) return false;
    if(!Number.isNaN(yMax) && it.year > yMax) return false;
    if(!Number.isNaN(floor) && it.floor !== floor) return false;
    if(balcony && (balcony==='igen') !== it.balcony) return false;
    return true;
  });

  renderCards(results);
}

function renderCards(items){
  resultsEl.innerHTML = '';
  if(!items.length){
    noResults.hidden = false;
    return;
  }
  noResults.hidden = true;

  items.forEach(it=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${it.img}" alt="Ingatlan fotó">
      <div class="card-body">
        <div class="tags">
          ${it.fix ? '<span class="badge">FIX 3%</span>' : ''}
          ${it.newBuild ? '<span class="badge" style="background:linear-gradient(90deg,#00e676,#54f2b2)">Új építésű</span>' : ''}
        </div>
        <h3>${capitalize(it.type)} – ${it.city}</h3>
        <p><strong>${it.price}</strong> millió Ft • ${it.size} m² • ${it.rooms} szoba</p>
        <p class="fine">Épült: ${it.year} • Emelet: ${it.floor}${it.balcony ? ' • Erkély' : ''}</p>
        <button class="btn small">Részletek</button>
      </div>
    `;
    resultsEl.appendChild(el);
  });
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1)}

// Search submit
document.getElementById('searchForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  runSearch();
});

// Open FIX modal by button in hero
document.getElementById('openFix2').addEventListener('click', ()=>fixModal.showModal());

// Initial render
runSearch();

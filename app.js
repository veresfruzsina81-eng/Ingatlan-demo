// Rövid segédek
const $ = (s, d=document)=>d.querySelector(s);
const $$ = (s, d=document)=>Array.from(d.querySelectorAll(s));

/* ====== Fejléc: mobil menü ====== */
const ham = $('#hamburger');
const mob = $('#mobileMenu');
ham?.addEventListener('click', ()=>{
  const open = mob.hasAttribute('hidden') ? true : false;
  mob.toggleAttribute('hidden');
  ham.setAttribute('aria-expanded', String(open));
});

/* ====== Modal nyit/zár ====== */
function openModal(id){ $( '#'+id )?.showModal(); }
function closeModal(id){ $( '#'+id )?.close(); }
$$('.modal__close').forEach(btn=>{
  btn.addEventListener('click', ()=> closeModal(btn.dataset.close));
});

/* ====== Felső menü gombok ====== */
$('#openFixTop')   ?.addEventListener('click', ()=>openModal('fixModal'));
$('#openFixMob')   ?.addEventListener('click', ()=>openModal('fixModal'));
$('#openFixTiny')  ?.addEventListener('click', ()=>openModal('fixModal'));
$('#openLoginTop') ?.addEventListener('click', ()=>openModal('loginModal'));
$('#openLoginMob') ?.addEventListener('click', ()=>openModal('loginModal'));
$('#openPostTop')  ?.addEventListener('click', ()=>openModal('postModal'));
$('#openPostMob')  ?.addEventListener('click', ()=>openModal('postModal'));
$('#openSearch')   ?.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
$('#openSearchMob')?.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
$('#openCsok')     ?.addEventListener('click', ()=>alert('CSOK+ tájékoztató oldal – DEMÓ'));
$('#openCsokMob')  ?.addEventListener('click', ()=>alert('CSOK+ tájékoztató oldal – DEMÓ'));

/* ====== Bejelentkezés (mock) ====== */
$('#loginForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pass  = $('#loginPass').value;
  if((email==='demo@demo.hu'||email==='admin@demo.hu') && pass==='demo123'){
    localStorage.setItem('demoUser', email);
    alert('Sikeres belépés (DEMO) – '+email);
    closeModal('loginModal');
  } else {
    alert('Hibás adatok (DEMO: demo@demo.hu / demo123)');
  }
});

/* ====== Kereső (alap szűrés) ====== */
const DATA_PARKS = [
  {id:101, title:'JASMINE Club House', city:'Budapest XIII.', desc:'Csendes, zöld környezet, A+ energetika.', pills:['5% visszatérítés','A+','Lift'], img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop'},
  {id:102, title:'Novus Liget', city:'Budapest XV.', desc:'Teraszos lakások kedvező ár-értékkel.', pills:['Új építésű','Erkély'], img:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop'},
  {id:103, title:'Budai Walzer IV. ütem', city:'Budapest XI.', desc:'Változatos méretek, bevezető árak.', pills:['−5% bevezető','A+'], img:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'},
  {id:104, title:'AeroGate Homes', city:'Budapest IX.', desc:'Metró közeli, modern lakások.', pills:['FIX 3%','Erkély'], img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop'},
  {id:105, title:'Spring Garden', city:'Budapest XIII.', desc:'Saját edzőterem és közösségi terek.', pills:['A+','Wellness'], img:'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'},
  {id:106, title:'Kincsem Lakópark', city:'Budapest XIV.', desc:'Eladó új otthonok, kiváló közlekedés.', pills:['Zöldövezet','Garázs'], img:'https://images.unsplash.com/photo-1614436163996-25b90e1aaff2?q=80&w=1200&auto=format&fit=crop'}
];

const parkWrap = $('#parkCards');
function renderParks(list=DATA_PARKS){
  parkWrap.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role','listitem');
    card.innerHTML = `
      <img class="card__img" src="${p.img}" alt="${p.title}">
      <div class="card__body">
        <div class="pills">${p.pills.map(x=>`<span class="pill">${x}</span>`).join('')}</div>
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.city} • ${p.desc}</p>
        <button class="btn btn--outline" data-id="${p.id}">Megnézem</button>
      </div>
    `;
    parkWrap.appendChild(card);
  });

  // részletek
  $$('.card .btn', parkWrap).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const p = DATA_PARKS.find(x=>x.id===Number(btn.dataset.id));
      $('#detailBody').innerHTML = `
        <img src="${p.img}" alt="">
        <h3 style="margin:.2rem 0">${p.title}</h3>
        <p><strong>${p.city}</strong></p>
        <p>${p.desc}</p>
        <p class="pills">${p.pills.map(x=>`<span class="pill">${x}</span>`).join('')}</p>
      `;
      openModal('detailModal');
    });
  });
}
renderParks();

/* ====== Kereső submit (szűrés a lakóparkokra DEMO) ====== */
$('#searchForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const q = $('#where').value.trim().toLowerCase();
  const filtered = DATA_PARKS.filter(p => !q || p.city.toLowerCase().includes(q) || p.title.toLowerCase().includes(q));
  renderParks(filtered);
});
/* ====== Partners (demo adat) ====== */
const PARTNERS = [
  {id:1, name:'Flick Zsuzsanna', area:'XI. kerület, Budaörs, Érd, Siófok', years:19, fee:'bruttó 2–6%', img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop'},
  {id:2, name:'Knul Andrea', area:'Szigethalom, Taksony, Dunavarsány', years:6, fee:'bruttó 2–3%', img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop'},
  {id:3, name:'Szabó Balázs', area:'Pécs, Siklós, Komló', years:7, fee:'bruttó 2,5–3%', img:'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop'},
  {id:4, name:'Kukovics Milán', area:'XIII., III., IV., XIV. kerület', years:4, fee:'bruttó 3,2–4,4%', img:'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1200&auto=format&fit=crop'}
];

const partnerWrap = $('#partnerCards');
function renderPartners(list=PARTNERS){
  partnerWrap.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <img class="card__img" src="${p.img}" alt="${p.name}">
      <div class="card__body">
        <span class="pill">Prémium Partner</span>
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.area}</p>
        <p class="card__desc">${p.years} éve a rendszerben • Jutalék: <strong>${p.fee}</strong></p>
        <button class="btn btn--outline" data-id="${p.id}">Profil</button>
      </div>
    `;
    partnerWrap.appendChild(card);
  });

  // partner "Profil" a részletek modálba
  $$('.cards--partners .btn', partnerWrap).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const p = PARTNERS.find(x=>x.id===Number(btn.dataset.id));
      $('#detailBody').innerHTML = `
        <img src="${p.img}" alt="">
        <h3 style="margin:.2rem 0">${p.name}</h3>
        <p><strong>Területek:</strong> ${p.area}</p>
        <p>${p.years} éve partner • Jutalék: ${p.fee}</p>
        <button class="btn btn--primary">Kapcsolatfelvétel</button>
      `;
      openModal('detailModal');
    });
  });
}
renderPartners();

/* ====== News (demo adat) ====== */
const NEWS = [
  {id:11, tag:'Piaci hírek', title:'Szokatlan tempóban csökkentek az albérletárak', teaser:'Országosan több mint 1% csökkenés az előző hónaphoz képest.', img:'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=1200&auto=format&fit=crop'},
  {id:12, tag:'Otthon start', title:'Megéri új építésű lakást venni?', teaser:'Mikor jó belépni a piacra és milyen hozadékai vannak?', img:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop'},
  {id:13, tag:'Lakásárindex', title:'Gyorsuló lakásdrágulás, záródó árolló', teaser:'Összefoglalónk a szeptemberi trendekről.', img:'https://images.unsplash.com/photo-1517630800677-932d836ab680?q=80&w=1200&auto=format&fit=crop'},
  {id:14, tag:'Céges autó', title:'Elektromos autó mint céges juttatás?', teaser:'Előnyök és hátrányok röviden.', img:'https://images.unsplash.com/photo-1511396275270-0ac3fd526b62?q=80&w=1200&auto=format&fit=crop'},
  {id:15, tag:'Használt autó', title:'Hibrid és elektromos iránt nő az érdeklődés', teaser:'Piaci körkép.', img:'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=1200&auto=format&fit=crop'}
];

function renderNews(){
  const lead = NEWS[0];
  $('#newsLead').innerHTML = `
    <img src="${lead.img}" alt="">
    <div class="box">
      <span class="badge-soft">${lead.tag}</span>
      <h3 style="margin:.4rem 0">${lead.title}</h3>
      <p class="card__desc">${lead.teaser}</p>
      <button class="btn btn--outline" data-news="${lead.id}">Elolvasom</button>
    </div>
  `;

  const list = $('#newsList'); list.innerHTML='';
  NEWS.slice(1,4).forEach(n=>{
    const item = document.createElement('article');
    item.className='news__item';
    item.innerHTML = `
      <div class="box">
        <span class="badge-soft">${n.tag}</span>
        <h4>${n.title}</h4>
        <p class="card__desc">${n.teaser}</p>
        <button class="btn btn--outline" data-news="${n.id}">Elolvasom</button>
      </div>
    `;
    list.appendChild(item);
  });

  const side = $('#newsSide'); side.innerHTML='';
  NEWS.slice(3).forEach(n=>{
    const item = document.createElement('article');
    item.className='news__item';
    item.innerHTML = `
      <img src="${n.img}" alt="">
      <div class="box">
        <span class="badge-soft">${n.tag}</span>
        <h4>${n.title}</h4>
        <button class="btn btn--outline" data-news="${n.id}">Elolvasom</button>
      </div>
    `;
    side.appendChild(item);
  });

  // részletek modál
  $$('[data-news]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const n = NEWS.find(x=>x.id===Number(btn.dataset.news));
      $('#detailBody').innerHTML = `
        <img src="${n.img}" alt="">
        <h3 style="margin:.2rem 0">${n.title}</h3>
        <p><span class="pill">${n.tag}</span></p>
        <p>${n.teaser} — (DEMO cikk szöveg helye)</p>
      `;
      openModal('detailModal');
    });
  });
}
renderNews();

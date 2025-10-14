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

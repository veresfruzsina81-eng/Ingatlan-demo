// Menü
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const drawer = document.getElementById('drawer');
const scrim = document.getElementById('scrim');

function openDrawer(){ drawer.classList.add('open'); scrim.classList.add('show'); }
function closeDrawer(){ drawer.classList.remove('open'); scrim.classList.remove('show'); }

openMenu.addEventListener('click', openDrawer);
closeMenu.addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);

// Eladó/Kiadó tabok
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Részletes kereső
const adv = document.getElementById('advanced');
document.getElementById('toggleAdvanced').addEventListener('click', ()=>adv.classList.toggle('show'));
document.getElementById('hideAdvanced').addEventListener('click', ()=>adv.classList.remove('show'));

// FIX 3% modal
const fixDialog = document.getElementById('fixDialog');
const openFix = ()=> fixDialog.showModal();
document.getElementById('openFixInfo').addEventListener('click', openFix);
document.getElementById('openFixInfoInline').addEventListener('click', openFix);
document.getElementById('closeFix').addEventListener('click', ()=>fixDialog.close());
document.getElementById('okFix').addEventListener('click', ()=>fixDialog.close());

// Demo submit
document.getElementById('searchForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Demo: a kereső működik, de most csak design referencia 😊');
});

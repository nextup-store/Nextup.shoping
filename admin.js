const $ = (s) => document.querySelector(s);
const KEY = 'nextup_admin_products_v2';
const SETTINGS_KEY = 'nextup_admin_settings_v1';
let products = JSON.parse(localStorage.getItem(KEY) || 'null');
let editing = null;

const seed = [
 {id:'k38',name:'K38 Phone Cooler',model:'K38',oldPrice:1050,price:900,stock:12,colors:['Standard'],description:'Phone cooler for gaming and everyday use.',images:[]},
 {id:'hoco-w35',name:'Hoco W35',model:'Hoco W35',oldPrice:1550,price:1290,stock:22,colors:['Black','Grey'],description:'Wireless headphones.',images:[]},
 {id:'mkb',name:'MKB Headphone',model:'MKB',oldPrice:1550,price:1220,stock:12,colors:['Black','Grey'],description:'Wireless headphones.',images:[]},
 {id:'airpods-pro-2',name:'AirPods Pro 2nd Gen',model:'AirPods Pro 2nd',oldPrice:650,price:480,stock:null,colors:['Black','White'],description:'AirPods Pro 2nd style wireless earbuds.',images:[]},
 {id:'eaget-s20',name:'EAGET S20',model:'EAGET S20',oldPrice:950,price:800,stock:12,colors:['Standard'],description:'EAGET S20 product.',images:[]}
];
if (!products) { products = seed; persist(); }

function persist(){ localStorage.setItem(KEY, JSON.stringify(products)); render(); }
function esc(x=''){ return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function money(n){return `৳${Number(n||0).toLocaleString('en-BD')}`}
function render(){
  const list=$('#productList');
  list.innerHTML=products.map(p=>`<article class="product-item">
    <div class="product-thumb">${p.localPreview?.[0]||p.images?.[0]?`<img src="${p.localPreview?.[0]||p.images[0]}" alt="">`:'<span>IMG</span>'}</div>
    <div class="product-main"><div class="row"><strong>${esc(p.name)}</strong><span class="stock ${p.stock!=null&&p.stock<=5?'low':''}">${p.stock==null?'Stock —':`Stock ${p.stock}`}</span></div>
    <p class="meta">${esc(p.model||'')} · <s>${money(p.oldPrice)}</s> <b>${money(p.price)}</b></p><p class="meta">${esc((p.colors||[]).join(' · ')||'Standard')}</p>
    <div class="row"><span class="meta">${p.images?.length||p.localPreview?.length||0} image(s)</span><div><button data-edit="${p.id}">Edit</button> <button class="danger" data-del="${p.id}">Delete</button></div></div></div>
  </article>`).join('') || '<div class="panel">No products yet.</div>';
  $('#statProducts').textContent=products.length;
  $('#statLow').textContent=products.filter(p=>p.stock!=null&&p.stock<=5).length;
  $('#statOrders').textContent=localStorage.getItem('nextup_order_count')||'0';
}
function go(page){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));$('#'+page).classList.add('active');document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===page));$('#pageTitle').textContent=page[0].toUpperCase()+page.slice(1);}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>go(b.dataset.page));
$('#loginBtn').onclick=()=>{if($('#adminEmail').value&&$('#adminPassword').value){$('#login').classList.add('hidden');$('#app').classList.remove('hidden');sessionStorage.setItem('nextup_admin_demo','1')}else $('#loginMsg').textContent='Enter your admin credentials.'};
if(sessionStorage.getItem('nextup_admin_demo')){$('#login').classList.add('hidden');$('#app').classList.remove('hidden')}
$('#logoutBtn').onclick=()=>{sessionStorage.removeItem('nextup_admin_demo');location.reload()};
function openForm(p){editing=p||null;$('#formTitle').textContent=p?'Edit Product':'Add Product';$('#pid').value=p?.id||'';$('#pname').value=p?.name||'';$('#pmodel').value=p?.model||'';$('#pold').value=p?.oldPrice??'';$('#pprice').value=p?.price??'';$('#pstock').value=p?.stock??'';$('#pcolors').value=(p?.colors||[]).join(', ');$('#pdesc').value=p?.description||'';$('#preview').innerHTML=(p?.localPreview||p?.images||[]).map(src=>`<img src="${src}" alt="">`).join('');$('#productModal').classList.add('open')}
$('#newProduct').onclick=()=>openForm();
document.addEventListener('click',e=>{if(e.target.dataset.close)$('#productModal').classList.remove('open');if(e.target.dataset.edit)openForm(products.find(p=>p.id===e.target.dataset.edit));if(e.target.dataset.del&&confirm('Delete this product?')){products=products.filter(p=>p.id!==e.target.dataset.del);persist()}});
$('#pimages').onchange=e=>{$('#preview').innerHTML=[...e.target.files].map(f=>`<img src="${URL.createObjectURL(f)}" alt="">`).join('')};
$('#productForm').onsubmit=e=>{e.preventDefault();const id=$('#pid').value||('p-'+Date.now());const old=products.find(x=>x.id===id);const files=[...$('#pimages').files];const p={id,name:$('#pname').value.trim(),model:$('#pmodel').value.trim(),oldPrice:+$('#pold').value||0,price:+$('#pprice').value||0,stock:$('#pstock').value===''?null:+$('#pstock').value,colors:$('#pcolors').value.split(',').map(x=>x.trim()).filter(Boolean),description:$('#pdesc').value.trim(),images:old?.images||[],localPreview:old?.localPreview||[]};if(files.length)p.localPreview=files.map(f=>URL.createObjectURL(f));const i=products.findIndex(x=>x.id===id);if(i>=0)products[i]=p;else products.push(p);persist();$('#productModal').classList.remove('open');};
$('#refreshOrders').onclick=()=>{$('#orderList').innerHTML='<div class="panel">No live orders yet. Orders will be connected after the secure database setup.</div>';render()};
$('#saveSettings').onclick=()=>{const s={wa:$('#setWa').value,fb:$('#setFb').value,ig:$('#setIg').value,local:+$('#setLocal').value||70,other:+$('#setOther').value||120};localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));$('#settingsMsg').textContent='Saved on this device.'};
render();

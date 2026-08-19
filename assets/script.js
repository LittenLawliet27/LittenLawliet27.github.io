const DATA_PATH = 'data/content.json';
let DATA = [];
const grid = document.getElementById('grid');
const tagbar = document.getElementById('tagbar');
const search = document.getElementById('search');
const typeFilter = document.getElementById('typeFilter');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalMeta = document.getElementById('modalMeta');
const modalLinks = document.getElementById('modalLinks');
const modalClose = document.getElementById('modalClose');
const darkToggle = document.getElementById('darkToggle');

async function loadData(){
  const res = await fetch(DATA_PATH);
  DATA = await res.json();
  renderTagbar();
  renderGrid();
}

function uniqueTags(){
  const s = new Set();
  DATA.items.forEach(i => (i.tags||[]).forEach(t => s.add(t)));
  return [...s].sort();
}

function renderTagbar(){
  tagbar.innerHTML = '<strong>Tags:</strong>';
  uniqueTags().forEach(t=>{
    const btn = document.createElement('button');
    btn.className='tag';
    btn.innerText=t;
    btn.onclick = () => { search.value = t; renderGrid(); }
    tagbar.appendChild(btn);
  });
}

function renderGrid(){
  const q = search.value.toLowerCase();
  const type = typeFilter.value;
  grid.innerHTML = '';
  const items = DATA.items.filter(it=>{
    if(type!=='all' && it.type !== type) return false;
    if(!q) return true;
    const hay = (it.title+' '+(it.description||'')+' '+(it.tags||[]).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  if(items.length===0){ grid.innerHTML = '<p style="padding:20px">No results</p>'; return; }
  items.forEach(it=>{
    const el = document.createElement('article');
    el.className = 'card';
    if(it.image) el.innerHTML = `<img src="${it.image}" alt="">`;
    el.innerHTML += `<h3>${it.title}</h3><div class="meta">${it.description||''}</div>`;
    const tagWrap = document.createElement('div'); tagWrap.className='tags';
    (it.tags||[]).forEach(t=>{ const tEl = document.createElement('span'); tEl.className='tag-small'; tEl.innerText = t; tEl.onclick = () => { search.value = t; renderGrid(); }; tagWrap.appendChild(tEl); });
    el.appendChild(tagWrap);
    const actions = document.createElement('div'); actions.className='actions';
    const viewBtn = document.createElement('button'); viewBtn.className='button'; viewBtn.textContent='View';
    viewBtn.onclick = () => openModal(it);
    actions.appendChild(viewBtn);
    if(it.links && it.links.length){
      const out = document.createElement('a'); out.className='button'; out.href = it.links[0].url; out.target='_blank'; out.rel='noopener'; out.textContent='Open site';
      actions.appendChild(out);
    }
    el.appendChild(actions);
    grid.appendChild(el);
  });
}

function openModal(item){
  modal.setAttribute('aria-hidden','false');
  modalTitle.innerText = item.title;
  modalMeta.innerText = `${item.type.toUpperCase()} • ${ (item.tags||[]).join(', ') }`;
  modalBody.innerHTML = '';
  // If body is markdown, render it
  if(item.body){
    modalBody.innerHTML = marked.parse(item.body || '');
    // optional code highlighting
    modalBody.querySelectorAll('pre code').forEach((b)=>hljs.highlightElement(b));
  }
  modalLinks.innerHTML = '';
  (item.links||[]).forEach(l=>{
    const a = document.createElement('a'); a.href = l.url; a.target='_blank'; a.rel='noopener'; a.innerText = l.label || l.url;
    modalLinks.appendChild(a);
  });
  // If the item provides embed and it's allowed, include an iframe
  if(item.embed && item.embed.src){
    const iframe = document.createElement('iframe');
    iframe.src = item.embed.src; iframe.width='100%'; iframe.height = item.embed.height || 420; iframe.style.border='1px solid rgba(0,0,0,0.06); margin-top:12px';
    modalBody.appendChild(iframe);
  }
}

modalClose.onclick = () => modal.setAttribute('aria-hidden','true');
modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });
search.addEventListener('input', renderGrid);
typeFilter.addEventListener('change', renderGrid);
darkToggle.addEventListener('click', ()=>{
  if(document.documentElement.hasAttribute('data-theme')) { document.documentElement.removeAttribute('data-theme'); darkToggle.innerText='Dark'; }
  else { document.documentElement.setAttribute('data-theme','dark'); darkToggle.innerText='Light'; }
});

loadData().catch(err=>{ console.error(err); grid.innerHTML='<p style="padding:20px;color:#900">Failed to load content.json</p>' });

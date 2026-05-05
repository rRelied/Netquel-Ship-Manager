// Netquel Ship Manager - Popup v6
'use strict';

const FAVORITES_CAP = 9;
const MAX_HISTORY   = 3;
const TAG_COLORS = [
  '#ff4d6d','#ff8c42','#ffd700','#00e5a0','#0af','#a78bfa','#f472b6',
  '#34d399','#60a5fa','#fb923c','#e879f9','#4ade80'
];
const FOLDER_COLORS = TAG_COLORS;

// ══ STORAGE ══════════════════════════════════════════════════════════════════
function getData() {
  return new Promise(resolve => {
    chrome.storage.local.get(
      ['ships','folders','username','discord','avatarData','folderState','commands','fontSize','folderColors','hotkeyMode'], d => {
      resolve({
        ships:        d.ships        || {},
        folders:      d.folders      || [],
        username:     d.username     || '',
        discord:      d.discord      || '',
        avatarData:   d.avatarData   || '',
        folderState:  d.folderState  || {},
        commands:     d.commands     || defaultCommands(),
        fontSize:     d.fontSize     || 'medium',
        folderColors: d.folderColors || {},
        hotkeyMode:   d.hotkeyMode   || 'number'
      });
    });
  });
}
function setAll(ships, folders)    { return new Promise(r => chrome.storage.local.set({ ships, folders }, r)); }
function saveFolderState(fs)       { chrome.storage.local.set({ folderState: fs }); }
function saveFolderColors(fc)      { return new Promise(r => chrome.storage.local.set({ folderColors: fc }, r)); }
function saveProfile(u, d, av)     { return new Promise(r => chrome.storage.local.set({ username:u, discord:d, avatarData:av }, r)); }
function saveCommands(cmds)        { return new Promise(r => chrome.storage.local.set({ commands: cmds }, r)); }
function saveHotkeyMode(m)  { return new Promise(r => chrome.storage.local.set({ hotkeyMode: m }, r)); }
function saveFontSize(sz)          { return new Promise(r => chrome.storage.local.set({ fontSize: sz }, r)); }

function defaultCommands() {
  return { name:'name', load:'load', list:'list', delete:'delete', help:'help' };
}

// ══ HELPERS ══════════════════════════════════════════════════════════════════
function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function getCode(e) { return !e ? null : (typeof e==='string' ? e : e.code||null); }
function uniqueName(base, ships) {
  if (!ships[base]) return base;
  let i = 1;
  while (ships[`${base} (${i})`]) i++;
  return `${base} (${i})`;
}
function shortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ══ STATE ════════════════════════════════════════════════════════════════════
let clipboard  = null;
let dragName   = null;
let ctxTarget  = null;
let colorPickerTarget = null; // { folder }

const IS_FULL_PAGE = !!(new URLSearchParams(location.search).get('fullpage'));
const IS_SIDEBAR   = !!(new URLSearchParams(location.search).get('sidebar'));
if (IS_FULL_PAGE || IS_SIDEBAR) {
  document.getElementById('expand-bar').style.display = 'none';
  document.body.classList.add(IS_FULL_PAGE ? 'fullpage' : 'sidebar-mode');
}

// ══ FONT SIZE ════════════════════════════════════════════════════════════════
const FONT_CLASSES = ['fs-small','fs-medium','fs-large','fs-xl'];
function applyFontSize(size) {
  FONT_CLASSES.forEach(c => document.body.classList.remove(c));
  document.body.classList.add(`fs-${size}`);
  document.querySelectorAll('.fs-opt').forEach(o =>
    o.classList.toggle('active', o.dataset.size === size));
}
document.querySelectorAll('.fs-opt').forEach(opt => {
  opt.addEventListener('click', async () => {
    applyFontSize(opt.dataset.size);
    await saveFontSize(opt.dataset.size);
  });
});

// ══ INIT ═════════════════════════════════════════════════════════════════════
async function init() {
  const data = await getData();
  applyFontSize(data.fontSize || 'medium');
  if (!data.username) {
    document.getElementById('onboarding').classList.add('active');
  } else {
    startApp(data);
  }
}

function startApp(data) {
  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('app').classList.add('active');
  applyProfile(data.username, data.discord, data.avatarData);
  applyHotkeyModeUI(data.hotkeyMode || 'number');
  renderAll();
  renderCmdEditor();
}

document.getElementById('ob-confirm').addEventListener('click', async () => {
  const val = document.getElementById('ob-username').value.trim();
  const err = document.getElementById('ob-err');
  if (!val) { err.textContent = 'Please enter your username.'; return; }
  await saveProfile(val, '', '');
  startApp({ username:val, discord:'', avatarData:'' });
});
document.getElementById('ob-username').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('ob-confirm').click();
});

// ══ PROFILE ══════════════════════════════════════════════════════════════════
function applyProfile(username, discord, avatarData) {
  const name       = (username||'Commander').toUpperCase();
  const discordTxt = discord ? `Discord: ${discord}` : '';
  const avatarHTML = avatarData ? `<img src="${avatarData}" alt="avatar"/>` : '👤';
  document.getElementById('sb-avatar').innerHTML = avatarHTML;
  ['q','fm'].forEach(id => {
    const av=document.getElementById(`pb-avatar-${id}`); if(av) av.innerHTML=avatarHTML;
    const nm=document.getElementById(`pb-name-${id}`);   if(nm) nm.textContent=name;
    const dc=document.getElementById(`pb-discord-${id}`);if(dc) dc.textContent=discordTxt;
  });
  const bigAv=document.getElementById('big-avatar-btn'); if(bigAv) bigAv.innerHTML=avatarHTML;
  const ud=document.getElementById('profile-uname-display'); if(ud) ud.textContent=name;
  const dd=document.getElementById('profile-discord-display'); if(dd) dd.textContent=discordTxt;
  const pu=document.getElementById('prof-username'); if(pu) pu.value=username||'';
  const pd=document.getElementById('prof-discord'); if(pd) pd.value=discord||'';
}

document.getElementById('prof-save').addEventListener('click', async () => {
  const u=document.getElementById('prof-username').value.trim();
  const d=document.getElementById('prof-discord').value.trim();
  if (!u) { alert('Username cannot be empty.'); return; }
  const { avatarData } = await getData();
  await saveProfile(u, d, avatarData);
  applyProfile(u, d, avatarData);
  document.getElementById('prof-save').textContent='Saved!';
  setTimeout(()=>document.getElementById('prof-save').textContent='Save Profile',1500);
});
document.getElementById('big-avatar-btn').addEventListener('click', ()=>document.getElementById('avatar-import').click());
document.getElementById('avatar-import').addEventListener('change', async e => {
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=async ev=>{
    const dataUrl=ev.target.result;
    const {username,discord}=await getData();
    await saveProfile(username,discord,dataUrl);
    applyProfile(username,discord,dataUrl);
  };
  reader.readAsDataURL(file); e.target.value='';
});
document.querySelectorAll('[data-pane="pane-profile"]').forEach(el=>{
  el.addEventListener('click',()=>switchPane('pane-profile'));
});

// ══ NAV ══════════════════════════════════════════════════════════════════════
function switchPane(paneId) {
  document.querySelectorAll('.sb-btn,.sb-avatar').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  const pane=document.getElementById(paneId); if(pane) pane.classList.add('active');
  const match=document.querySelector(`.sb-btn[data-pane="${paneId}"]`); if(match) match.classList.add('active');
  if(paneId==='pane-profile') document.getElementById('sb-avatar').classList.add('active');
}
document.querySelectorAll('.sb-btn[data-pane]').forEach(btn=>btn.addEventListener('click',()=>switchPane(btn.dataset.pane)));
document.getElementById('sb-avatar').addEventListener('click',()=>switchPane('pane-profile'));

// ══ EXPAND / SIDEBAR ═════════════════════════════════════════════════════════
document.getElementById('sb-logo-btn').addEventListener('click',()=>chrome.tabs.create({url:chrome.runtime.getURL('popup.html')+'?fullpage=1'}));
document.getElementById('expand-page-btn')?.addEventListener('click',()=>chrome.tabs.create({url:chrome.runtime.getURL('popup.html')+'?fullpage=1'}));
document.getElementById('pb-expand-btn')?.addEventListener('click',()=>chrome.tabs.create({url:chrome.runtime.getURL('popup.html')+'?fullpage=1'}));
document.getElementById('sidebar-btn')?.addEventListener('click', async () => {
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab?.url?.includes('netquel.com')){alert('Navigate to Netquel.com first.');return;}
  chrome.tabs.sendMessage(tab.id,{type:'OPEN_SIDEBAR'}).catch(()=>alert('Could not open sidebar. Make sure you are on Netquel.com.'));
  window.close();
});

// ══ QUICK-COPY CODE ═══════════════════════════════════════════════════════════
document.getElementById('qc-btn').addEventListener('click', async () => {
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab?.url?.includes('netquel.com')){alert('Open Netquel.com first!');return;}
  chrome.tabs.sendMessage(tab.id,{type:'GET_SAVE_CODE'}, async resp => {
    if(chrome.runtime.lastError||!resp?.code){alert('No /save code found in chat yet. Type /save in Netquel first.');return;}
    await navigator.clipboard.writeText(resp.code);
    const el=document.getElementById('qc-copied');
    el.classList.add('show');
    setTimeout(()=>el.classList.remove('show'),2000);
  });
});

// ══ RENDER ALL ═══════════════════════════════════════════════════════════════
async function renderAll() { await renderQuick(); await renderFiles(); }

// ══ FAVORITES ════════════════════════════════════════════════════════════════
async function renderQuick(filter='') {
  const {ships,hotkeyMode}=await getData();
  const badge=document.getElementById('ql-badge');
  const capEl=document.getElementById('fav-cap');
  const list=document.getElementById('quick-list');
  const starred=Object.entries(ships).filter(([,v])=>v?.starred);
  const count=starred.length;
  badge.textContent=`${count} / ${FAVORITES_CAP}`;
  capEl.textContent=`${count}/${FAVORITES_CAP}`;
  capEl.className='fav-cap'+(count>=FAVORITES_CAP?' full':count>=FAVORITES_CAP-1?' near':'');
  const shown=filter?starred.filter(([n])=>n.toLowerCase().includes(filter.toLowerCase())):starred;
  if(shown.length===0){
    list.innerHTML=`<div class="empty-state"><div class="eicon">⭐</div>
      <div>${count===0?'No favorites yet.':'No results.'}</div>
      <div class="ehint">${count===0?'Use ⋯ on any ship → "Add to Favorites"\nor drag to the folder above.\nMax 9. Use number keys 1–9 or F1–F9 to load instantly.':''}</div>
    </div>`; return;
  }
  list.innerHTML=shown.map(([name,entry],idx)=>{
    const folder=entry?.folder||'';
    const note=entry?.note||'';
    const tag=entry?.tag||'';
    const tagStyle=tag?`background:${tag};`:'background:transparent;';
    return `<div class="quick-item">
      <div class="qi-tag" style="${tagStyle}"></div>
      <button class="qi-unstar" data-name="${esc(name)}" title="Remove from Favorites">⭐</button>
      <div class="qi-info">
        <div class="qi-name">${esc(name)}</div>
        ${note?`<div class="qi-note">${esc(note.substring(0,40))}${note.length>40?'…':''}</div>`:''}
        ${folder?`<div class="qi-folder">📁 ${esc(folder)}</div>`:''}
      </div>
      <span class="fav-hotkey" title="Press ${hotkeyMode==='function'?'F'+(idx+1):(idx+1)} in Netquel to load instantly">${hotkeyMode==='function'?'F'+(idx+1):(idx+1)}</span>
      <button class="qi-load" data-name="${esc(name)}">LOAD</button>
    </div>`;
  }).join('');
}

document.getElementById('ql-search').addEventListener('input',e=>renderQuick(e.target.value));
document.getElementById('quick-list').addEventListener('click', async e=>{
  const unstarBtn=e.target.closest('.qi-unstar');
  if(unstarBtn){
    const name=unstarBtn.dataset.name;
    const {ships,folders}=await getData();
    if(ships[name]){ships[name].starred=false;await setAll(ships,folders);renderAll();}
    return;
  }
  const loadBtn=e.target.closest('.qi-load');
  if(loadBtn) await loadShip(loadBtn.dataset.name);
});

// Favorites drop zone
const favDropZone=document.getElementById('fav-drop-zone');
favDropZone.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';favDropZone.classList.add('drag-over');});
favDropZone.addEventListener('dragleave',e=>{if(!favDropZone.contains(e.relatedTarget))favDropZone.classList.remove('drag-over');});
favDropZone.addEventListener('drop',async e=>{e.preventDefault();favDropZone.classList.remove('drag-over');const name=dragName||e.dataTransfer.getData('text/plain');if(name)await addToFavorites(name);});

async function addToFavorites(name) {
  const {ships,folders}=await getData();
  if(!ships[name]||ships[name].starred) return;
  if(Object.values(ships).filter(v=>v?.starred).length>=FAVORITES_CAP){alert(`Favorites full! Max ${FAVORITES_CAP}.`);return;}
  ships[name].starred=true;await setAll(ships,folders);renderAll();
}
async function removeFromFavorites(name) {
  const {ships,folders}=await getData();
  if(!ships[name]) return;
  ships[name].starred=false;await setAll(ships,folders);renderAll();
}

// ══ FILE MANAGER ═════════════════════════════════════════════════════════════
async function renderFiles(filter='') {
  const {ships,folders,folderState,folderColors}=await getData();
  const list=document.getElementById('fm-list');
  const names=Object.keys(ships);
  const filtered=filter?names.filter(n=>n.toLowerCase().includes(filter.toLowerCase())):names;
  if(names.length===0){
    list.innerHTML=`<div class="empty-state"><div class="eicon">🛸</div><div>No ships yet.</div>
      <div class="ehint">Click "+ Ship" or use .name in chat after /save.</div></div>`;return;
  }
  if(filtered.length===0){
    list.innerHTML=`<div class="empty-state"><div class="eicon">🔍</div><div>No results for "${esc(filter)}"</div></div>`;return;
  }
  let html='';
  if(filter){filtered.forEach(n=>{html+=shipRowHtml(n,ships[n],true,folderColors);});list.innerHTML=html;bindFileDrag();return;}
  folders.forEach(folder=>{
    const folderShips=filtered.filter(n=>ships[n]?.folder===folder);
    const isOpen=folderState[folder]!==false;
    const color=folderColors[folder]||'';
    const colorStyle=color?`style="background:${color}20;border-bottom-color:${color}40;"`:'';
    const stripStyle=color?`style="background:${color};"`:''
    html+=`<div class="fm-folder${isOpen?' open':''}" data-folder="${esc(folder)}" ${colorStyle}>
      <div class="ff-color-strip" ${stripStyle}></div>
      <span class="ff-arrow">▶</span>
      <span class="ff-icon">${isOpen?'📂':'📁'}</span>
      <span class="ff-name">${esc(folder)}</span>
      <span class="ff-count">${folderShips.length}</span>
      <div class="ff-color-btn" data-action="folder-color" data-folder="${esc(folder)}"
           style="background:${color||'#1a2d45'}" title="Set folder color"></div>
      <button class="ff-del" data-action="del-folder" data-folder="${esc(folder)}">✕</button>
    </div>`;
    if(isOpen){
      if(folderShips.length===0){
        html+=`<div style="color:var(--muted);font-size:var(--fs-xs);padding:7px 10px 7px 22px;border-bottom:1px solid rgba(26,45,69,.3);">Empty — drop ships here</div>`;
      }else{folderShips.forEach(n=>{html+=shipRowHtml(n,ships[n],false,folderColors);});}
    }
  });
  const ungrouped=filtered.filter(n=>!ships[n]?.folder);
  if(ungrouped.length>0){
    if(folders.length>0){html+=`<div class="fm-folder" style="pointer-events:none;opacity:.45;"><span class="ff-arrow" style="opacity:0">▶</span><span class="ff-icon">📄</span><span class="ff-name">Ungrouped</span><span class="ff-count">${ungrouped.length}</span></div>`;}
    ungrouped.forEach(n=>{html+=shipRowHtml(n,ships[n],true,folderColors);});
  }
  list.innerHTML=html;bindFileDrag();
}

function shipRowHtml(name,entry,ungrouped) {
  const code=getCode(entry)||'';
  const note=entry?.note||'';
  const tag=entry?.tag||'';
  const tagStyle=tag?`background:${tag};`:'background:transparent;';
  const noteTip=note?`<div class="fs-note-tip">📝 ${esc(note)}</div>`:'';
  return `<div class="fm-ship${ungrouped?' ungrouped':''}" draggable="true"
    data-name="${esc(name)}" data-folder="${esc(entry?.folder||'')}">
    <div class="fs-tag" style="${tagStyle}"></div>
    ${noteTip}
    <div class="fs-info">
      <div class="fs-name">${esc(name)}</div>
      <div class="fs-meta">
        <div class="fs-code">${esc(code.substring(0,44))}${code.length>44?'…':''}</div>
        ${note?`<span class="fs-note-badge" title="${esc(note)}">📝</span>`:''}
        ${entry?.history?.length?`<span class="fs-note-badge" title="${entry.history.length} snapshot${entry.history.length>1?'s':''}">🕐</span>`:''}
      </div>
    </div>
    <div class="fs-btns">
      <button class="fs-btn load" data-name="${esc(name)}">LOAD</button>
      <div class="fs-dots" data-action="dots" data-name="${esc(name)}" title="More">⋯</div>
    </div>
  </div>`;
}

// ══ CONTEXT MENU ═════════════════════════════════════════════════════════════
const ctxMenu=document.getElementById('ctx-menu');
const ctxFavItem=document.getElementById('ctx-fav');

function openCtxMenu(x,y,name,entry) {
  ctxTarget={name,entry};
  ctxFavItem.textContent=entry?.starred?'☆ Remove from Favorites':'⭐ Add to Favorites';
  ctxMenu.style.left=x+'px'; ctxMenu.style.top=y+'px';
  ctxMenu.classList.add('show');
  requestAnimationFrame(()=>{
    const r=ctxMenu.getBoundingClientRect();
    if(r.right>window.innerWidth)  ctxMenu.style.left=(x-r.width)+'px';
    if(r.bottom>window.innerHeight) ctxMenu.style.top=(y-r.height)+'px';
  });
}
function closeCtxMenu(){ctxMenu.classList.remove('show');ctxTarget=null;}
document.addEventListener('click',e=>{
  if(!ctxMenu.contains(e.target)) closeCtxMenu();
  if(!document.getElementById('color-picker-pop').contains(e.target)&&!e.target.closest('[data-action="folder-color"]')) closeColorPicker();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCtxMenu();closeModal();closeColorPicker();}});

ctxFavItem.addEventListener('click',async()=>{
  if(!ctxTarget) return;
  const {name,entry}=ctxTarget; closeCtxMenu();
  if(entry?.starred) await removeFromFavorites(name); else await addToFavorites(name);
});
document.getElementById('ctx-note').addEventListener('click',()=>{
  if(!ctxTarget) return; openNoteModal(ctxTarget.name,ctxTarget.entry); closeCtxMenu();
});
document.getElementById('ctx-history').addEventListener('click',()=>{
  if(!ctxTarget) return; openHistoryModal(ctxTarget.name,ctxTarget.entry); closeCtxMenu();
});
document.getElementById('ctx-share').addEventListener('click',()=>{
  if(!ctxTarget) return; openShareModal(ctxTarget.name,ctxTarget.entry); closeCtxMenu();
});
document.getElementById('ctx-rename').addEventListener('click',()=>{
  if(!ctxTarget) return; openRenameModal(ctxTarget.name); closeCtxMenu();
});
document.getElementById('ctx-change-code').addEventListener('click',()=>{
  if(!ctxTarget) return; openChangeCodeModal(ctxTarget.name,ctxTarget.entry); closeCtxMenu();
});
document.getElementById('ctx-move').addEventListener('click',()=>{
  if(!ctxTarget) return; openMoveModal(ctxTarget.name,ctxTarget.entry); closeCtxMenu();
});
document.getElementById('ctx-delete').addEventListener('click',async()=>{
  if(!ctxTarget) return;
  const {name}=ctxTarget; closeCtxMenu();
  if(!confirm(`Delete "${name}"?`)) return;
  const {ships,folders}=await getData(); delete ships[name]; await setAll(ships,folders); renderAll();
});

// ══ FOLDER COLOR PICKER ═══════════════════════════════════════════════════════
const colorPickerPop=document.getElementById('color-picker-pop');
const cpSwatches=document.getElementById('cp-swatches');

// Build swatches once
FOLDER_COLORS.forEach(color=>{
  const s=document.createElement('div');
  s.className='cp-swatch'; s.style.background=color; s.dataset.color=color;
  s.addEventListener('click',()=>applyFolderColor(color));
  cpSwatches.appendChild(s);
});
document.getElementById('cp-none').addEventListener('click',()=>applyFolderColor(''));

async function applyFolderColor(color) {
  if(!colorPickerTarget) return;
  const {folderColors}=await getData();
  if(color) folderColors[colorPickerTarget]=color;
  else delete folderColors[colorPickerTarget];
  await saveFolderColors(folderColors);
  closeColorPicker(); renderFiles(document.getElementById('fm-search').value);
}

function openColorPicker(folder,anchorEl) {
  colorPickerTarget=folder;
  const rect=anchorEl.getBoundingClientRect();
  colorPickerPop.style.left=rect.left+'px';
  colorPickerPop.style.top=(rect.bottom+4)+'px';
  // Update active state
  getData().then(({folderColors})=>{
    const cur=folderColors[folder]||'';
    cpSwatches.querySelectorAll('.cp-swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===cur));
  });
  colorPickerPop.classList.add('show');
}
function closeColorPicker(){colorPickerPop.classList.remove('show');colorPickerTarget=null;}

// ══ DRAG & DROP ══════════════════════════════════════════════════════════════
function bindFileDrag() {
  document.querySelectorAll('.fm-ship[draggable]').forEach(el=>{
    el.addEventListener('dragstart',e=>{
      dragName=el.dataset.name; e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',dragName);
      requestAnimationFrame(()=>el.classList.add('dragging'));
    });
    el.addEventListener('dragend',()=>{
      el.classList.remove('dragging'); dragName=null;
      document.querySelectorAll('.drag-over').forEach(r=>r.classList.remove('drag-over'));
    });
  });
  document.querySelectorAll('.fm-folder[data-folder]').forEach(el=>{
    if(el.style.pointerEvents==='none') return;
    el.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';el.classList.add('drag-over');});
    el.addEventListener('dragleave',e=>{if(!el.contains(e.relatedTarget))el.classList.remove('drag-over');});
    el.addEventListener('drop',async e=>{e.preventDefault();el.classList.remove('drag-over');
      const name=dragName||e.dataTransfer.getData('text/plain');if(name)await moveShip(name,el.dataset.folder||'');});
  });
  const fmList=document.getElementById('fm-list');
  fmList.addEventListener('dragover',e=>{if(e.target.closest('.fm-folder'))return;e.preventDefault();e.dataTransfer.dropEffect='move';});
  fmList.addEventListener('drop',async e=>{if(e.target.closest('.fm-folder'))return;e.preventDefault();
    const name=dragName||e.dataTransfer.getData('text/plain');if(name)await moveShip(name,'');});
}

async function moveShip(name,targetFolder) {
  const {ships,folders}=await getData();
  if(!ships[name]||ships[name].folder===targetFolder) return;
  ships[name]={...ships[name],folder:targetFolder}; await setAll(ships,folders); renderAll();
}

// ══ FM CLICK HANDLER ═════════════════════════════════════════════════════════
document.getElementById('fm-list').addEventListener('click',async e=>{
  const loadBtn=e.target.closest('.fs-btn.load');
  if(loadBtn){await loadShip(loadBtn.dataset.name);return;}

  const dotsEl=e.target.closest('[data-action="dots"]');
  if(dotsEl){e.stopPropagation();
    const rect=dotsEl.getBoundingClientRect(); const name=dotsEl.dataset.name;
    const {ships}=await getData(); openCtxMenu(rect.right+4,rect.top,name,ships[name]||{}); return;}

  // Folder color button
  const colorBtn=e.target.closest('[data-action="folder-color"]');
  if(colorBtn){e.stopPropagation(); openColorPicker(colorBtn.dataset.folder,colorBtn); return;}

  const delFolderBtn=e.target.closest('[data-action="del-folder"]');
  if(delFolderBtn){e.stopPropagation();
    const folder=delFolderBtn.dataset.folder;
    if(!confirm(`Delete folder "${folder}"? Ships inside become ungrouped.`)) return;
    const {ships,folders}=await getData();
    Object.keys(ships).forEach(n=>{if(ships[n]?.folder===folder)ships[n].folder='';});
    await setAll(ships,folders.filter(f=>f!==folder)); renderAll(); return;}

  const shipRow=e.target.closest('.fm-ship');
  if(shipRow&&!e.target.closest('button')&&!e.target.closest('[data-action]')){
    document.querySelectorAll('.fm-ship').forEach(r=>r.classList.remove('selected'));
    shipRow.classList.add('selected');
  }
});

// Folder toggle
document.getElementById('fm-list').addEventListener('click',async e=>{
  if(e.target.closest('button')||e.target.closest('[data-action]')) return;
  const folderRow=e.target.closest('.fm-folder[data-folder]'); if(!folderRow) return;
  const fname=folderRow.dataset.folder; if(!fname) return;
  const {folderState}=await getData();
  folderState[fname]=(folderState[fname]!==false)?false:true;
  saveFolderState(folderState);
  renderFiles(document.getElementById('fm-search').value);
});

// Clipboard
document.getElementById('cb-paste').addEventListener('click',()=>{if(clipboard)openMoveModal(clipboard.name,clipboard.entry);});
document.getElementById('cb-clear').addEventListener('click',()=>{
  clipboard=null; document.getElementById('clipboard-bar').classList.remove('show');
  document.querySelectorAll('.fm-ship').forEach(r=>r.classList.remove('selected'));
});
document.addEventListener('keydown',async e=>{
  if(!document.getElementById('app').classList.contains('active')) return;
  if(!e.ctrlKey&&!e.metaKey) return;
  if(e.key==='c'){
    const sel=document.querySelector('.fm-ship.selected'); if(!sel) return;
    const name=sel.dataset.name; const {ships}=await getData(); if(!ships[name]) return;
    clipboard={name,entry:{...ships[name]}};
    document.getElementById('cb-name').textContent=name;
    document.getElementById('clipboard-bar').classList.add('show');
  }
  if(e.key==='v'&&clipboard) openMoveModal(clipboard.name,clipboard.entry);
});

document.getElementById('fm-search').addEventListener('input',e=>renderFiles(e.target.value));
document.getElementById('fm-add-ship').addEventListener('click',openAddShipModal);
document.getElementById('fm-add-folder').addEventListener('click',openAddFolderModal);

// ══ MODAL SYSTEM ═════════════════════════════════════════════════════════════
let modalConfirmFn=null;
function openModal(title,bodyHtml,confirmLabel,onConfirm){
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-body').innerHTML=bodyHtml;
  document.getElementById('modal-err').textContent='';
  document.getElementById('modal-confirm').textContent=confirmLabel;
  modalConfirmFn=onConfirm;
  document.getElementById('modal-overlay').classList.add('show');
  const first=document.querySelector('#modal-body input,#modal-body select,#modal-body textarea');
  if(first) setTimeout(()=>first.focus(),50);
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('show');modalConfirmFn=null;}
document.getElementById('modal-confirm').addEventListener('click',()=>{if(modalConfirmFn)modalConfirmFn();});
document.getElementById('modal-cancel').addEventListener('click',closeModal);
document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('modal-overlay'))closeModal();});
document.getElementById('modal-body').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA')document.getElementById('modal-confirm').click();});

// ── Add Ship ─────────────────────────────────────────────────────────────────
async function openAddShipModal(){
  const {folders}=await getData();
  const opts=folders.map(f=>`<option value="${esc(f)}">${esc(f)}</option>`).join('');
  openModal('ADD SHIP',`
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div><label>SHIP NAME</label><input id="m-name" placeholder="e.g. BigDestroyer" autocomplete="off" spellcheck="false"/></div>
      <div><label>SAVE CODE</label><input id="m-code" placeholder="e.g. netquel0j~..." autocomplete="off" spellcheck="false"/></div>
      <div><label>FOLDER</label><select id="m-folder"><option value="">— No folder —</option>${opts}</select></div>
    </div>`,'SAVE',async()=>{
    const name=document.getElementById('m-name').value.trim();
    const code=document.getElementById('m-code').value.trim();
    const folder=document.getElementById('m-folder').value;
    const err=document.getElementById('modal-err');
    if(!name){err.textContent='Enter a ship name.';return;}
    if(!code){err.textContent='Enter the save code.';return;}
    const {ships,folders:fl}=await getData();
    if(ships[name]){err.textContent=`"${name}" already exists.`;return;}
    ships[name]={code,folder,starred:false,note:'',tag:'',history:[]};
    await setAll(ships,fl);closeModal();renderAll();
  });
}

// ── Add Folder ───────────────────────────────────────────────────────────────
function openAddFolderModal(){
  openModal('NEW FOLDER',`<div><label>FOLDER NAME</label><input id="m-fname" placeholder="e.g. Fighters" autocomplete="off" spellcheck="false"/></div>`
  ,'CREATE',async()=>{
    const name=document.getElementById('m-fname').value.trim();
    const err=document.getElementById('modal-err');
    if(!name){err.textContent='Enter a folder name.';return;}
    const {ships,folders}=await getData();
    if(folders.includes(name)){err.textContent=`"${name}" already exists.`;return;}
    folders.push(name);await setAll(ships,folders);closeModal();renderAll();
  });
}

// ── Rename ───────────────────────────────────────────────────────────────────
function openRenameModal(name){
  openModal('RENAME SHIP',`<div><label>NEW NAME</label><input id="m-newname" value="${esc(name)}" autocomplete="off" spellcheck="false"/></div>`
  ,'RENAME',async()=>{
    const newName=document.getElementById('m-newname').value.trim();
    const err=document.getElementById('modal-err');
    if(!newName){err.textContent='Enter a name.';return;}
    if(newName===name){closeModal();return;}
    const {ships,folders}=await getData();
    if(ships[newName]){err.textContent=`"${newName}" already exists.`;return;}
    ships[newName]={...ships[name]};delete ships[name];
    await setAll(ships,folders);closeModal();renderAll();
  });
}

// ── Change Code ───────────────────────────────────────────────────────────────
function openChangeCodeModal(name,entry){
  const cur=getCode(entry)||'';
  openModal('CHANGE CODE',`
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div><label>SHIP</label><div style="color:var(--accent);padding:4px 0;">${esc(name)}</div></div>
      <div><label>CURRENT CODE</label>
        <div style="font-size:var(--fs-xs);color:var(--muted);padding:5px 8px;background:var(--bg);border-radius:4px;word-break:break-all;">${esc(cur||'(none)')}</div>
      </div>
      <div><label>NEW SAVE CODE</label><input id="m-newcode" placeholder="netquel..." autocomplete="off" spellcheck="false"/></div>
    </div>`,'UPDATE',async()=>{
    const newCode=document.getElementById('m-newcode').value.trim();
    const err=document.getElementById('modal-err');
    if(!newCode){err.textContent='Enter the new save code.';return;}
    const {ships,folders}=await getData();
    if(!ships[name]){err.textContent='Ship not found.';return;}
    // Push old code to history before overwriting
    const oldCode=getCode(ships[name]);
    const history=ships[name].history||[];
    if(oldCode&&oldCode!==newCode){
      history.unshift({code:oldCode,date:new Date().toISOString()});
      if(history.length>MAX_HISTORY) history.splice(MAX_HISTORY);
    }
    ships[name]={...ships[name],code:newCode,history};
    await setAll(ships,folders);closeModal();renderAll();
  });
}

// ── Move ──────────────────────────────────────────────────────────────────────
async function openMoveModal(name,entry){
  const {folders}=await getData();
  const opts=folders.map(f=>`<option value="${esc(f)}">${esc(f)}</option>`).join('');
  openModal(`MOVE "${name}"`,`
    <div><label>DESTINATION FOLDER</label>
      <select id="m-dest"><option value="">— Ungrouped —</option>${opts}</select>
    </div>`,'MOVE',async()=>{
    const dest=document.getElementById('m-dest').value;
    const {ships,folders:fl}=await getData();
    if(!ships[name]) return;
    ships[name]={...ships[name],folder:dest};
    await setAll(ships,fl);closeModal();
    clipboard=null;document.getElementById('clipboard-bar').classList.remove('show');
    document.querySelectorAll('.fm-ship').forEach(r=>r.classList.remove('selected'));
    renderAll();
  });
}

// ── Note & Tag ────────────────────────────────────────────────────────────────
function openNoteModal(name,entry){
  const currentNote=entry?.note||'';
  const currentTag=entry?.tag||'';
  const swatches=TAG_COLORS.map(c=>`<div class="tag-swatch${c===currentTag?' active':''}"
    style="background:${c}" data-color="${c}" title="${c}"></div>`).join('');
  openModal(`NOTE & TAG — "${name}"`,`
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div>
        <label>NOTE <span style="color:var(--muted);font-size:var(--fs-xs);text-transform:none;">(optional, visible on hover)</span></label>
        <textarea id="m-note" placeholder="e.g. Best for PvP, needs shield upgrade..." spellcheck="true">${esc(currentNote)}</textarea>
      </div>
      <div>
        <label>COLOR TAG</label>
        <div class="tag-swatches" id="tag-swatches">${swatches}</div>
        <button class="tag-none" id="tag-none" style="margin-top:6px;">✕ No tag</button>
      </div>
    </div>`,'SAVE',async()=>{
    const note=document.getElementById('m-note').value.trim();
    const activeTag=document.querySelector('#tag-swatches .tag-swatch.active');
    const tag=activeTag?activeTag.dataset.color:'';
    const {ships,folders}=await getData();
    if(!ships[name]) return;
    ships[name]={...ships[name],note,tag};
    await setAll(ships,folders);closeModal();renderAll();
  });
  // Wire swatch clicks after modal opens
  setTimeout(()=>{
    document.querySelectorAll('#tag-swatches .tag-swatch').forEach(s=>{
      s.addEventListener('click',()=>{
        document.querySelectorAll('#tag-swatches .tag-swatch').forEach(x=>x.classList.remove('active'));
        s.classList.add('active');
      });
    });
    document.getElementById('tag-none')?.addEventListener('click',()=>{
      document.querySelectorAll('#tag-swatches .tag-swatch').forEach(x=>x.classList.remove('active'));
    });
  },60);
}

// ── History ───────────────────────────────────────────────────────────────────
function openHistoryModal(name,entry){
  const history=entry?.history||[];
  const currentCode=getCode(entry)||'';
  if(history.length===0){
    openModal(`HISTORY — "${name}"`,`<div style="color:var(--muted);font-size:var(--fs-sm);padding:8px 0;">No previous versions recorded yet.<br>History is saved automatically when you change a ship's code.</div>`,'OK',closeModal);
    return;
  }
  const rows=history.map((h,i)=>`
    <div class="history-item">
      <div class="history-code" title="${esc(h.code)}">${esc(h.code.substring(0,36))}${h.code.length>36?'…':''}</div>
      <div class="history-date">${shortDate(h.date)}</div>
      <button class="history-restore" data-idx="${i}" data-code="${esc(h.code)}">Restore</button>
    </div>`).join('');
  openModal(`HISTORY — "${name}"`,`
    <div style="display:flex;flex-direction:column;gap:6px;">
      <div style="font-size:var(--fs-xs);color:var(--muted);margin-bottom:2px;">Last ${history.length} saved version${history.length>1?'s':''}</div>
      <div class="history-list">${rows}</div>
    </div>`,'CLOSE',closeModal);
  setTimeout(()=>{
    document.querySelectorAll('.history-restore').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const newCode=btn.dataset.code;
        if(!confirm(`Restore this code? Current code will move to history.`)) return;
        const {ships,folders}=await getData();
        if(!ships[name]) return;
        const oldCode=getCode(ships[name]);
        const hist=ships[name].history||[];
        if(oldCode&&oldCode!==newCode){
          hist.unshift({code:oldCode,date:new Date().toISOString()});
          if(hist.length>MAX_HISTORY) hist.splice(MAX_HISTORY);
        }
        // Remove this snapshot from history
        const idx=parseInt(btn.dataset.idx);
        hist.splice(idx-(hist.length!==history.length?1:0),1);
        ships[name]={...ships[name],code:newCode,history:hist};
        await setAll(ships,folders);closeModal();renderAll();
      });
    });
  },60);
}

// ── Share Link ────────────────────────────────────────────────────────────────
function openShareModal(name,entry){
  const code=getCode(entry)||'';
  if(!code){alert('This ship has no code.');return;}
  const b64=btoa(code);
  const url=chrome.runtime.getURL('share.html')+`?name=${encodeURIComponent(name)}&code=${encodeURIComponent(b64)}`;
  openModal(`SHARE — "${name}"`,`
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="font-size:var(--fs-xs);color:var(--muted);line-height:1.6;">
        Share this link. Anyone with Netquel Ship Manager can open it to copy the code and load the ship.
      </div>
      <div class="share-url-box" id="share-url-box">${esc(url)}</div>
    </div>`,'📋 Copy Link',async()=>{
    await navigator.clipboard.writeText(url);
    document.getElementById('modal-confirm').textContent='✓ Copied!';
    setTimeout(()=>document.getElementById('modal-confirm').textContent='📋 Copy Link',1500);
  });
}

// ══ EXPORT MODAL ═════════════════════════════════════════════════════════════
async function openExportModal(){
  const {ships,folders}=await getData();
  const overlay=document.getElementById('export-overlay');
  const tree=document.getElementById('export-tree');
  const countEl=document.getElementById('export-count');
  const doBtn=document.getElementById('export-do-btn');
  const allGroups=[
    ...folders.map(f=>({name:f,ships:Object.keys(ships).filter(n=>ships[n]?.folder===f)})),
    {name:'__ungrouped__',ships:Object.keys(ships).filter(n=>!ships[n]?.folder)}
  ].filter(g=>g.ships.length>0);
  if(allGroups.length===0){alert('No ships to export.');return;}
  let html='';
  allGroups.forEach(group=>{
    const label=group.name==='__ungrouped__'?'Ungrouped':group.name;
    const icon=group.name==='__ungrouped__'?'📄':'📁';
    html+=`<div class="exp-folder-label">
      <input type="checkbox" class="exp-folder-cb" data-group="${esc(group.name)}" checked/>
      <span>${icon} ${esc(label)}</span>
    </div>`;
    group.ships.forEach(n=>{html+=`<div class="exp-ship-row">
      <input type="checkbox" class="exp-ship-cb" data-name="${esc(n)}" data-group="${esc(group.name)}" checked/>
      <span class="exp-ship-name">${esc(n)}</span>
      ${ships[n]?.starred?'<span class="exp-ship-fav">⭐</span>':''}
    </div>`;});
  });
  tree.innerHTML=html; overlay.classList.add('show'); updateExportCount();
  tree.querySelectorAll('.exp-folder-cb').forEach(cb=>{
    cb.addEventListener('change',()=>{
      tree.querySelectorAll(`.exp-ship-cb[data-group="${CSS.escape(cb.dataset.group)}"]`).forEach(s=>s.checked=cb.checked);
      updateExportCount();
    });
  });
  tree.querySelectorAll('.exp-ship-cb').forEach(cb=>{
    cb.addEventListener('change',()=>{
      const all=[...tree.querySelectorAll(`.exp-ship-cb[data-group="${CSS.escape(cb.dataset.group)}"]`)];
      const fc=tree.querySelector(`.exp-folder-cb[data-group="${CSS.escape(cb.dataset.group)}"]`);
      if(fc) fc.checked=all.every(c=>c.checked); updateExportCount();
    });
  });
  function updateExportCount(){const sel=tree.querySelectorAll('.exp-ship-cb:checked').length;countEl.textContent=`${sel} selected`;doBtn.disabled=sel===0;}
  document.getElementById('export-sel-all').onclick=()=>{tree.querySelectorAll('.exp-ship-cb,.exp-folder-cb').forEach(c=>c.checked=true);updateExportCount();};
  document.getElementById('export-desel-all').onclick=()=>{tree.querySelectorAll('.exp-ship-cb,.exp-folder-cb').forEach(c=>c.checked=false);updateExportCount();};
}
function closeExportModal(){document.getElementById('export-overlay').classList.remove('show');}
document.getElementById('export-modal-close').addEventListener('click',closeExportModal);
document.getElementById('export-cancel-btn').addEventListener('click',closeExportModal);
document.getElementById('export-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('export-overlay'))closeExportModal();});
document.getElementById('export-do-btn').addEventListener('click',async()=>{
  const {ships,folders,username,discord}=await getData();
  const tree=document.getElementById('export-tree');
  const selected=new Set([...tree.querySelectorAll('.exp-ship-cb:checked')].map(c=>c.dataset.name));
  if(selected.size===0) return;
  const exportShips={},exportFolders=new Set();
  selected.forEach(name=>{if(ships[name]){exportShips[name]=ships[name];if(ships[name].folder)exportFolders.add(ships[name].folder);}});
  const payload={exportedBy:username,contact:{username,discord:discord||''},label:username?`${username}'s Ships`:'My Ships',ships:exportShips,folders:[...exportFolders]};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url;a.download=`${username||'netquel'}-ships.json`;a.click();URL.revokeObjectURL(url);closeExportModal();
});

// ══ IMPORT ═══════════════════════════════════════════════════════════════════
async function doImport(file){
  const text=await file.text(); let parsed;
  try{parsed=JSON.parse(text);}catch{alert('Invalid JSON file.');return;}
  const {ships:mine,folders:myFolders}=await getData();
  const inShips=parsed.ships||{},inFolders=parsed.folders||[],owner=parsed.exportedBy||'Unknown';
  const mergedFolders=[...new Set([...myFolders,...inFolders])];
  let added=0,duped=0;
  Object.entries(inShips).forEach(([name,val])=>{
    const code=typeof val==='string'?val:val.code;
    const folder=(typeof val==='object'&&val.folder)?val.folder:'';
    const finalName=uniqueName(name,mine);
    if(finalName!==name)duped++;else added++;
    mine[finalName]={code,folder,starred:false,note:val.note||'',tag:val.tag||'',history:val.history||[]};
  });
  await setAll(mine,mergedFolders);renderAll();
  const c=parsed.contact;const cs=c?.discord?` · Discord: ${c.discord}`:'';
  alert(`Imported from ${owner}${cs}!\nAdded: ${added}${duped?`, Renamed: ${duped}`:''}`);
}

document.getElementById('fm-export').addEventListener('click',openExportModal);
document.getElementById('fm-import-btn').addEventListener('click',()=>document.getElementById('file-import').click());
document.getElementById('file-import').addEventListener('change',e=>{const f=e.target.files[0];if(f)doImport(f);e.target.value='';});
document.getElementById('set-export').addEventListener('click',openExportModal);
document.getElementById('set-import').addEventListener('click',()=>document.getElementById('file-import').click());

// ══ COMMANDS ═════════════════════════════════════════════════════════════════
const CMD_DEFS=[{key:'name',label:'Save ship'},{key:'load',label:'Load ship'},{key:'list',label:'List ships'},{key:'delete',label:'Delete ship'},{key:'help',label:'Help'}];
async function renderCmdEditor(){
  const {commands}=await getData();
  document.getElementById('cmd-editor').innerHTML=CMD_DEFS.map(({key,label})=>`
    <div class="cmd-row"><span class="cmd-prefix">.</span><span class="cmd-label">${label}</span>
    <input class="cmd-input" id="cmd-${key}" value="${esc(commands[key]||key)}"
           placeholder="${key}" autocomplete="off" spellcheck="false" maxlength="20"/></div>`).join('');
}
document.getElementById('set-save-cmds').addEventListener('click',async()=>{
  const cmds={};const seen=new Set();
  for(const {key} of CMD_DEFS){
    const val=(document.getElementById(`cmd-${key}`)?.value||'').trim().replace(/\s+/g,'').toLowerCase();
    if(!val){alert(`Command for "${key}" cannot be empty.`);return;}
    if(seen.has(val)){alert(`Duplicate ".${val}".`);return;}
    seen.add(val);cmds[key]=val;
  }
  await saveCommands(cmds);
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true}).catch(()=>[[]]);
  if(tab?.url?.includes('netquel.com'))chrome.tabs.sendMessage(tab.id,{type:'UPDATE_COMMANDS',commands:cmds}).catch(()=>{});
  document.getElementById('set-save-cmds').textContent='Saved!';
  setTimeout(()=>document.getElementById('set-save-cmds').textContent='Save Commands',1500);
});
document.getElementById('set-reset-cmds').addEventListener('click',async()=>{
  if(!confirm('Reset all commands to defaults?')) return;
  const defaults=defaultCommands();await saveCommands(defaults);renderCmdEditor();
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true}).catch(()=>[[]]);
  if(tab?.url?.includes('netquel.com'))chrome.tabs.sendMessage(tab.id,{type:'UPDATE_COMMANDS',commands:defaults}).catch(()=>{});
});

document.getElementById('link-tos').addEventListener('click',()=>chrome.tabs.create({url:chrome.runtime.getURL('tos.html')}));
document.getElementById('link-privacy').addEventListener('click',()=>chrome.tabs.create({url:chrome.runtime.getURL('privacy.html')}));

// ══ LOAD SHIP ════════════════════════════════════════════════════════════════
async function loadShip(name){
  if(IS_FULL_PAGE||IS_SIDEBAR){
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true}).catch(()=>[null]);
    if(!tab?.url?.includes('netquel.com')){alert('Go to Netquel.com to load ships.');return;}
    chrome.tabs.sendMessage(tab.id,{type:'LOAD_SHIP',name});return;
  }
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab?.url?.includes('netquel.com')){alert('Open Netquel.com first!');return;}
  chrome.tabs.sendMessage(tab.id,{type:'LOAD_SHIP',name});
  window.close();
}

// ══ STORAGE LISTENER ═════════════════════════════════════════════════════════

// ══ HOTKEY MODE ═══════════════════════════════════════════════════════════════
function applyHotkeyModeUI(mode) {
  document.querySelectorAll('.hk-opt').forEach(o =>
    o.classList.toggle('active', o.dataset.mode === mode));
  // Re-render favorites to update badge labels
  renderQuick(document.getElementById('ql-search').value);
  // Push to content script so it knows which mode to use
  chrome.tabs.query({active:true,currentWindow:true}).then(tabs => {
    const tab = tabs[0];
    if (tab?.url?.includes('netquel.com'))
      chrome.tabs.sendMessage(tab.id, { type:'UPDATE_HOTKEY_MODE', mode }).catch(()=>{});
  }).catch(()=>{});
}

document.querySelectorAll('.hk-opt').forEach(opt => {
  opt.addEventListener('click', async () => {
    const mode = opt.dataset.mode;
    await saveHotkeyMode(mode);
    applyHotkeyModeUI(mode);
  });
});

chrome.storage.onChanged.addListener(changes=>{
  if(changes.ships||changes.folders) renderAll();
  if(changes.username||changes.discord||changes.avatarData) getData().then(d=>applyProfile(d.username,d.discord,d.avatarData));
  if(changes.fontSize) applyFontSize(changes.fontSize.newValue);
  if(changes.folderColors) renderFiles(document.getElementById('fm-search').value);
  if(changes.hotkeyMode) applyHotkeyModeUI(changes.hotkeyMode.newValue);
});

// ══ START ════════════════════════════════════════════════════════════════════
init();

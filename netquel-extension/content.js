// Netquel Ship Manager - Content Script v6
(function () {
  'use strict';

  const MAX_HISTORY = 3;

  // ─── Commands ────────────────────────────────────────────────────────────
  let CMDS = { name:'name', load:'load', list:'list', delete:'delete', help:'help' };
  chrome.storage.local.get(['commands'], d => {
    if (d.commands) CMDS = { ...CMDS, ...d.commands };
  });

  // ─── Hotkey mode (synced from settings) ──────────────────────────────────
  let HOTKEY_MODE = 'number'; // 'number' = 1-9 keys, 'function' = F1-F9
  chrome.storage.local.get(['hotkeyMode'], d => {
    if (d.hotkeyMode) HOTKEY_MODE = d.hotkeyMode;
  });

  // ─── DOM helpers ─────────────────────────────────────────────────────────
  function getChatInput() { return document.querySelector('input[name="message"]'); }

  function setInputValue(el, text) {
    const ns = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (ns?.set) ns.set.call(el, text); else el.value = text;
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function pressEnter(el) {
    ['keydown','keypress','keyup'].forEach(t =>
      el.dispatchEvent(new KeyboardEvent(t, {
        key:'Enter', code:'Enter', keyCode:13, which:13, bubbles:true, cancelable:true
      })));
  }

  function findLatestSaveCode() {
    const messages = document.querySelectorAll('p.message');
    for (let i = messages.length - 1; i >= 0; i--) {
      const p = messages[i];
      const spans = p.querySelectorAll('span');
      if (spans.length >= 1 && spans[0].textContent.trim() === 'Server') {
        const codeSpan = p.querySelector('span[style*="word-break"]');
        if (codeSpan) {
          const code = codeSpan.textContent.trim();
          if (/^netquel/i.test(code)) return code;
        }
      }
    }
    return null;
  }

  function getData() {
    return new Promise(resolve => {
      chrome.storage.local.get(['ships','folders','username'], data => {
        resolve({ ships: data.ships || {}, folders: data.folders || [], username: data.username || '' });
      });
    });
  }

  function saveShips(ships) {
    return new Promise(resolve => chrome.storage.local.set({ ships }, resolve));
  }

  function getCode(entry) {
    if (!entry) return null;
    return typeof entry === 'string' ? entry : entry.code || null;
  }

  // ─── Toast ───────────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    const existing = document.getElementById('nq-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'nq-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
      background:${type==='success'?'#00e5a0':type==='error'?'#ff4d6d':'#4d9fff'};
      color:#000; font-family:'Courier New',monospace; font-size:13px; font-weight:700;
      padding:10px 20px; border-radius:6px; z-index:999999;
      box-shadow:0 4px 20px rgba(0,0,0,.5); pointer-events:none;
      letter-spacing:.05em; transition:opacity .3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2800);
  }

  // ─── .name — saves code + records history ────────────────────────────────
  async function handleName(shipName) {
    if (!shipName) { showToast(`Usage: .${CMDS.name} YourShipName`, 'error'); return; }
    const code = findLatestSaveCode();
    if (!code) { showToast('No save code found! Type /save first.', 'error'); return; }
    const { ships } = await getData();
    const isUpdate = !!ships[shipName];
    const existing = ships[shipName] || {};
    const oldCode = getCode(existing);
    // Push old code to history if updating and code changed
    let history = existing.history || [];
    if (isUpdate && oldCode && oldCode !== code) {
      history = [{ code: oldCode, date: new Date().toISOString() }, ...history];
      if (history.length > MAX_HISTORY) history.splice(MAX_HISTORY);
    }
    ships[shipName] = {
      code,
      folder:  existing.folder  || '',
      starred: existing.starred || false,
      note:    existing.note    || '',
      tag:     existing.tag     || '',
      history
    };
    await saveShips(ships);
    showToast(isUpdate ? `Updated "${shipName}"` : `Saved "${shipName}"`, 'success');
    chrome.runtime.sendMessage({ type: 'SHIPS_UPDATED' }).catch(() => {});
  }

  // ─── .load ───────────────────────────────────────────────────────────────
  async function handleLoad(args) {
    const parts = args.trim().split(/\s+/);
    const { ships } = await getData();
    let shipName, code;
    if (parts.length >= 2) {
      const owner = parts[0], sName = parts.slice(1).join(' ');
      const entry = Object.entries(ships).find(([n, v]) => {
        const f = typeof v === 'object' ? v.folder : '';
        return n === sName && f === `${owner}'s Ships`;
      });
      if (entry) { shipName = entry[0]; code = getCode(entry[1]); }
      else { showToast(`No ship "${sName}" under ${owner}'s Ships.`, 'error'); return; }
    } else {
      shipName = parts[0]; code = getCode(ships[shipName]);
      if (!code) { showToast(`No ship named "${shipName}" found.`, 'error'); return; }
    }
    const input = getChatInput();
    if (!input) { showToast('Could not find chat input!', 'error'); return; }
    showToast(`Loading "${shipName}"...`, 'info');
    setInputValue(input, `/load ${code}`);
    input.focus();
    setTimeout(() => { pressEnter(input); setTimeout(() => setInputValue(input, ''), 100); }, 60);
  }

  async function handleList() {
    const { ships } = await getData();
    const names = Object.keys(ships);
    if (!names.length) showToast('No ships saved yet.', 'info');
    else showToast(`Ships: ${names.join(', ')}`, 'info');
  }

  async function handleDelete(shipName) {
    if (!shipName) { showToast(`Usage: .${CMDS.delete} YourShipName`, 'error'); return; }
    const { ships } = await getData();
    if (!ships[shipName]) { showToast(`No ship named "${shipName}".`, 'error'); return; }
    delete ships[shipName]; await saveShips(ships);
    showToast(`Deleted "${shipName}"`, 'success');
    chrome.runtime.sendMessage({ type: 'SHIPS_UPDATED' }).catch(() => {});
  }

  // ─── . key focuses chat ───────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key !== '.' || e.ctrlKey || e.altKey || e.metaKey) return;
    const input = getChatInput(); if (!input) return;
    const active = document.activeElement;
    const typing = active && active !== input &&
      (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    if (typing || active === input) return;
    e.preventDefault(); input.focus(); setInputValue(input, input.value + '.');
  }, false);

  // ─── Enter dispatches commands ────────────────────────────────────────────
  document.addEventListener('keydown', async e => {
    if (e.key !== 'Enter') return;
    const input = getChatInput();
    if (!input || document.activeElement !== input) return;
    const raw = input.value.trim();
    if (!raw.startsWith('.')) return;
    const firstSpace = raw.indexOf(' ');
    const typed = (firstSpace === -1 ? raw.slice(1) : raw.slice(1, firstSpace)).toLowerCase();
    const arg   = firstSpace === -1 ? '' : raw.slice(firstSpace + 1).trim();
    const matched = Object.entries(CMDS).find(([, v]) => v === typed);
    if (!matched) return;
    const [cmd] = matched;
    e.preventDefault(); e.stopImmediatePropagation();
    setInputValue(input, '');
    switch (cmd) {
      case 'name':   await handleName(arg);   break;
      case 'load':   await handleLoad(arg);   break;
      case 'list':   await handleList();      break;
      case 'delete': await handleDelete(arg); break;
      case 'help': {
        const c = CMDS;
        showToast(`.${c.name} <ship> | .${c.load} <ship> | .${c.list} | .${c.delete} <ship>`, 'info');
        break;
      }
    }
  }, true);

  // ─── Hotkey handler — number keys 1-9 or function keys F1-F9 ───────────────
  document.addEventListener('keydown', async e => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;

    let slotNum = 0; // 1-9

    if (HOTKEY_MODE === 'function') {
      // Function key mode: F1-F9 fire anywhere on the page
      if (!e.key.startsWith('F')) return;
      const n = parseInt(e.key.slice(1));
      if (isNaN(n) || n < 1 || n > 9) return;
      slotNum = n;
    } else {
      // Number key mode: 1-9 fire only when chat is NOT focused
      const active = document.activeElement;
      const chatInput = getChatInput();
      const inChat = active && (active === chatInput || active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
      if (inChat) return; // don't intercept typing
      const n = parseInt(e.key);
      if (isNaN(n) || n < 1 || n > 9) return;
      slotNum = n;
    }

    // Find the nth favorite
    const { ships } = await getData();
    const favorites = Object.entries(ships)
      .filter(([, v]) => v?.starred)
      .slice(0, 9);
    if (!favorites[slotNum - 1]) return; // slot empty, do nothing

    e.preventDefault(); // now safe to prevent default (e.g. F5 refresh)
    const [name] = favorites[slotNum - 1];
    const keyLabel = HOTKEY_MODE === 'function' ? `F${slotNum}` : String(slotNum);
    showToast(`${keyLabel} → Loading "${name}"...`, 'info');
    const code = getCode(ships[name]);
    if (!code) { showToast(`No code for "${name}"`, 'error'); return; }
    const input = getChatInput();
    if (!input) { showToast('Could not find chat input!', 'error'); return; }
    setInputValue(input, `/load ${code}`);
    input.focus();
    setTimeout(() => { pressEnter(input); setTimeout(() => setInputValue(input, ''), 100); }, 60);
  });

  // ─── Sidebar ─────────────────────────────────────────────────────────────
  let sidebarFrame = null;
  let sidebarClose = null;
  const SIDEBAR_W  = 424;

  function openSidebar() {
    if (sidebarFrame) { removeSidebar(); return; }
    document.documentElement.style.marginRight = `${SIDEBAR_W}px`;
    document.documentElement.style.transition  = 'margin-right .2s ease';

    sidebarFrame = document.createElement('iframe');
    sidebarFrame.id  = 'nq-sidebar-frame';
    sidebarFrame.src = chrome.runtime.getURL('popup.html') + '?sidebar=1';
    sidebarFrame.style.cssText = `
      position:fixed; top:0; right:0; width:420px; height:100vh;
      border:none; border-left:2px solid #1a2d45;
      box-shadow:-4px 0 24px rgba(0,0,0,.7);
      z-index:2147483646; background:#080d14;
    `;
    document.body.appendChild(sidebarFrame);

    sidebarClose = document.createElement('button');
    sidebarClose.id = 'nq-sidebar-close';
    sidebarClose.textContent = '✕ Close panel';
    sidebarClose.style.cssText = `
      position:fixed; top:8px; right:428px; z-index:2147483647;
      background:#0d1520; border:1px solid #1a2d45; color:#4a6a85;
      border-radius:4px; padding:4px 9px; cursor:pointer; font-size:11px;
      font-family:'Courier New',monospace; transition:all .15s; line-height:1.4; white-space:nowrap;
    `;
    sidebarClose.onmouseenter = () => { sidebarClose.style.color='#ff4d6d'; sidebarClose.style.borderColor='rgba(255,77,109,.4)'; };
    sidebarClose.onmouseleave = () => { sidebarClose.style.color='#4a6a85'; sidebarClose.style.borderColor='#1a2d45'; };
    sidebarClose.onclick = removeSidebar;
    document.body.appendChild(sidebarClose);
  }

  function removeSidebar() {
    document.documentElement.style.marginRight = '';
    document.documentElement.style.transition  = '';
    if (sidebarFrame) { sidebarFrame.remove(); sidebarFrame = null; }
    if (sidebarClose) { sidebarClose.remove(); sidebarClose = null; }
  }

  // ─── Message listener ─────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'UPDATE_COMMANDS' && msg.commands) CMDS = { ...CMDS, ...msg.commands };
    if (msg.type === 'UPDATE_HOTKEY_MODE' && msg.mode) HOTKEY_MODE = msg.mode;
    if (msg.type === 'LOAD_SHIP')     { handleLoad(msg.name); sendResponse({ ok: true }); }
    if (msg.type === 'GET_SAVE_CODE') { sendResponse({ code: findLatestSaveCode() }); }
    if (msg.type === 'OPEN_SIDEBAR')  { openSidebar(); sendResponse({ ok: true }); }
  });

  console.log('[Netquel Ship Manager v6.1] Loaded ✓');
})();

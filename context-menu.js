/* Akaora Meet — accessible, keyboard-friendly shortcut menu.
   Navigation delegates to existing buttons so meeting state remains centralized in app.js. */
(() => {
  'use strict';
  const menu = document.getElementById('akaoraContextMenu');
  if (!menu) return;
  const itemsHost = document.getElementById('akaoraContextItems');
  const status = document.getElementById('akaoraContextStatus');
  const icons = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    enter: '<path d="M14 4h6v16h-6M10 8l4 4-4 4M14 12H3"/>',
    home: '<path d="m3 10 9-7 9 7v10H3V10Z"/><path d="M9 20v-7h6v7"/>',
    theme: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M17.66 6.34l1.41-1.41"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    chat: '<path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2 1-5a8 8 0 1 1 17-5Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1 2-2 2-2-.6-2 1.2-1 2.4h-3l-1-2.4-2-1.2-2 .6-2-2 .6-2-1.2-2-2.4-1v-3l2.4-1 1.2-2-.6-2 2-2 2 .6 2-1.2 1-2.4h3l1 2.4 2 1.2 2-.6 2 2-.6 2 1.2 2 2.4 1v3L20 13l-.6 2Z" transform="translate(2 2) scale(.83)"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    paste: '<path d="M8 4h-3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><rect x="8" y="2" width="8" height="5" rx="1"/>',
    select: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/><path d="M7 12h10"/>',
  };
  const svg = (name) => `<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">${icons[name]}</svg>`;
  const el = (id) => document.getElementById(id);
  const isMeeting = () => document.body.dataset.view === 'meeting' && !el('meetingView')?.hidden;
  const isEditable = (target) => !!target?.closest?.('input, textarea, [contenteditable="true"]');
  let returnFocus = null;
  let editTarget = null;

  function hide({restoreFocus = false} = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    menu.setAttribute('aria-hidden','true');
    status.textContent = '';
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus({preventScroll: true});
    returnFocus = null;
  }
  function notify(message) { status.textContent = message; }
  const click = (id) => {
    const target = el(id);
    if (target && !target.disabled) target.click();
  };
  function add(label, icon, invoke, opts = {}) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `akaora-context-item${opts.danger ? ' is-danger' : ''}`;
    b.setAttribute('role','menuitem');
    b.innerHTML = `${svg(icon)}<span></span>${opts.hint ? '<kbd></kbd>' : ''}`;
    b.querySelector('span').textContent = label;
    if (opts.hint) b.querySelector('kbd').textContent = opts.hint;
    b.addEventListener('click', async () => {
      if (opts.keepOpen) { await invoke(); return; }
      hide();
      await invoke();
    });
    itemsHost.append(b);
    return b;
  }
  function separator() {
    const div = document.createElement('div');
    div.className = 'akaora-context-separator';
    div.setAttribute('role','separator');
    itemsHost.append(div);
  }
  function show(x, y, target) {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    editTarget = isEditable(target) ? target.closest('input,textarea,[contenteditable="true"]') : null;
    itemsHost.replaceChildren();
    status.textContent = '';
    if (editTarget) {
      add('Paste in field', 'paste', async () => {
        editTarget.focus();
        try {
          if (!navigator.clipboard?.readText) throw new Error('No clipboard API');
          const text = await navigator.clipboard.readText();
          if (typeof editTarget.setRangeText === 'function') {
            editTarget.setRangeText(text, editTarget.selectionStart, editTarget.selectionEnd, 'end');
          } else {
            document.execCommand('insertText', false, text);
          }
          editTarget.dispatchEvent(new Event('input', {bubbles:true}));
          hide();
        } catch {
          notify('Clipboard unavailable. Use Ctrl+V in the field.');
        }
      }, {hint:'Ctrl+V', keepOpen:true});
      add('Select field text', 'select', () => { editTarget.focus(); editTarget.select?.(); }, {hint:'Ctrl+A'});
      separator();
    }
    if (isMeeting()) {
      add('Copy room code', 'copy', () => click('copyCodeBtn'));
      add('Copy invitation link', 'link', () => click('copyInviteBtn'));
      separator();
      add('Open live chat', 'chat', () => click('chatToggleBtn'));
      add('Device settings', 'settings', () => click('deviceBtn'));
      add('More meeting tools', 'more', () => click('moreBtn'));
      separator();
      add('Switch appearance', 'theme', () => click('meetingThemeToggle'));
    } else {
      add('Start a meeting', 'plus', () => click('openCreateBtn'));
      add('Join a meeting', 'enter', () => click('openJoinBtn'));
      if (document.body.dataset.view !== 'home') {
        add('Back to homepage', 'home', () => {
          const back = document.querySelector('[data-back-home]');
          back?.click();
        });
      }
      separator();
      add('Copy website link', 'link', async () => {
        try { await navigator.clipboard.writeText(location.origin + location.pathname); }
        catch { notify('Clipboard unavailable.'); }
      }, {keepOpen:true});
      add('Switch appearance', 'theme', () => click('topThemeToggle'));
    }
    menu.hidden = false;
    menu.setAttribute('aria-hidden', 'false');
    // Position relative to viewport, keeping the entire menu reachable at the edges.
    menu.style.left = '0px';
    menu.style.top = '0px';
    const rect = menu.getBoundingClientRect();
    const gap = 9;
    menu.style.left = `${Math.max(gap, Math.min(x, window.innerWidth - rect.width - gap))}px`;
    menu.style.top = `${Math.max(gap, Math.min(y, window.innerHeight - rect.height - gap))}px`;
    itemsHost.querySelector('button')?.focus({preventScroll:true});
  }
  document.addEventListener('contextmenu', (ev) => {
    if (ev.target.closest?.('#akaoraContextMenu')) { ev.preventDefault(); return; }
    ev.preventDefault();
    show(ev.clientX, ev.clientY, ev.target);
  }, {capture:true});
  document.addEventListener('pointerdown', (ev) => {
    if (!menu.hidden && !menu.contains(ev.target)) hide();
  }, {capture:true});
  window.addEventListener('resize', () => hide());
  window.addEventListener('scroll', () => hide(), {capture:true, passive:true});
  window.addEventListener('blur', () => hide());
  document.addEventListener('keydown', (ev) => {
    if (menu.hidden) return;
    if (ev.key === 'Escape') {ev.preventDefault();hide({restoreFocus:true});return;}
    const options = [...itemsHost.querySelectorAll('button')];
    const index = options.indexOf(document.activeElement);
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const delta = ev.key === 'ArrowDown' ? 1 : -1;
      options[(index + delta + options.length) % options.length]?.focus();
    }
    if (ev.key === 'Home' || ev.key === 'End') {
      ev.preventDefault(); options[ev.key === 'Home' ? 0 : options.length - 1]?.focus();
    }
    if (ev.key === 'Tab') hide();
  });
  // No custom menu over the browser's own chrome; browser chrome is beyond page control.
})();

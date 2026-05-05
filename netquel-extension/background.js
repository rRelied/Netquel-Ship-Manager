// Netquel Ship Manager - Background Service Worker v5
// Intercepts the extension icon click:
//   • On netquel.com → opens/toggles the sidebar
//   • Anywhere else  → opens the normal popup

chrome.action.onClicked.addListener(async (tab) => {
  const isNetquel = tab.url && tab.url.includes('netquel.com');

  if (isNetquel) {
    // Send message to content script to toggle sidebar
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'OPEN_SIDEBAR' });
    } catch (err) {
      // Content script may not have loaded yet — inject and retry
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        // Give it a moment to initialize
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(tab.id, { type: 'OPEN_SIDEBAR' });
          } catch (e) {
            // Fallback: open popup in new tab
            chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') + '?fullpage=1' });
          }
        }, 300);
      } catch (e2) {
        chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') + '?fullpage=1' });
      }
    }
  } else {
    // Not on netquel — open as full page tab since popup is disabled via onClicked
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') + '?fullpage=1' });
  }
});

let storage = chrome.storage.sync;

chrome.runtime.onInstalled.addListener(function () {
  storage.set({ notes: '' }, function () {
    console.log("Initialized.");
  });
});

chrome.contextMenus.create({
  id: "note",
  title: "Take note",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "note") {
    appendSelectionToNotes();
  }
});

async function appendSelectionToNotes() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    return;
  }

  const selection = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString(),
  });

  if (!selection || !selection[0]) {
    return;
  }

  const notes = (await chrome.storage.sync.get('notes')).notes.trim() +
    "\n- " + selection[0].result.trim();

  await chrome.storage.sync.set({ notes });
}
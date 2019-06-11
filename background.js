let storage = chrome.storage.sync;

chrome.runtime.onInstalled.addListener(function() {
  storage.set({notes: ''}, function() {
    console.log("Initialized.");
  });
});

chrome.contextMenus.create({
  id: "note",
  title: "Take note", 
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "note") {
    appendSelectionToNotes();
  }
});

chrome.commands.onCommand.addListener(function(command) {
  console.log(command);
  if (command == "note") {
    appendSelectionToNotes();
  }
});

function appendSelectionToNotes() {
  chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
  }, function(selection) {
    if (chrome.runtime.lastError !== undefined) {
      return;
    }
    storage.get(['notes'], function(result) {
      let notes = (result.notes + "\n- " + selection[0].trim()).trim();
      console.log(notes);
      storage.set({notes: notes}, function() {
      });
    });
  });
}
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({notes: ''}, function() {
    console.log("Initialized.");
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "append-notes") {
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
    chrome.storage.sync.get(['notes'], function(result) {
      var notes = (result.notes + "\n- " + selection[0].trim()).trim();
      chrome.storage.sync.set({notes: notes}, function() {
      });
    });
  });
}
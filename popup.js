let textarea;
let button;

document.addEventListener('DOMContentLoaded', function () {
  textarea = document.getElementById("notes-textarea");
  button = document.getElementById("copy-button");

  chrome.storage.sync.get(['notes'], function (result) {
    textarea.value = result.notes;
    textarea.scrollTop = textarea.scrollHeight;
  });

  textarea.onchange = function (event) {
    chrome.storage.sync.set({ notes: event.target.value }, function () {
    });
  };

  button.onclick = function (event) {
    textarea.select();
    navigator.clipboard.writeText(textarea.value)
      .catch((err) => console.error("Failed to copy text:", err));
  };
}, false);
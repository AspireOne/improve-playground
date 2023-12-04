// This is necessary for registering the background service worker
chrome.runtime.onInstalled.addListener(() => {
  // Extension installed
});

chrome.action.onClicked.addListener((tab) => {
  // When the extension icon is clicked, inject the content script into the current tab
/*  chrome.scripting.executeScript(
      {
        target: {tabId: tab.id},
        files: ["contentScript.js"],
      },
      () => {
        // After the content script is injected, send a message to toggle Markdown
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          chrome.tabs.sendMessage(tab.id, {action: "toggleMarkdown"});
        }
      }
  )*/;
});
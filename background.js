chrome.action.onClicked.addListener(tab => {
  chrome.storage.local.get({ enabled: true }, data => {
    const newState = !data.enabled
    chrome.storage.local.set({ enabled: newState }, () => {
      const iconPath = newState ? "icon-enabled.png" : "icon-disabled.png"
      chrome.action.setIcon({ path: iconPath, tabId: tab.id })

      // Check if the content script is loaded before sending the message
      sendMessageWithRetry(tab.id, { enabled: newState })
    })
  })
})

function sendMessageWithRetry(tabId, message, retryCount = 0) {
  chrome.tabs.sendMessage(tabId, message, function (response) {
    if (chrome.runtime.lastError) {
      // Wait and retry if the content script might not be loaded yet
      if (retryCount < 3) {
        // Limit the number of retries to prevent infinite loops
        setTimeout(
          () => sendMessageWithRetry(tabId, message, retryCount + 1),
          1000
        )
      } else {
        console.error(
          "Failed to send message after retries:",
          chrome.runtime.lastError.message
        )
      }
      return
    }
    // Handle the response or acknowledge successful communication
  })
}

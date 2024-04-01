// This runs when the extension is installed or the browser starts, setting the default state.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ enabled: true }, data => {
    if (data.enabled) {
      chrome.storage.local.set({ enabled: true }) // Ensure enabled state is true by default
      chrome.action.setIcon({ path: "icon-enabled.png" }) // Set to enabled icon by default
    }
  })
})

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get({ enabled: true }, data => {
    updateIconForAllTabs(data.enabled) // Ensure correct icon on browser startup
  })
})

chrome.action.onClicked.addListener(tab => {
  chrome.storage.local.get({ enabled: true }, data => {
    const newState = !data.enabled
    chrome.storage.local.set({ enabled: newState }, () => {
      chrome.action.setIcon({
        path: newState ? "icon-enabled.png" : "icon-disabled.png",
        tabId: tab.id,
      })
      sendMessageWithRetry(tab.id, { enabled: newState })
    })
  })
})

function sendMessageWithRetry(tabId, message, retryCount = 0) {
  chrome.tabs.sendMessage(tabId, message, response => {
    if (chrome.runtime.lastError) {
      if (retryCount < 3) {
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
  })
}

// Function to update the icon for all tabs
function updateIconForAllTabs(enabled) {
  const iconPath = enabled ? "icon-enabled.png" : "icon-disabled.png"
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.action.setIcon({ path: iconPath, tabId: tab.id })
    })
  })
}

// Listen for tab updates to ensure the icon reflects the current state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Perform the check only when the tab is fully loaded to avoid unnecessary calls
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("tiktok.com")
  ) {
    chrome.storage.local.get({ enabled: true }, data => {
      chrome.action.setIcon({
        path: data.enabled ? "icon-enabled.png" : "icon-disabled.png",
        tabId: tabId,
      })
    })
  }
})

function updateCommentsVisibility(hide) {
  const styleId = "hide-comments-style"
  let styleElement = document.getElementById(styleId)

  if (hide) {
    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      styleElement.innerText = `div[role="dialog"] div[class*="DivContentContainer"] { display: none !important; }`
      document.head.appendChild(styleElement)
    }
  } else {
    if (styleElement) {
      styleElement.remove()
    }
  }
}

chrome.storage.local.get({ enabled: true }, data => {
  updateCommentsVisibility(data.enabled)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.enabled !== undefined) {
    updateCommentsVisibility(message.enabled)
    sendResponse({ status: "Done" })
  }
  return true
})

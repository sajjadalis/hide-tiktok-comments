let commentsObserver = null

function removeCommentsSection() {
  const selectors = [
    // Using partial class name match for the immersive player container
    'section[class*="SectionImmersivePlayerCommentsContainer"]',
    // Using the static transition class
    "section.immersive-player-comments-transition-appear-done",
    // General pattern matching
    'section[class*="immersive-player-comments"]',
  ]

  for (const selector of selectors) {
    const commentsSection = document.querySelector(selector)
    if (commentsSection) {
      commentsSection.remove()
      console.log(`Comments removed with selector: ${selector}`)
      return true
    }
  }
  return false
}

function updateCommentsVisibility(hide) {
  const urlPath = window.location.pathname
  if (!urlPath.includes("/video/")) return

  if (hide) {
    // Initial attempt with delay
    setTimeout(() => {
      removeCommentsSection()

      // Set up observer if not already existing
      if (!commentsObserver) {
        commentsObserver = new MutationObserver(() => {
          setTimeout(removeCommentsSection, 500)
        })

        commentsObserver.observe(document.body, {
          childList: true,
          subtree: true,
        })
      }
    }, 1000)
  } else {
    if (commentsObserver) {
      commentsObserver.disconnect()
      commentsObserver = null
    }
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.enabled !== undefined) {
    updateCommentsVisibility(message.enabled)
    sendResponse({ status: "Done" })
  }
  return true
})

// Initial state check
chrome.storage.local.get({ enabled: true }, data => {
  updateCommentsVisibility(data.enabled)
})

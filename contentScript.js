let currentUrl = window.location.href
let isEnabled = true
let commentsButton = null
let commentsContainer = null

// Immediately inject CSS if needed to prevent flash
function injectImmediateCSS() {
  chrome.storage.local.get({ enabled: true }, data => {
    if (
      data.enabled &&
      (window.location.pathname.includes("/video/") ||
        window.location.pathname.includes("/photo/"))
    ) {
      const styleElement = document.createElement("style")
      styleElement.id = "hide-comments-style-immediate"
      styleElement.innerText = `div[role="dialog"] div[class*="DivContentContainer"] { display: none !important; }`
      document.head.appendChild(styleElement)
    }
  })
}

// Call immediately
injectImmediateCSS()

function updateCommentsVisibility(hide) {
  const styleId = "hide-comments-style"
  const immediateStyleId = "hide-comments-style-immediate"
  let styleElement = document.getElementById(styleId)
  let immediateStyleElement = document.getElementById(immediateStyleId)
  const urlPath = window.location.pathname

  if (urlPath.includes("/video/") || urlPath.includes("/photo/")) {
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
      if (immediateStyleElement) {
        immediateStyleElement.remove()
      }
    }
  } else {
    if (styleElement) {
      styleElement.remove()
    }
    if (immediateStyleElement) {
      immediateStyleElement.remove()
    }
  }

  updateCommentsButton()
}

function createCommentsButton() {
  if (commentsContainer) {
    commentsContainer.remove()
  }

  const volumeButton = document.querySelector('button[aria-label="Volume"]')
  if (!volumeButton) {
    return
  }

  const volumeContainer = volumeButton.parentElement
  if (!volumeContainer) {
    return
  }

  const parentContainer = volumeContainer.parentElement
  if (!parentContainer) {
    return
  }

  commentsContainer = document.createElement("div")
  commentsContainer.style.position = "absolute"
  commentsContainer.style.zIndex = "0"
  commentsContainer.style.bottom = "68px"
  commentsContainer.style.right = "20px"

  commentsButton = document.createElement("button")
  commentsButton.tabIndex = 0
  commentsButton.setAttribute("role", "button")
  commentsButton.setAttribute("aria-label", "Toggle Comments")
  commentsButton.style.background = "rgba(84, 84, 84, 0.5)"
  commentsButton.style.backdropFilter = "blur(10px)"
  commentsButton.style.border = "none"
  commentsButton.style.borderRadius = "50%"
  commentsButton.style.width = "40px"
  commentsButton.style.height = "40px"
  commentsButton.style.cursor = "pointer"
  commentsButton.style.display = "flex"
  commentsButton.style.alignItems = "center"
  commentsButton.style.justifyContent = "center"
  commentsButton.style.transition = "background 0.2s ease"

  commentsButton.addEventListener("mouseenter", () => {
    commentsButton.style.background = "rgba(37, 37, 37, 0.6)"
  })

  commentsButton.addEventListener("mouseleave", () => {
    commentsButton.style.background = "rgba(84, 84, 84, 0.5)"
  })

  commentsButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h3l3 3 3-3h7c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4zm3 6h10v1H7v-1zm0 2h10v1H7v-1z" fill="white"/>
    </svg>
  `
  commentsContainer.appendChild(commentsButton)

  commentsButton.addEventListener("click", event => {
    event.preventDefault()
    event.stopPropagation()
    isEnabled = !isEnabled
    chrome.storage.local.set({ enabled: isEnabled })
    updateCommentsVisibility(isEnabled)
  })

  parentContainer.appendChild(commentsContainer)

  updateCommentsButton()
}

function updateCommentsButton() {
  if (!commentsButton) {
    return
  }

  if (isEnabled) {
    // Comments are hidden - show disabled icon with cross
    commentsButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h3l3 3 3-3h7c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4zm3 6h10v1H7v-1zm0 2h10v1H7v-1z" fill="white"/>
        <path d="M1 1l22 22" stroke="#ff4444" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `
    commentsButton.title = "Comments are hidden. Click to show."
  } else {
    // Comments are visible - show normal icon
    commentsButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h3l3 3 3-3h7c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4zm3 6h10v1H7v-1zm0 2h10v1H7v-1z" fill="white"/>
      </svg>
    `
    commentsButton.title = "Comments are visible. Click to hide."
  }
}

function checkForUrlChange() {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href
    // Apply immediately to prevent flash
    updateCommentsVisibility(isEnabled)
    // Then create button with small delay
    setTimeout(() => {
      createCommentsButton()
    }, 200)
  }
}

function observeUrlChanges() {
  const observer = new MutationObserver(() => {
    checkForUrlChange()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  setInterval(checkForUrlChange, 1000)
}

chrome.storage.local.get({ enabled: true }, data => {
  isEnabled = data.enabled
  // Apply immediately on page load
  updateCommentsVisibility(isEnabled)
  observeUrlChanges()

  setTimeout(() => {
    createCommentsButton()
  }, 500)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.enabled !== undefined) {
    isEnabled = message.enabled
    updateCommentsVisibility(isEnabled)
    sendResponse({ status: "Done" })
  }
  return true
})

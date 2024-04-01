function hideComments() {
  const dialogs = document.querySelectorAll('div[role="dialog"]')
  dialogs.forEach(dialog => {
    const commentsDiv = Array.from(dialog.querySelectorAll("div")).find(div =>
      div.className.includes("DivContentContainer")
    )
    if (commentsDiv) {
      commentsDiv.style.display = "none"
    }
  })
}

function checkAndHideCommentsForVideoPage() {
  const urlPath = window.location.pathname
  if (urlPath.includes("/video/")) {
    hideComments()
  }
}

// Initially check if the comments need to be hidden
checkAndHideCommentsForVideoPage()

// Setup a MutationObserver to react to URL changes in SPA
const observer = new MutationObserver((mutations, obs) => {
  const newPath = window.location.pathname
  if (newPath.includes("/video/")) {
    hideComments()
  }
})

observer.observe(document, {
  subtree: true,
  childList: true,
})

// Optional: Disconnect observer when not needed to improve performance
// observer.disconnect();

const highlightMatches = (regex: RegExp) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
  
    while (walker.nextNode()) {
      const node = walker.currentNode as Text
      if (regex.test(node.nodeValue || "")) {
        textNodes.push(node)
      }
    }
  
    for (const node of textNodes) {
      const span = document.createElement("span")
      span.innerHTML = (node.nodeValue || "").replace(regex, (match) => {
        return `<mark style="background: yellow;">${match}</mark>`
      })
  
      const parent = node.parentNode
      if (parent) {
        parent.replaceChild(span, node)
      }
    }
  }
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "HIGHLIGHT_TEXT" && message.regex) {
      try {
        const regex = new RegExp(message.regex, "gi")
        highlightMatches(regex)
      } catch (e) {
        console.error("Invalid regex", e)
      }
    }
  })
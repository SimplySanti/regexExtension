import { useState } from "react"

function IndexPopup() {
  const [regexInput, setRegexInput] = useState("Plasmo")

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "HIGHLIGHT_TEXT",
          regex: regexInput
        })
      }
    })
  }

  return (
    <div>
      <input
        type="text"
        value={regexInput}
        onChange={(e) => setRegexInput(e.target.value)}
        placeholder="Enter regex"
      />
      <button onClick={handleClick}>Highlight</button>
    </div>
  )
}

export default IndexPopup
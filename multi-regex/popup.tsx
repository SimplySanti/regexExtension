import { useState } from "react"

import { RegexService } from "./RegexService/RegexService.ts"

function getIdOfCurrentTab() {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {}
  )
}

function IndexPopup() {
  const [tabId, setTabId] = useState<number>(0)
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabArray) {
    let tab = tabArray[0]
    setTabId(tab.id)
  })

  console.log(tabId)

  const regser = new RegexService(tabId)

  return (
    <div
      style={{
        padding: 16
      }}>
      <input
        type="text"
        onChange={async (e) => {
          console.log("this is the inputted value")
          console.log(e.target.value)
          await regser.registerExpression("ACTIVE", e.target.value, "#32a852")
          console.log("this should have been registered")
        }}
      />

      <button
        onClick={async () => {
          await regser.deleteExpression(0)
        }}>
        Hi here{" "}
      </button>
    </div>
  )
}

export default IndexPopup

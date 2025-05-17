import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

const storageInstance = new Storage({ area: "local" })

function IndexPopup() {
  const [storedValue, , {
    setRenderValue,
    setStoreValue,
    remove
  }] = useStorage({
    key: "hailing",
    instance: storageInstance
  }, (v) => v === undefined ? "42" : v)

  const [inputValue, setInputValue] = useState(storedValue)

  useEffect(() => {
    chrome.storage.local.get(null, (items) => {
      console.log("Current local storage:", items)
    })
  }, [])

  return (
    <div className="p-4">
      <h1>Stored: {storedValue}</h1>

      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setRenderValue(e.target.value) // reflect immediately
        }}
      />

      <button onClick={() => setStoreValue(inputValue)}>
        Save
      </button>

      <button onClick={() => {
        remove()
        setInputValue("") // clear input manually
      }}>
        Remove
      </button>
    </div>
  )
}

export default IndexPopup

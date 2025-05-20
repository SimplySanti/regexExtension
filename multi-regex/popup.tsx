import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { sendToBackground } from "@plasmohq/messaging"
import OpenAIMenu from "~openAiMenu";
import RegexInput from "~regexInput";

function IndexPopup() {
  const [openAIMenuToggle, setOpenAIMenuToggle] = useState(false)
  const [regexDict, setRegexDict] = useState<Record<string, { expression: string; color: string }>>({})


  function handleAddRegex(expression = "") {
    const id = uuidv4()
    setRegexDict(prev => ({
      ...prev,
      [id]: { expression: expression, color: "#ffff00" }
    }))
  }

  async function handleUpdate(id: string, updated: { expression: string; color: string }) {
    setRegexDict(prev => ({
      ...prev,
      [id]: updated
    }))
  }

  function handleDelete(id: string) {
    setRegexDict(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  function handleOpenAiMenu(){
    setOpenAIMenuToggle(!openAIMenuToggle);
  }

  return (
    <div className="p-4">
      <button onClick={handleOpenAiMenu}>OpenAI</button>
      {openAIMenuToggle && <OpenAIMenu addRegex={handleAddRegex}/>}
      <button
        onClick={() => handleAddRegex()}
        className="px-3 py-1 bg-orange-400 text-white rounded mb-4"
      >
        Add Regex Highlight
      </button>

      {Object.entries(regexDict).map(([id, data]) => (
        <RegexInput
          key={id}
          id={id}
          expression={data.expression}
          color={data.color}
          onChange={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

    </div>
  )
}

export default IndexPopup

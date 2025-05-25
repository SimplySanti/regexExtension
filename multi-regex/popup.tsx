import { useEffect, useState, type CSSProperties } from "react"

import { RegexExpression } from "./RegexService/IRegexService.ts"
import { RegexService } from "./RegexService/RegexService.ts"
import OpenAIMenu from "~openAiMenu.jsx"

function IndexPopup() {
  const [expressions, setExpressions] = useState<RegexExpression[]>([])

  const [newRegex, setNewRegex] = useState("")
  const [newColor, setNewColor] = useState("#A0FFFF")
  const [reg, setRegSer] = useState<RegexService>(new RegexService(0))
  const [openAiMenu, setOpenAiMenu] = useState(false)

  useEffect(() => {
    chrome.tabs.query(
      { currentWindow: true, active: true },
      function (tabArray) {
        let tab = tabArray[0]
        setRegSer(new RegexService(tab.id))
      }
    )
  }, [])

  const addExpression = async () => {
    if (newRegex.trim() === "") return

    console.log("trying to add expression")
    console.log(newRegex)
    console.log(newColor)
    const newexpr = await reg.registerExpression("ACTIVE", newRegex, newColor)
    console.log(newexpr)

    setRegSer(reg)
    setExpressions([...expressions, newexpr])
    setNewRegex("")
    setNewColor("#A0FFFF")
  }

  const addRegexFromAI = (regexString: string) => {
    if (regexString.trim() === "") return

    setNewRegex(regexString)
    setNewColor("#A0FFFF") // Optional: preset a default color
  }

  const deleteExpression = async (id) => {
    console.log("trying to delete")
    console.log(typeof id)
    console.log(id)
    await reg.deleteExpression(id)
    console.log(expressions)
    const updated = expressions.filter((exp) => exp.id !== id)
    console.log(updated)
    setExpressions(updated)
    setRegSer(reg)
  }

  const [colorPickerIndex, setColorPickerIndex] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  const popperStyle: CSSProperties = {
    marginTop: 4,
    right: 0,
    borderRadius: 4,
    background: "#fff",
    border: "1px solid #ccc",
    padding: "8px 12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 100
  }

  return (
    <div
      style={{
        padding: 16,
        width: 400,
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16
        }}>
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: "normal",
            color: "#333"
          }}>
          MULTI REGEX
        </h2>
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <button
            onClick={() => setShowInfo((prev) => !prev)}
            style={{
              backgroundColor: "#DDDDDD",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}>
            i
          </button>
          {showInfo && (
            <div style={popperStyle}>
              Hola! Para utilizar esta extensión debes:
              <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
                <li>Agregar expresiones/regulares.</li>
                <li>Seleccionar colores para cada una.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {expressions.map((expression, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            marginBottom: 12,
            alignItems: "center",
            gap: 8
          }}>
          <input
            value={expression.restr}
            readOnly
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 5,
              backgroundColor: "#f5f5f5",
              color: "#333"
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              onClick={() =>
                setColorPickerIndex(colorPickerIndex === index ? null : index)
              }
              style={{
                width: 40,
                height: 40,
                backgroundColor: expression.colorHexStr,
                borderRadius: 5,
                cursor: "pointer",
                border: "1px solid #999"
              }}
            />
          </div>
          <button
            onClick={async () => await deleteExpression(expression.id)}
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FF6B6B",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
            ×
          </button>
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <input type="checkbox" />
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={newRegex}
          onChange={(e) => setNewRegex(e.target.value)}
          placeholder="New regex"
          style={{
            flex: 2,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 5
          }}
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            borderColor: "#F0F0F0",
            borderRadius: 5,
            height: 40,
            width: 40,
            backgroundColor: "#F0F0F0",
            cursor: "pointer",
          }}
        />
        <button
          onClick={async () => await addExpression()}
          style={{
            flexShrink: 0,
            padding: "0 12px",
            fontSize: 20,
            borderWidth: 2,
            borderColor: "#00D1D1",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            color: "#fff",
          }}>
          +
        </button>
      </div>
      <button onClick={() => setOpenAiMenu(!openAiMenu)}>ChatGPT</button>
      {openAiMenu && <OpenAIMenu addRegex={addRegexFromAI} />}
    </div>
  )
}

export default IndexPopup

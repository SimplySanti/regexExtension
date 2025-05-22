import { useEffect, useState } from "react"

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

  const addRegexFromAI = async (regexString: string) => {
  if (regexString.trim() === "") return

  const newexpr = await reg.registerExpression("ACTIVE", regexString, "#A0FFFF")
  setExpressions([...expressions, newexpr])
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

  const changeColor = (index, newColor) => {
    const updated = [...expressions]
    updated[index] = { ...updated[index], color: newColor }
    setExpressions(updated)
  }

  const [colorPickerIndex, setColorPickerIndex] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  const colorOptions = [
    "#A0FFFF",
    "#D8B5FF",
    "#FEFFD5",
    "#00BFFF",
    "#9400D3",
    "#F7FD00",
    "#3A75C4",
    "#6A0DAD",
    "#654321"
  ]

  const popperStyle = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "8px 12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 100
  }

  const pickerStyle = {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: "-48px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: 8,
    display: "grid",
    gridTemplateColumns: "repeat(3, 24px)",
    gap: 6,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 100
  }

  return (
    <div
      style={{
        padding: 16,
        width: 400,
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif"
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
            {colorPickerIndex === index && (
              <div style={pickerStyle}>
                {colorOptions.map((col) => (
                  <div
                    key={col}
                    onClick={() => changeColor(index, col)}
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: col,
                      borderRadius: 3,
                      cursor: "pointer",
                      border:
                        col === expression.colorHexStr
                          ? "2px solid #333"
                          : "1px solid #ccc"
                    }}
                  />
                ))}
              </div>
            )}
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
            flex: 1,
            padding: 0,
            border: "none",
            borderRadius: 5,
            height: 40
          }}
        />
        <button
          onClick={async () => await addExpression()}
          style={{
            flexShrink: 0,
            padding: "0 12px",
            fontSize: 20,
            backgroundColor: "#DDDDDD",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}>
          +
        </button>
      </div>
      <button onClick={() => setOpenAiMenu(!openAiMenu)}>ChatGPT</button>
      {openAiMenu && <OpenAIMenu addRegex={addRegexFromAI}/>}
    </div>
  )
}

export default IndexPopup

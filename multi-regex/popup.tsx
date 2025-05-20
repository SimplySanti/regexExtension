import { useState } from "react"

function IndexPopup() {
  const [expressions, setExpressions] = useState([
    { value: "data", color: "#FFFF00" },
    { value: "science", color: "#A0FFFF" }
  ])

  // Controlador de la visibilidad del popper de info
  const [showInfo, setShowInfo] = useState(false)
  // Índice del picker de color abierto (o null)
  const [colorPickerIndex, setColorPickerIndex] = useState(null)

  // Colores para seleccionar
  const colorOptions = [
    "#A0FFFF", // Azul pastel
    "#D8B5FF", // Morado pastel
    "#FEFFD5", // Amarillo pastel
    "#00BFFF", // Azul brilloso
    "#9400D3", // Morado bilioso
    "#F7FD00", // Amarillo brilloso
    "#3A75C4", // Azul oscuro
    "#6A0DAD", // Morado oscuro
    "#654321" // Café oscuro
  ]

  const addExpression = () => {
    setExpressions([...expressions, { value: "", color: "#A0FFFF" }])
  }

  const updateExpression = (index, value) => {
    const updated = [...expressions]
    updated[index] = { ...updated[index], value }
    setExpressions(updated)
  }

  const changeColor = (index, newColor) => {
    const updated = [...expressions]
    updated[index] = { ...updated[index], color: newColor }
    setExpressions(updated)
    setColorPickerIndex(null) // cerrar picker
  }

  // Estilo del popper de info
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

  // Estilo del popper de color
  const pickerStyle = {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: "-48px", // movido a la izquierda
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
                <li>Presionar “HIGHLIGHT” para aplicarlas.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {expressions.map((expression, index) => (
        <div
          key={index}
          style={{ display: "flex", marginBottom: 12, alignItems: "center" }}>
          <input
            value={expression.value}
            onChange={(e) => updateExpression(index, e.target.value)}
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 5,
              marginRight: 10
            }}
          />

          <div style={{ position: "relative" }}>
            {/* Bloque de color clicable */}
            <div
              onClick={() =>
                setColorPickerIndex((prev) => (prev === index ? null : index))
              }
              style={{
                width: 40,
                height: 40,
                backgroundColor: expression.color,
                borderRadius: 5,
                cursor: "pointer",
                border: "1px solid #999"
              }}
            />

            {/* Popper de selección de color */}
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
                        col === expression.color
                          ? "2px solid #333"
                          : "1px solid #ccc"
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addExpression}
        style={{
          width: "100%",
          padding: 8,
          backgroundColor: "#DDDDDD",
          border: "none",
          borderRadius: 5,
          marginBottom: 12,
          cursor: "pointer",
          fontSize: 16
        }}>
        +
      </button>

      <button
        style={{
          width: "100%",
          padding: 16,
          backgroundColor: "#66D9A8",
          color: "#333",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          fontSize: 16,
          fontWeight: "bold"
        }}>
        HIGHLIGHT
      </button>
    </div>
  )
}

export default IndexPopup

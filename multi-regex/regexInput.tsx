import { useState } from "~node_modules/@types/react"

type RegexInputProps = {
  id: string
  expression: string
  color: string
  onChange: (id: string, data: { expression: string; color: string }) => void
  onDelete: (id: string) => void
}


export default function InputRegex({ id, expression, color, onChange, onDelete }: RegexInputProps){

  return (
    <div className="mb-4 border rounded p-2">
      <input
        type="text"
        value={expression}
        placeholder="Regex"
        onChange={(e) => onChange(id, { expression: e.target.value, color })}
        className="w-full p-1 mb-2 border"
      />
      <div className="flex items-center justify-between">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(id, { expression, color: e.target.value })}
          className="w-10 h-6"
        />
        <button
          onClick={() => onDelete(id)}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
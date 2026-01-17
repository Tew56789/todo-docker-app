import { useState } from "react"

export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("normal")

  const submit = () => {
    if (!title.trim()) return
    onAdd(title, priority)
    setTitle("")
  }

  return (
    <div className="add">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="เพิ่มงานใหม่..."
        onKeyDown={e => e.key === "Enter" && submit()}
      />

      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="high">🔥 ด่วน</option>
        <option value="normal">📝 ปกติ</option>
        <option value="low">🌱 ชิล</option>
      </select>

      <button onClick={submit}>Add</button>
    </div>
  )
}

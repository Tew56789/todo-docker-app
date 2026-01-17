import { useEffect, useState } from "react"
import "./App.css"

const API = "https://todo-backend-app-5q02.onrender.com/api"

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState("")

  // โหลด todos
  const loadTodos = async () => {
    const res = await fetch(`${API}/todos`)
    const data = await res.json()
    setTodos(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // เพิ่ม todo
  const addTodo = async () => {
    if (!title.trim()) return

    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })

    const newTodo = await res.json()
    setTodos(prev => [newTodo, ...prev])
    setTitle("")
  }

  // สลับสถานะ
  const toggleTodo = async (todo) => {
  await fetch(`${API}/todos/${todo.id}`, {
    method: "PUT"
  })

  setTodos(prev =>
    prev.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    )
  )
}


  // แก้ไขชื่อ
  const saveEdit = async (todo) => {
    if (!editingTitle.trim()) {
      setEditingId(null)
      return
    }

    await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle })
    })

    setEditingId(null)
    loadTodos()
  }

  // ❌ ลบ todo
  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: "DELETE"
    })
    loadTodos()
  }

  // รายการแต่ละอัน
  const TodoItem = ({ todo }) => (
    <div className={`todo ${todo.completed ? "done" : ""}`}>
      <div className="left">
        {editingId === todo.id ? (
          <input
            autoFocus
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={() => saveEdit(todo)}
            onKeyDown={e => {
              if (e.key === "Enter") saveEdit(todo)
              if (e.key === "Escape") setEditingId(null)
            }}
          />
        ) : (
          <span
            onClick={() => toggleTodo(todo)}
            onDoubleClick={() => {
              setEditingId(todo.id)
              setEditingTitle(todo.title)
            }}
          >
            {todo.completed ? "✅" : "⬜"} {todo.title}
          </span>
        )}
      </div>

      <button
        className="delete"
        onClick={() => deleteTodo(todo.id)}
        title="ลบ"
      >
        🗑️
      </button>
    </div>
  )

  const pending = todos.filter(t => !t.completed)
  const done = todos.filter(t => t.completed)

  return (
    <div className="app">
      <div className="card">
        <h2>📝 Todo App</h2>

        <div className="add">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="เพิ่มงานใหม่..."
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <h3>⏳ ยังไม่ทำ</h3>
        {pending.length === 0 && <p className="empty">ไม่มีงานค้าง</p>}
        {pending.map(t => <TodoItem key={t.id} todo={t} />)}

        <h3>🎉 ทำแล้ว</h3>
        {done.length === 0 && <p className="empty">ยังไม่มีงานที่เสร็จ</p>}
        {done.map(t => <TodoItem key={t.id} todo={t} />)}
      </div>
    </div>
  )
}

export default App

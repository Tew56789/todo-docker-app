import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import "./App.css"

const API = "/api"

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [dark, setDark] = useState(false)

  // ======================
  // โหลด todo จาก backend
  // ======================
  const loadTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`)
      const data = await res.json()
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Load todos failed:", err)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // ======================
  // ✅ ADD (วิธีที่ดีที่สุด)
  // ======================
  const addTodo = async () => {
    if (!title.trim()) return

    try {
      await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      })

      setTitle("")
      loadTodos() // ⭐ สำคัญมาก
    } catch (err) {
      console.error("Add todo failed:", err)
    }
  }

  // ======================
  // TOGGLE
  // ======================
  const toggleTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "PUT" })
    loadTodos()
  }

  // ======================
  // DELETE
  // ======================
  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" })
    loadTodos()
  }

  // ======================
  // DRAG
  // ======================
  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(todos)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setTodos(items)
  }

  // ======================
  // FILTER
  // ======================
  const filteredTodos = todos.filter(t => {
    if (filter === "done") return t.completed
    if (filter === "pending") return !t.completed
    return true
  })

  return (
    <div className={dark ? "dark app" : "app"}>
      <div className="card">

        <div className="top">
          <h2>Todo App</h2>
          <button onClick={() => setDark(!dark)}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="add">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="New task..."
            onKeyDown={e => e.key === "Enter" && addTodo()}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="filters">
          <button onClick={() => setFilter("all")} className={filter==="all"?"active":""}>📋 All</button>
          <button onClick={() => setFilter("done")} className={filter==="done"?"active":""}>✅ Done</button>
          <button onClick={() => setFilter("pending")} className={filter==="pending"?"active":""}>⏳ Pending</button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filteredTodos.map((t, i) => (
                  <Draggable key={t.id} draggableId={String(t.id)} index={i}>
                    {(p) => (
                      <div
                        ref={p.innerRef}
                        {...p.draggableProps}
                        {...p.dragHandleProps}
                        className={t.completed ? "todo done" : "todo"}
                      >
                        <span onClick={() => toggleTodo(t.id)}>
                          {t.completed ? "✅" : "⬜"} {t.title}
                        </span>
                        <button onClick={() => deleteTodo(t.id)}>❌</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </div>
    </div>
  )
}

export default App

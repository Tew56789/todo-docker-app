import express from "express"
import cors from "cors"
import { readTodos, saveTodos } from "./storage.js"

const app = express()

app.use(cors())
app.use(express.json())

// =======================
// ✅ API routes (/api)
// =======================

// GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await readTodos()
    res.json(Array.isArray(todos) ? todos : [])
  } catch (err) {
    res.status(500).json({ error: "Cannot read todos" })
  }
})

// ADD todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body

    // ✅ กันข้อมูลว่าง
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" })
    }

    const todos = await readTodos()

    const newTodo = {
      id: Date.now(),          // number (ตรงกับ frontend)
      title: title.trim(),
      completed: false
    }

    todos.unshift(newTodo)
    await saveTodos(todos)

    // ✅ ส่ง todo กลับไปให้ frontend ใช้ setState
    res.status(201).json(newTodo)
  } catch (err) {
    res.status(500).json({ error: "Cannot add todo" })
  }
})

// TOGGLE completed
app.put("/api/todos/:id", async (req, res) => {
  try {
    const todos = await readTodos()

    const updated = todos.map(t =>
      String(t.id) === req.params.id
        ? { ...t, completed: !t.completed }
        : t
    )

    await saveTodos(updated)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Cannot update todo" })
  }
})

// DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todos = await readTodos()
    const filtered = todos.filter(t => String(t.id) !== req.params.id)

    await saveTodos(filtered)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Cannot delete todo" })
  }
})

// =======================
// ✅ Render / Docker PORT
// =======================
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("Backend running on port", PORT)
})

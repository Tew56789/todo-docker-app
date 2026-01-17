import express from "express"
import cors from "cors"
import { readTodos, saveTodos } from "./storage.js"

const app = express()

app.use(cors())
app.use(express.json())

// =======================
// ✅ API routes (มี /api)
// =======================

// GET all
app.get("/api/todos", async (req, res) => {
  const todos = await readTodos()
  res.json(todos)
})

// ADD
app.post("/api/todos", async (req, res) => {
  const todos = await readTodos()

  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  }

  todos.unshift(newTodo)
  await saveTodos(todos)

  res.json(newTodo)
})

// TOGGLE
app.put("/api/todos/:id", async (req, res) => {
  const todos = await readTodos()

  const updated = todos.map(t =>
    t.id == req.params.id ? { ...t, completed: !t.completed } : t
  )

  await saveTodos(updated)
  res.json({ success: true })
})

// DELETE
app.delete("/api/todos/:id", async (req, res) => {
  const todos = await readTodos()
  const filtered = todos.filter(t => t.id != req.params.id)

  await saveTodos(filtered)
  res.json({ success: true })
})

// =======================
// ✅ ใช้ PORT จาก Render
// =======================
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log("Backend running on port", PORT)
)

import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// =======================
// ✅ ใช้ MEMORY แทนไฟล์
// =======================
let todos = []

// GET all
app.get("/api/todos", (req, res) => {
  res.json(todos)
})

// ADD
app.post("/api/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  }

  todos.unshift(newTodo)
  res.json(newTodo)
})

// TOGGLE
app.put("/api/todos/:id", (req, res) => {
  todos = todos.map(t =>
    t.id == req.params.id
      ? { ...t, completed: !t.completed }
      : t
  )
  res.json({ success: true })
})

// DELETE
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id != req.params.id)
  res.json({ success: true })
})

// =======================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Backend running on port", PORT)
})

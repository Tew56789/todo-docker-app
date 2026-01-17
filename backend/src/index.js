import express from "express"
import path from "path"
import cors from "cors"
import { fileURLToPath } from "url"
import { readTodos, saveTodos } from "./storage.js"

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// =======================
// API
// =======================
app.get("/api/todos", async (req, res) => {
  res.json(await readTodos())
})

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

app.put("/api/todos/:id", async (req, res) => {
  const todos = await readTodos()
  await saveTodos(
    todos.map(t =>
      t.id == req.params.id ? { ...t, completed: !t.completed } : t
    )
  )
  res.json({ success: true })
})

app.delete("/api/todos/:id", async (req, res) => {
  const todos = await readTodos()
  await saveTodos(todos.filter(t => t.id != req.params.id))
  res.json({ success: true })
})

// =======================
// Serve Frontend
// =======================
app.use(express.static(path.join(__dirname, "../../frontend/build")))

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/build/index.html")
  )
})

// =======================
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
)

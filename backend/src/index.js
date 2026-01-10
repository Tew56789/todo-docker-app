import express from "express"
import cors from "cors"
import { readTodos, saveTodos } from "./storage.js"

const app = express()
app.use(cors())
app.use(express.json())

// GET all
app.get("/todos", async (req, res) => {
  const todos = await readTodos()
  res.json(todos)
})

// ADD
app.post("/todos", async (req, res) => {
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
app.put("/todos/:id", async (req, res) => {
  const todos = await readTodos()

  const updated = todos.map(t =>
    t.id == req.params.id ? { ...t, completed: !t.completed } : t
  )

  await saveTodos(updated)
  res.json({ success: true })
})

// DELETE
app.delete("/todos/:id", async (req, res) => {
  const todos = await readTodos()
  const filtered = todos.filter(t => t.id != req.params.id)

  await saveTodos(filtered)
  res.json({ success: true })
})

app.listen(5000, () => console.log("Backend running on 5000"))

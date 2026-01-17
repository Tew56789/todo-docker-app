import fs from "fs/promises"
import path from "path"

// ชี้ไปที่ backend/data/todos.json แบบชัวร์
const FILE = path.join(process.cwd(), "backend", "data", "todos.json")

export async function readTodos() {
  try {
    const data = await fs.readFile(FILE, "utf-8")
    return JSON.parse(data)
  } catch (err) {
    console.error("readTodos error:", err)
    return []
  }
}

export async function saveTodos(todos) {
  await fs.writeFile(FILE, JSON.stringify(todos, null, 2))
}

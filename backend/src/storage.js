import fs from "fs/promises"

const FILE = "./data/todos.json"

export async function readTodos() {
  try {
    const data = await fs.readFile(FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveTodos(todos) {
  await fs.writeFile(FILE, JSON.stringify(todos, null, 2))
}

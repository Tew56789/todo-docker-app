const TodoItem = ({ todo }) => (
  <div className={`todo ${todo.completed ? "done" : ""}`}>
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
      <div
        className="left"
        onClick={() => toggleTodo(todo)}
        onDoubleClick={() => {
          setEditingId(todo.id)
          setEditingTitle(todo.title)
        }}
      >
        {todo.completed ? "✅" : "⬜"} {todo.title}
      </div>
    )}

    <button className="delete" onClick={() => deleteTodo(todo.id)}>
      🗑️
    </button>
  </div>
)

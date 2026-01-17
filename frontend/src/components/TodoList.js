import { Droppable } from "@hello-pangea/dnd"
import TodoItem from "./TodoItem"

export default function TodoList({ title, items, reload }) {
  return (
    <>
      <h4>{title} ({items.length})</h4>
      <Droppable droppableId={title}>
        {(p) => (
          <div ref={p.innerRef} {...p.droppableProps}>
            {items.map((t, i) => (
              <TodoItem key={t.id} todo={t} reload={reload} />
            ))}
            {p.placeholder}
          </div>
        )}
      </Droppable>
      <hr />
    </>
  )
}

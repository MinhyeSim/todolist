// src/features/todos/components/TodoSection.tsx
import { TodoResponse } from "../types";
import TodoItem from "./TodoItem";

type Props = {
  title: string;
  color: string;
  todos: TodoResponse[];          
  onToggle: (id: number) => void;
};

const TodoSection = ({ title, color, todos, onToggle }: Props) => {
  const isDone = title.toLowerCase() === "done";

  return (
    <section className="flex-1 space-y-4">
      <h2 className={`text-lg font-bold px-3 py-1 rounded-full w-fit ${color}`}>
        {title}
      </h2>

      {todos.length === 0 ? (
        <div className="text-center text-slate-400 italic">
          {isDone ? "아직 완료한 일이 없어요" : "해야할 일이 없어요"}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TodoSection;

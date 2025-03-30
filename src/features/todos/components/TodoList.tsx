// src/features/todos/components/TodoList.tsx
import { Todo } from "../types";
import TodoSection from "./TodoSection";

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void; 
};

const TodoList = ({ todos, onToggle }: Props) => {
  const todoItems = todos.filter((t) => t.status === "todo");
  const doneItems = todos.filter((t) => t.status === "done");

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
      <TodoSection
        title="TO DO"
        color="bg-lime-300 text-slate-900"
        todos={todoItems}
        onToggle={onToggle}
      />
      <TodoSection
        title="DONE"
        color="bg-violet-600 text-white"
        todos={doneItems}
        onToggle={onToggle}
      />
    </div>
  );
};

export default TodoList;

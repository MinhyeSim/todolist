import { TodoResponse } from "../types";
import TodoSection from "./TodoSection";

type Props = {
  todos: TodoResponse[];
  onToggle: (id: number) => void; 
};

const TodoList = ({ todos, onToggle }: Props) => {
  const todoItems = todos.filter((t) => !t.isCompleted);
  const doneItems = todos.filter((t) => t.isCompleted);
  
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

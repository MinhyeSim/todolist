import { Todo } from "../types";
import { useRouter } from "next/router";
import Card from "@/components/Card";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import Circle from "lucide-react/dist/esm/icons/circle";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
};

const TodoItem = ({ todo, onToggle }: Props) => {
  const isDone = todo.status === "done";
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/items/${todo.id}`);
  };

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onToggle(todo.id);
  };

  return (
    <Card
      onClick={handleCardClick} 
      className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition"
    >
      <button type="button" onClick={handleToggleClick}>
        {isDone ? (
          <CheckCircle className="text-violet-600" />
        ) : (
          <Circle className="text-slate-400" />
        )}
      </button>

      <span
        className={`flex-1 text-base ${
          isDone ? "line-through text-slate-400" : "text-slate-900"
        }`}
      >
        {todo.content}
      </span>
    </Card>
  );
};

export default TodoItem;

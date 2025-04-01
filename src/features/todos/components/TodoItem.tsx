import { TodoResponse } from "../types";
import { useRouter } from "next/router";
import Card from "@/components/Card";
import CheckCircle from "lucide-react/dist/esm/icons/check-circle";
import Circle from "lucide-react/dist/esm/icons/circle";

type Props = {
  todo: TodoResponse;
  onToggle: (id: number) => void;
};

const TodoItem = ({ todo, onToggle }: Props) => {
  const router = useRouter();
  const isDone = todo.isCompleted;

  const handleCardClick = () => {
    router.push(`/items/${todo.id}`);
  };

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 카드 클릭 방지
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
        {todo.name}
      </span>
    </Card>
  );
};

export default TodoItem;

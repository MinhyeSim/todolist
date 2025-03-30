import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Todo } from "@/features/todos/types";
import TodoItem from "@/features/todos/components/TodoItem";
import { createTodo } from "@/features/todos/api";

const tenantId = "minhye";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(tenantId);
    if (saved) {
      setTodos(JSON.parse(saved));
    } else {
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    if (todos) {
      localStorage.setItem(tenantId, JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTask = async() => {
    if (!task.trim()) {
      setError("할 일을 입력해주세요.");
      return;
    }

    try {
      const newTodoFromServer = await createTodo(tenantId, { name: task.trim() });

    const newTodo: Todo = {
      id: String(newTodoFromServer.id),
      content: newTodoFromServer.name,
      status: newTodoFromServer.isCompleted ? "done" : "todo",
    };
    
      console.log("🟢 새 할 일:", newTodo);
      setTodos((prev) => [...(prev ?? []), newTodo]);
      setTask("");
      setError("");
    } catch (err) {
      const error = err as any;
      console.error("할 일 추가 실패:",  error?.response?.data || error.message || error);
      setError("등록 중 오류가 발생했습니다.");
    }
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev?.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "todo" ? "done" : "todo" }
          : todo
      ) ?? []
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask();
  };

  const todoItems = todos?.filter((t) => t.status === "todo") ?? [];
  const doneItems = todos?.filter((t) => t.status === "done") ?? [];

  if (todos === null) {
    return <div className="text-center py-10 text-slate-500">로딩 중...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 px-6 py-10">
      {/* 입력창 */}
      <div className="max-w-6xl mx-auto mt-8 mb-12">
        <div className="flex justify-center">
          <div className="grid grid-cols-[1fr_auto] gap-4 w-full max-w-[700px] mx-auto">
            <Input
              placeholder="할 일을 입력하세요"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              error={error}
              className="flex-1 h-12 px-6 py-2 text-base border-2 border-slate-900 rounded-full"
            />
            <Button
              onClick={handleAddTask}
              className="h-12 px-6 border-2 border-slate-900 bg-white hover:bg-slate-100 rounded-full"
              >
              + 추가하기
            </Button>
          </div>
        </div>
      </div>

      {/* 좌우 카드 레이아웃 */}
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* TO DO 카드 */}
        <div className="w-1/2">
          <h2 className="mb-4 px-4 py-2 rounded-full bg-lime-300 text-slate-900 font-bold inline-block">
            TO DO
          </h2>
          <div className="space-y-4">
            {todoItems.length === 0 ? (
              <p className="text-slate-400 px-4">할 일이 없어요</p>
            ) : (
              todoItems.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
              ))
            )}
          </div>
        </div>

        {/* DONE 카드 */}
        <div className="w-1/2">
          <h2 className="mb-4 px-4 py-2 rounded-full bg-green-800 text-white font-bold inline-block">
            DONE
          </h2>
          <div className="space-y-4">
            {doneItems.length === 0 ? (
              <p className="text-slate-400 px-4">아직 다한 일이 없어요</p>
            ) : (
              doneItems.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
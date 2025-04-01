import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { TodoResponse } from "@/features/todos/types";
import TodoSection from "@/features/todos/components/TodoSection";
import { createTodo, getTodos, updateTodoStatus } from "@/features/todos/api";

const tenantId = "minhye";

export default function HomePage() {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 서버에서 할 일 목록 불러오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const serverTodos = await getTodos(tenantId);
        setTodos(serverTodos);
        localStorage.setItem(tenantId, JSON.stringify(serverTodos));
      } catch (err) {
        console.error("할 일 목록 불러오기 실패", err);
        const cached = localStorage.getItem(tenantId);
        if (cached) {
          setTodos(JSON.parse(cached));
        }
      }
    };
    fetchTodos();
  }, []);

  // 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem(tenantId, JSON.stringify(todos));
  }, [todos]);

  // 할 일 추가
  const handleAddTask = async () => {
    if (!task.trim()) {
      setError("할 일을 입력해주세요.");
      return;
    }

    try {
      const newTodo = await createTodo(tenantId, { name: task.trim() });
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      setTask("");
      setError("");
    } catch (err) {
      console.error("할 일 추가 실패", err);
      setError("등록 중 오류가 발생했습니다.");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updatedTodos = todos?.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      ) || [];
  
      setTodos(updatedTodos);
  
      const toggled = updatedTodos.find((t) => t.id === id);
      if (toggled) {
        await updateTodoStatus(tenantId, toggled.id, toggled.isCompleted);
      }
  
      // localStorage에도 저장
      localStorage.setItem(tenantId, JSON.stringify(updatedTodos));
    } catch (err) {
      console.error("토글 업데이트 실패", err);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask();
  };

  const todoItems = todos.filter((todo) => !todo.isCompleted);
  const doneItems = todos.filter((todo) => todo.isCompleted);

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

      {/* 목록 */}
      <div className="max-w-6xl mx-auto flex gap-8">
        <TodoSection
          title="TO DO"
          color="bg-lime-300 text-slate-900"
          todos={todoItems}
          onToggle={handleToggle}
        />
        <TodoSection
          title="DONE"
          color="bg-green-800 text-white"
          todos={doneItems}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}

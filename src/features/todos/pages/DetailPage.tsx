"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TodoResponse } from "@/features/todos/types";
import {
  getTodoDetail,
  updateTodo,
  deleteTodo,
  uploadImage,
} from "@/features/todos/api";

const tenantId = "minhye";

export default function DetailPage() {
  const router = useRouter();
  const { itemId } = router.query;

  const [todo, setTodo] = useState<TodoResponse | null>(null);
  const [name, setName] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  // 상세 조회
  useEffect(() => {
    if (!itemId) return;

    const fetch = async () => {
      try {
        const result = await getTodoDetail(tenantId, String(itemId));
        setTodo(result);
        setName(result.name);
        setIsCompleted(result.isCompleted);
        setMemo(result.memo || "");
        setImageUrl(result.imageUrl || null);
      } catch (err) {
        const error = err as any;
        console.error("상세 조회 실패:", error?.response?.data || error.message || error);
      }
    };

    fetch();
  }, [itemId]);

  // 수정
  const handleSave = async () => {
    if (!todo || !itemId) return;

    try {
      const updated = await updateTodo(tenantId, todo.id, {
        name,
        memo,
        imageUrl,
        isCompleted,
      });

      const saved = localStorage.getItem(tenantId);
      if (saved) {
        const todos: TodoResponse[] = JSON.parse(saved);
        const updatedTodos = todos.map((t) =>
          t.id === updated.id ? updated : t
        );
        localStorage.setItem(tenantId, JSON.stringify(updatedTodos));
      }

      router.push("/");
    } catch (err) {
      const error = err as any;
      console.error("수정 실패:", error?.response?.data || error.message || error);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!todo) return;

    try {
      await deleteTodo(tenantId, todo.id);

      const saved = localStorage.getItem(tenantId);
      if (saved) {
        const todos: TodoResponse[] = JSON.parse(saved);
        const filtered = todos.filter((t) => t.id !== todo.id);
        localStorage.setItem(tenantId, JSON.stringify(filtered));
      }

      router.push("/");
    } catch (err) {
      const error = err as any;
      console.error("삭제 실패:", error?.response?.data || error.message || error);
    }
  };

  // 이미지 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isEnglish = /^[a-zA-Z0-9_.-]+$/.test(file.name);
    if (!isEnglish) {
      setImageError("파일 이름은 영어로만 되어 있어야 합니다.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("파일 크기는 5MB 이하만 가능합니다.");
      return;
    }

    try {
      const url = await uploadImage(tenantId, file);
      setImageUrl(url);
      setImageError("");
    } catch (err) {
      const error = err as any;
      console.error("업로드 실패:", error?.response?.data || error.message || error);
      setImageError("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  if (!todo)
    return <div className="p-6 text-center text-slate-500">할 일을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      {/* 상태 + 제목 */}
      <div className="space-y-1">
        <div className="flex gap-2">
          <button
            onClick={() => setIsCompleted((prev) => !prev)}
            className={`text-sm px-3 py-1 rounded-full font-semibold transition ${
              isCompleted
                ? "bg-violet-600 text-white"
                : "bg-slate-300 text-slate-900"
            }`}
          >
            {isCompleted ? "완료됨" : "진행 중"}
          </button>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="할 일 제목"
            className="flex-1 border border-slate-300 px-4 py-2 rounded-md text-base"
          />
        </div>
      </div>

      {/* 메모 */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-600">메모</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
          className="w-full min-h-[100px] border border-slate-300 px-4 py-2 rounded-md resize-none"
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600">
          이미지 업로드
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block text-sm text-slate-600"
        />
        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="미리보기"
            className="w-32 h-32 object-cover rounded-lg border border-slate-300"
          />
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-between pt-4 border-t border-slate-200 mt-4">
        <button
          onClick={() => router.push("/")}
          className="bg-slate-100 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-200"
        >
          ← 돌아가기
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
          >
            삭제하기
          </button>
          <button
            onClick={handleSave}
            className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}

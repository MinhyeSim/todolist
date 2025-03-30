"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Todo } from "@/features/todos/types";

const tenantId = "minhye";

export default function DetailPage() {
  const router = useRouter();
  const { itemId } = router.query;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"todo" | "done">("todo");
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!itemId) return;

    const saved = localStorage.getItem(tenantId);
    if (saved) {
      const todos: Todo[] = JSON.parse(saved);
      const found = todos.find((t) => t.id === itemId);
      if (found) {
        setTodo(found);
        setContent(found.content);
        setStatus(found.status);
        setMemo(found.memo || "");
        setImageUrl(found.imageUrl || null);
      }
    }
  }, [itemId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageError("");
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleSave = () => {
    if (!todo) return;

    const saved = localStorage.getItem(tenantId);
    if (saved) {
      const todos: Todo[] = JSON.parse(saved);
      const updated = todos.map((t) =>
        t.id === todo.id ? { ...t, content, status, memo, imageUrl } : t
      );
      localStorage.setItem(tenantId, JSON.stringify(updated));
    }

    router.push("/");
  };

  const handleDelete = () => {
    if (!todo) return;

    const saved = localStorage.getItem(tenantId);
    if (saved) {
      const todos: Todo[] = JSON.parse(saved);
      const filtered = todos.filter((t) => t.id !== todo.id);
      localStorage.setItem(tenantId, JSON.stringify(filtered));
    }

    router.push("/");
  };

  if (!todo) return <div className="p-6 text-center text-slate-500">할 일을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">


      {/* 상태 + 제목 */}
      <div className="space-y-1">
        <div className="flex gap-2">
          <button
            onClick={() =>
              setStatus((prev) => (prev === "todo" ? "done" : "todo"))
            }
            className={`text-sm px-3 py-1 rounded-full font-semibold transition ${
              status === "done"
                ? "bg-violet-600 text-white"
                : "bg-slate-300 text-slate-900"
            }`}
          >
            {status === "done" ? "완료됨" : "진행 중"}
          </button>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
        <label className="text-sm font-semibold text-slate-600">이미지 업로드</label>
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

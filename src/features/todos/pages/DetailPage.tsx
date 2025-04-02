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

  useEffect(() => {
    if (!itemId) return;
    const fetchData = async () => {
      try {
        const result = await getTodoDetail(tenantId, String(itemId));
        setTodo(result);
        setName(result.name);
        setIsCompleted(result.isCompleted);
        setMemo(result.memo || "");
        setImageUrl(result.imageUrl || null);
      } catch (err) {
        const error = err as any;
        console.error("상세 조회 실패", error?.response?.data || error.message || error);
      }
    };
    fetchData();
  }, [itemId]);

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
      console.error("수정 실패", error?.response?.data || error.message || error);
    }
  };

  // 삭제하기
  const handleDelete = async () => {
    if (!todo) return;
    try {
      await deleteTodo(tenantId, todo.id);
      router.push("/");
    } catch (err) {
      const error = err as any;
      console.error("삭제 실패", error?.response?.data || error.message || error);
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
      console.log(url);
      setImageError("");
    } catch (err) {
      const error = err as any;
      console.error("업로드 실패:", error?.response?.data || error.message || error);
      setImageError("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  if (!todo) {
    return (
      <div className="p-6 text-center text-slate-500">할 일을 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* 상단 제목 입력과 상태 */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsCompleted((prev) => !prev)}
          className="w-[90px] shrink-0 text-sm px-3 py-1 rounded-full font-semibold transition bg-slate-300 text-slate-900"
        >
          {isCompleted ? "✅ 완료됨" : "⭕ 진행 중"}
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 text-lg bg-transparent outline-none"
          placeholder="할 일 제목을 입력하세요"
        />
      </div>

      {/* 중단: 좌측 이미지 / 우측 메모 */}
      <div className="flex gap-6">
        {/* 이미지 업로드 */}
        <div className="w-1/2 bg-slate-100 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col justify-center items-center min-h-[250px]">
          <label className="text-sm text-slate-500 mb-2">이미지 업로드</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
          {imageUrl && (
            <div className="w-full h-[240px] flex items-center justify-center">
            <img
              src={imageUrl}
              alt="미리보기"
              className="w-full h-full object-contain max-h-60 rounded-lg"
            />
            </div>
          )}
        </div>

        {/* 메모 입력 */}
        <div className="w-1/2 bg-yellow-50 rounded-xl p-4">
          <h3 className="block text-center font-semibold text-slate-800 text-sm mb-2">
            Memo
          </h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
            className="w-[745px] h-[200px] p-3 border border-slate-300 rounded-md resize-none bg-[#fffbea] text-slate-800 text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="bg-white border border-slate-900 px-4 py-2 rounded-full hover:bg-slate-100"
        >
          ✔ 수정 완료
        </button>
        <button
          onClick={handleDelete}
          className="bg-[#F43F5E] text-white px-4 py-2 rounded-full hover:bg-[#e11d48]"
        >
          ✖ 삭제하기
        </button>
      </div>
    </div>
  );
}

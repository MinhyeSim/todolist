import api from "@/lib/axios";
import { CreateTodoPayload, TodoResponse } from "./types";


export async function updateTodoStatus(
  tenantId: string,
  itemId: number,
  isCompleted: boolean
) {
  return await api.patch(`/${tenantId}/items/${itemId}`, { isCompleted });
}

// 할 일 생성 - 서버는 name만 받음
export async function createTodo(
  tenantId: string,
  payload: Pick<CreateTodoPayload, "name"> // name만 전달
): Promise<TodoResponse> {
  const response = await api.post<TodoResponse>(`/${tenantId}/items`, payload);
  return response.data;
}

// 전체 목록 조회
export async function getTodos(tenantId: string): Promise<TodoResponse[]> {
  const response = await api.get<TodoResponse[]>(`/${tenantId}/items`);
  return response.data;
}

//  항목 상세 조회
export async function getTodoDetail(
  tenantId: string,
  itemId: string
): Promise<TodoResponse> {
  const response = await api.get<TodoResponse>(`/${tenantId}/items/${itemId}`);
  return response.data;
}

// 수정
export async function updateTodo(
  tenantId: string,
  itemId: number,
  payload: Partial<Omit<TodoResponse, "id" | "tenantId">>
): Promise<TodoResponse> {
  // imageUrl, memo가 null이면 빈 문자열로 교체
  const cleanedPayload = {
    ...payload,
    imageUrl: payload.imageUrl ?? "",
    memo: payload.memo ?? "",
  };

  const response = await api.patch<TodoResponse>(
    `/${tenantId}/items/${itemId}`,
    cleanedPayload
  );

  return response.data;
}

// 삭제
export async function deleteTodo(
  tenantId: string,
  itemId: number
): Promise<void> {
  await api.delete(`/${tenantId}/items/${itemId}`);
}

// 이미지 업로드
export async function uploadImage(tenantId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ imageUrl: string }>(
    `/${tenantId}/images/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.imageUrl;
}
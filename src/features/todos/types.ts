// 서버 응답 받을 때 사용하는 타입
export type TodoResponse = {
  id: number;
  tenantId: string;
  name: string;
  memo: string | null;
  imageUrl: string | null;
  isCompleted: boolean;
};

// 서버로 보낼 요청 페이로드 타입
export type CreateTodoPayload = {
  name: string;
  memo: string;
  imageUrl: string;
  isCompleted: boolean;
};

export type UpdateTodoPayload = Partial<
  Omit<TodoResponse, "id" | "tenantId">
>;
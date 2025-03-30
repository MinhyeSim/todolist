import api from "@/lib/axios";
import { Todo } from "./types";


type CreateTodoResponse = {
  id: number | string;
  tenantId: string;
  name: string;
  memo: string | null;
  imageUrl: string | null;
  isCompleted: boolean;
};

export async function createTodo(
  tenantId: string,
  payload: { name: string }
): Promise<CreateTodoResponse> {
  const response = await api.post(`/${tenantId}/items`, payload);
  return response.data as CreateTodoResponse;
}


export async function getTodos(tenantId: string): Promise<Todo[]> {
    const response = await api.get<Todo[]>(`/${tenantId}/items`);
    return response.data;
}
  
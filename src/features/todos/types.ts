export type Todo = {
    id: string;
    content: string;
    status: "todo" | "done";
    memo?: string;
    imageUrl?: string;
  };
  
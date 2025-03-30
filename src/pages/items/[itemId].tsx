import dynamic from "next/dynamic";

// 클라이언트에서만 렌더링하도록 설정
const DetailPage = dynamic(() => import("@/features/todos/pages/DetailPage"), {
  ssr: false,
});

export default DetailPage;

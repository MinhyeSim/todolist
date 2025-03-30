import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

const Card = ({ children, className, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white p-4 shadow-md ${className ?? ""}`}
    >
      {children}
    </div>
  );
};

export default Card;

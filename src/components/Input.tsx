import React from "react";
import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type InputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  value,
  onChange,
  placeholder,
  className,
  onKeyDown,
  error,
}: InputProps) => {
  return (
    <div className="w-full">
      <input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={clsx(
          className,
          "border-2 rounded-md px-4 py-2 w-full",
          error ? "border-red-500" : "border-slate-300"
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;



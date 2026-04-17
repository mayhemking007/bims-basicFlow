import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type PrimaryButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function PrimaryButton({ children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`rounded-md bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700 ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

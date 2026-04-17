import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type SecondaryButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function SecondaryButton({ children, className = "", ...props }: SecondaryButtonProps) {
  return (
    <button
      className={`rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

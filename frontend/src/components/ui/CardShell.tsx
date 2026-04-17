import type { PropsWithChildren } from "react";

export function CardShell({ children }: PropsWithChildren) {
  return <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{children}</section>;
}

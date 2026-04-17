import type { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
  return <main className="mx-auto min-h-screen max-w-3xl p-6">{children}</main>;
}

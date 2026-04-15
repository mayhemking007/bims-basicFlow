import { Link, useParams } from "react-router-dom";

export function MindCardPlayerPage() {
  const { id } = useParams();

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">MindCard Player</h1>
        <Link className="text-sm text-slate-700 underline" to="/">
          Back to Wall
        </Link>
      </header>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Player scaffold for card ID: {id ?? "unknown"}.</p>
      </section>
    </main>
  );
}

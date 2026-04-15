import { Link } from "react-router-dom";

export function MindCardWallPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">MindCard Wall</h1>
        <Link className="rounded-md bg-slate-800 px-4 py-2 text-sm text-white" to="/create">
          Create MindCard
        </Link>
      </header>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Wall page scaffold is ready for Phase 5.</p>
      </section>
    </main>
  );
}

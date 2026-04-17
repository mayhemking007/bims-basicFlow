import { Link, useParams } from "react-router-dom";
import { CardShell } from "../components/ui/CardShell";
import { PageContainer } from "../components/ui/PageContainer";

export function MindCardPlayerPage() {
  const { id } = useParams();

  return (
    <PageContainer>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">MindCard Player</h1>
        <Link className="text-sm text-slate-700 underline" to="/">
          Back to Wall
        </Link>
      </header>
      <CardShell>
        <p className="text-slate-600">Player scaffold for card ID: {id ?? "unknown"}.</p>
      </CardShell>
    </PageContainer>
  );
}

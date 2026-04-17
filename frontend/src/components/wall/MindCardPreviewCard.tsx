import { Link } from "react-router-dom";

import type { MindCardSummaryDto } from "../../types/mindcard";
import { CardShell } from "../ui/CardShell";

interface MindCardPreviewCardProps {
  card: MindCardSummaryDto;
}

function getStepLabel(stepsCount: number): string {
  return `${stepsCount} step${stepsCount === 1 ? "" : "s"}`;
}

function shortenIntro(intro: string): string {
  const trimmedIntro = intro.trim();
  if (trimmedIntro.length <= 140) {
    return trimmedIntro;
  }

  return `${trimmedIntro.slice(0, 137).trimEnd()}...`;
}

export function MindCardPreviewCard({ card }: MindCardPreviewCardProps) {
  const ownerLabel = card.user.username || card.user.id;

  return (
    <Link className="block" to={`/card/${card.id}`}>
      <CardShell>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-800">{card.title}</h2>
              <p className="text-sm text-slate-500">By {ownerLabel}</p>
            </div>
            <p className="shrink-0 text-sm font-medium text-slate-600">{getStepLabel(card.stepsCount)}</p>
          </div>
          <p className="text-sm leading-6 text-slate-600">{shortenIntro(card.intro)}</p>
        </div>
      </CardShell>
    </Link>
  );
}

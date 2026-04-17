import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMindCards } from "../api/client";
import { MindCardPreviewCard } from "../components/wall/MindCardPreviewCard";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageContainer } from "../components/ui/PageContainer";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import type { MindCardSummaryDto } from "../types/mindcard";

export function MindCardWallPage() {
  const [cards, setCards] = useState<MindCardSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCards() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const nextCards = await getMindCards();

        if (!isMounted) {
          return;
        }

        setCards(nextCards);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "Unable to load MindCards.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCards();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">MindCard Wall</h1>
        <Link to="/create">
          <PrimaryButton>Create MindCard</PrimaryButton>
        </Link>
      </header>

      {isLoading ? <LoadingState label="Loading MindCards..." /> : null}

      {!isLoading && errorMessage ? <ErrorState message={errorMessage} /> : null}

      {!isLoading && !errorMessage && cards.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">No MindCards yet. Create the first one to get the wall started.</p>
        </section>
      ) : null}

      {!isLoading && !errorMessage && cards.length > 0 ? (
        <div className="space-y-4">
          {cards.map((card) => (
            <MindCardPreviewCard card={card} key={card.id} />
          ))}
        </div>
      ) : null}
    </PageContainer>
  );
}

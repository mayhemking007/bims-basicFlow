import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrUpdateMindCard } from "../api/client";
import { StepEditor } from "../components/create/StepEditor";
import { CardShell } from "../components/ui/CardShell";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageContainer } from "../components/ui/PageContainer";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { useMindCardBuilder } from "../hooks/useMindCardBuilder";

export function CreateMindCardPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const builder = useMindCardBuilder();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // #region agent log
    fetch("http://127.0.0.1:7392/ingest/b9c9ffe7-2f95-4b3d-b6b2-9a76535be8af", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "27ac35",
      },
      body: JSON.stringify({
        sessionId: "27ac35",
        runId: "initial",
        hypothesisId: "H3",
        location: "frontend/src/pages/CreateMindCardPage.tsx:22",
        message: "create form submitted",
        data: {
          canSubmit: builder.canSubmit,
          titleLength: builder.state.title.trim().length,
          introLength: builder.state.intro.trim().length,
          stepCount: builder.state.steps.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!builder.canSubmit) {
      setSubmitError("Please fix the form errors before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSuccessMessage(null);
      await createOrUpdateMindCard(builder.payload);
      setSuccessMessage("MindCard saved. Returning to the wall...");
      window.setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7392/ingest/b9c9ffe7-2f95-4b3d-b6b2-9a76535be8af", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "27ac35",
        },
        body: JSON.stringify({
          sessionId: "27ac35",
          runId: "initial",
          hypothesisId: "H4",
          location: "frontend/src/pages/CreateMindCardPage.tsx:48",
          message: "create request failed",
          data: {
            errorName: error instanceof Error ? error.name : "unknown",
            errorMessage: error instanceof Error ? error.message : "unknown",
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setSubmitError(error instanceof Error ? error.message : "Unable to save MindCard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Create MindCard</h1>
        <Link className="text-sm text-slate-700 underline" to="/">
          Back to Wall
        </Link>
      </header>
      <CardShell>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="mindcard-title">
                Title
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
                id="mindcard-title"
                onChange={(event) => builder.setTitle(event.target.value)}
                placeholder="Give your MindCard a title"
                value={builder.state.title}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="mindcard-intro">
                Intro
              </label>
              <textarea
                className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
                id="mindcard-intro"
                onChange={(event) => builder.setIntro(event.target.value)}
                placeholder="Tell the player what this MindCard is about"
                value={builder.state.intro}
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Steps</h2>
                <p className="text-sm text-slate-600">
                  Add between {builder.minSteps} and {builder.maxSteps} steps.
                </p>
              </div>
              <SecondaryButton disabled={!builder.canAddStep || isSubmitting} onClick={builder.addStep} type="button">
                Add step
              </SecondaryButton>
            </div>

            {builder.state.steps.map((step, index) => (
              <StepEditor
                canRemove={builder.state.steps.length > builder.minSteps}
                index={index}
                key={step.clientId}
                maxMultipleChoiceOptions={builder.maxMultipleChoiceOptions}
                onAddOption={() => builder.addOption(step.clientId)}
                onAuthorAnswerOptionIndexChange={(value) =>
                  builder.setAuthorAnswerOptionIndex(step.clientId, value)
                }
                onAuthorAnswerTextChange={(value) => builder.setAuthorAnswerText(step.clientId, value)}
                onMoveDown={() => builder.moveStep(step.clientId, "down")}
                onMoveUp={() => builder.moveStep(step.clientId, "up")}
                onOptionChange={(optionIndex, text) => builder.updateOption(step.clientId, optionIndex, text)}
                onRemove={() => builder.removeStep(step.clientId)}
                onRemoveOption={(optionIndex) => builder.removeOption(step.clientId, optionIndex)}
                onResponseTypeChange={(responseType) => builder.setResponseType(step.clientId, responseType)}
                onTextChange={(text) => builder.updateStep(step.clientId, { text })}
                step={step}
                totalSteps={builder.state.steps.length}
              />
            ))}
          </section>

          {builder.validationErrors.length > 0 ? (
            <section className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-medium text-amber-900">Form checks</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800">
                {builder.validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {submitError ? <ErrorState message={submitError} /> : null}
          {isSubmitting ? <LoadingState label="Saving MindCard..." /> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton disabled={!builder.canSubmit || isSubmitting} type="submit">
              Save MindCard
            </PrimaryButton>
            <Link to="/">
              <SecondaryButton type="button">Cancel</SecondaryButton>
            </Link>
          </div>
        </form>
      </CardShell>
    </PageContainer>
  );
}

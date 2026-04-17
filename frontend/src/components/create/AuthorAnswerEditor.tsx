import type { BuilderStep } from "../../hooks/useMindCardBuilder";

interface AuthorAnswerEditorProps {
  step: BuilderStep;
  onOptionIndexChange: (value?: number) => void;
  onTextAnswerChange: (value: string) => void;
}

export function AuthorAnswerEditor({
  step,
  onOptionIndexChange,
  onTextAnswerChange,
}: AuthorAnswerEditorProps) {
  if (step.responseType === "TEXT") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor={`${step.clientId}-author-text`}>
          Author answer (optional)
        </label>
        <textarea
          className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
          id={`${step.clientId}-author-text`}
          onChange={(event) => onTextAnswerChange(event.target.value)}
          placeholder="Optional text answer"
          value={step.authorAnswer?.textAnswer ?? ""}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700" htmlFor={`${step.clientId}-author-option`}>
        Author answer (optional)
      </label>
      <select
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
        id={`${step.clientId}-author-option`}
        onChange={(event) =>
          onOptionIndexChange(event.target.value === "" ? undefined : Number(event.target.value))
        }
        value={step.authorAnswer?.optionIndex ?? ""}
      >
        <option value="">No author answer selected</option>
        {step.options.map((option, index) => (
          <option key={`${step.clientId}-author-answer-${index}`} value={index}>
            Option {index + 1}: {option.text || "(empty option)"}
          </option>
        ))}
      </select>
    </div>
  );
}

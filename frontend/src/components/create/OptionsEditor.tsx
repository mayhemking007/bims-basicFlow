import type { BuilderStep } from "../../hooks/useMindCardBuilder";
import { SecondaryButton } from "../ui/SecondaryButton";

interface OptionsEditorProps {
  step: BuilderStep;
  maxMultipleChoiceOptions: number;
  onOptionChange: (optionIndex: number, text: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
}

export function OptionsEditor({
  step,
  maxMultipleChoiceOptions,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: OptionsEditorProps) {
  if (step.responseType === "TEXT") {
    return null;
  }

  const isMultipleChoice = step.responseType === "MULTIPLE_CHOICE";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Options</p>
        {isMultipleChoice ? (
          <p className="text-xs text-slate-500">2 to {maxMultipleChoiceOptions} options</p>
        ) : (
          <p className="text-xs text-slate-500">Exactly 2 options</p>
        )}
      </div>

      {step.options.map((option, index) => (
        <div className="flex items-center gap-3" key={`${step.clientId}-option-${index}`}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
            onChange={(event) => onOptionChange(index, event.target.value)}
            placeholder={`Option ${index + 1}`}
            value={option.text}
          />
          {isMultipleChoice ? (
            <SecondaryButton
              disabled={step.options.length <= 2}
              onClick={() => onRemoveOption(index)}
              type="button"
            >
              Remove
            </SecondaryButton>
          ) : null}
        </div>
      ))}

      {isMultipleChoice ? (
        <SecondaryButton
          disabled={step.options.length >= maxMultipleChoiceOptions}
          onClick={onAddOption}
          type="button"
        >
          Add option
        </SecondaryButton>
      ) : null}
    </div>
  );
}

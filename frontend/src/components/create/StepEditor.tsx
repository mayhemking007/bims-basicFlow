import type { BuilderStep } from "../../hooks/useMindCardBuilder";
import type { ResponseType } from "../../types/mindcard";
import { SecondaryButton } from "../ui/SecondaryButton";
import { AuthorAnswerEditor } from "./AuthorAnswerEditor";
import { OptionsEditor } from "./OptionsEditor";

interface StepEditorProps {
  step: BuilderStep;
  index: number;
  totalSteps: number;
  canRemove: boolean;
  maxMultipleChoiceOptions: number;
  onTextChange: (text: string) => void;
  onResponseTypeChange: (responseType: ResponseType) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onOptionChange: (optionIndex: number, text: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
  onAuthorAnswerOptionIndexChange: (value?: number) => void;
  onAuthorAnswerTextChange: (value: string) => void;
}

export function StepEditor({
  step,
  index,
  totalSteps,
  canRemove,
  maxMultipleChoiceOptions,
  onTextChange,
  onResponseTypeChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onAuthorAnswerOptionIndexChange,
  onAuthorAnswerTextChange,
}: StepEditorProps) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Step {index + 1}</h2>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton disabled={index === 0} onClick={onMoveUp} type="button">
            Move up
          </SecondaryButton>
          <SecondaryButton disabled={index === totalSteps - 1} onClick={onMoveDown} type="button">
            Move down
          </SecondaryButton>
          <SecondaryButton disabled={!canRemove} onClick={onRemove} type="button">
            Remove
          </SecondaryButton>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor={`${step.clientId}-text`}>
          Step text
        </label>
        <textarea
          className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
          id={`${step.clientId}-text`}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="What do you want the player to answer?"
          value={step.text}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor={`${step.clientId}-type`}>
          Response type
        </label>
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800"
          id={`${step.clientId}-type`}
          onChange={(event) => onResponseTypeChange(event.target.value as ResponseType)}
          value={step.responseType}
        >
          <option value="TEXT">Text</option>
          <option value="MULTIPLE_CHOICE">Multiple choice</option>
          <option value="BINARY">Binary</option>
        </select>
      </div>

      <OptionsEditor
        maxMultipleChoiceOptions={maxMultipleChoiceOptions}
        onAddOption={onAddOption}
        onOptionChange={onOptionChange}
        onRemoveOption={onRemoveOption}
        step={step}
      />

      <AuthorAnswerEditor
        onOptionIndexChange={onAuthorAnswerOptionIndexChange}
        onTextAnswerChange={onAuthorAnswerTextChange}
        step={step}
      />
    </section>
  );
}

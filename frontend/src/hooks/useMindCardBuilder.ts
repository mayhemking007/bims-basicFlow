import { useMemo, useState } from "react";

import type { CreateMindCardPayload, ResponseType } from "../types/mindcard";

export interface BuilderOption {
  text: string;
}

export interface BuilderAuthorAnswer {
  optionIndex?: number;
  textAnswer?: string;
}

export interface BuilderStep {
  clientId: string;
  order: number;
  text: string;
  responseType: ResponseType;
  options: BuilderOption[];
  authorAnswer?: BuilderAuthorAnswer;
}

export interface MindCardBuilderState {
  title: string;
  intro: string;
  steps: BuilderStep[];
}

const MIN_STEPS = 3;
const MAX_STEPS = 5;
const MAX_MULTIPLE_CHOICE_OPTIONS = 4;

function createStep(responseType: ResponseType = "TEXT"): BuilderStep {
  const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const options =
    responseType === "BINARY"
      ? [{ text: "Yes" }, { text: "No" }]
      : responseType === "MULTIPLE_CHOICE"
        ? [{ text: "" }, { text: "" }]
        : [];

  return {
    clientId,
    order: 0,
    text: "",
    responseType,
    options,
  };
}

function normalizeSteps(steps: BuilderStep[]): BuilderStep[] {
  return steps.map((step, index) => {
    const normalizedOptions =
      step.responseType === "TEXT"
        ? []
        : step.responseType === "BINARY"
          ? [step.options[0] ?? { text: "Yes" }, step.options[1] ?? { text: "No" }]
          : step.options.slice(0, MAX_MULTIPLE_CHOICE_OPTIONS).length >= 2
            ? step.options.slice(0, MAX_MULTIPLE_CHOICE_OPTIONS)
            : [...step.options.slice(0, MAX_MULTIPLE_CHOICE_OPTIONS), { text: "" }, { text: "" }].slice(0, 2);

    const maxAuthorIndex = normalizedOptions.length - 1;
    const optionIndex =
      step.authorAnswer?.optionIndex !== undefined &&
      step.authorAnswer.optionIndex >= 0 &&
      step.authorAnswer.optionIndex <= maxAuthorIndex
        ? step.authorAnswer.optionIndex
        : undefined;

    const authorAnswer =
      step.responseType === "TEXT"
        ? step.authorAnswer?.textAnswer
          ? { textAnswer: step.authorAnswer.textAnswer }
          : undefined
        : optionIndex !== undefined
          ? { optionIndex }
          : undefined;

    return {
      ...step,
      order: index + 1,
      options: normalizedOptions,
      authorAnswer,
    };
  });
}

function createInitialState(): MindCardBuilderState {
  return {
    title: "",
    intro: "",
    steps: normalizeSteps([createStep("TEXT"), createStep("TEXT"), createStep("TEXT")]),
  };
}

export function useMindCardBuilder() {
  const [state, setState] = useState<MindCardBuilderState>(createInitialState);

  const setTitle = (title: string) => {
    setState((current) => ({ ...current, title }));
  };

  const setIntro = (intro: string) => {
    setState((current) => ({ ...current, intro }));
  };

  const updateStep = (clientId: string, patch: Partial<Pick<BuilderStep, "text">>) => {
    setState((current) => ({
      ...current,
      steps: current.steps.map((step) => (step.clientId === clientId ? { ...step, ...patch } : step)),
    }));
  };

  const setResponseType = (clientId: string, responseType: ResponseType) => {
    setState((current) => ({
      ...current,
      steps: normalizeSteps(
        current.steps.map((step) =>
          step.clientId === clientId
            ? {
                ...step,
                responseType,
                options:
                  responseType === "TEXT"
                    ? []
                    : responseType === "BINARY"
                      ? [step.options[0] ?? { text: "Yes" }, step.options[1] ?? { text: "No" }]
                      : step.options.length >= 2
                        ? step.options.slice(0, MAX_MULTIPLE_CHOICE_OPTIONS)
                        : [{ text: "" }, { text: "" }],
                authorAnswer: undefined,
              }
            : step,
        ),
      ),
    }));
  };

  const addStep = () => {
    setState((current) => {
      if (current.steps.length >= MAX_STEPS) {
        return current;
      }

      return {
        ...current,
        steps: normalizeSteps([...current.steps, createStep("TEXT")]),
      };
    });
  };

  const removeStep = (clientId: string) => {
    setState((current) => {
      if (current.steps.length <= MIN_STEPS) {
        return current;
      }

      return {
        ...current,
        steps: normalizeSteps(current.steps.filter((step) => step.clientId !== clientId)),
      };
    });
  };

  const moveStep = (clientId: string, direction: "up" | "down") => {
    setState((current) => {
      const index = current.steps.findIndex((step) => step.clientId === clientId);
      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.steps.length) {
        return current;
      }

      const nextSteps = [...current.steps];
      [nextSteps[index], nextSteps[targetIndex]] = [nextSteps[targetIndex], nextSteps[index]];

      return {
        ...current,
        steps: normalizeSteps(nextSteps),
      };
    });
  };

  const addOption = (clientId: string) => {
    setState((current) => ({
      ...current,
      steps: normalizeSteps(
        current.steps.map((step) => {
          if (step.clientId !== clientId || step.responseType !== "MULTIPLE_CHOICE") {
            return step;
          }

          if (step.options.length >= MAX_MULTIPLE_CHOICE_OPTIONS) {
            return step;
          }

          return {
            ...step,
            options: [...step.options, { text: "" }],
          };
        }),
      ),
    }));
  };

  const removeOption = (clientId: string, optionIndex: number) => {
    setState((current) => ({
      ...current,
      steps: normalizeSteps(
        current.steps.map((step) => {
          if (step.clientId !== clientId || step.responseType !== "MULTIPLE_CHOICE") {
            return step;
          }

          if (step.options.length <= 2) {
            return step;
          }

          return {
            ...step,
            options: step.options.filter((_, index) => index !== optionIndex),
          };
        }),
      ),
    }));
  };

  const updateOption = (clientId: string, optionIndex: number, text: string) => {
    setState((current) => ({
      ...current,
      steps: current.steps.map((step) => {
        if (step.clientId !== clientId) {
          return step;
        }

        return {
          ...step,
          options: step.options.map((option, index) => (index === optionIndex ? { text } : option)),
        };
      }),
    }));
  };

  const setAuthorAnswerOptionIndex = (clientId: string, optionIndex?: number) => {
    setState((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.clientId === clientId
          ? {
              ...step,
              authorAnswer: optionIndex === undefined ? undefined : { optionIndex },
            }
          : step,
      ),
    }));
  };

  const setAuthorAnswerText = (clientId: string, textAnswer: string) => {
    setState((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.clientId === clientId
          ? {
              ...step,
              authorAnswer: textAnswer.trim() ? { textAnswer } : undefined,
            }
          : step,
      ),
    }));
  };

  const payload = useMemo<CreateMindCardPayload>(
    () => ({
      title: state.title.trim(),
      intro: state.intro.trim(),
      steps: state.steps.map((step) => ({
        text: step.text.trim(),
        responseType: step.responseType,
        options:
          step.responseType === "TEXT"
            ? undefined
            : step.options.map((option) => ({ text: option.text.trim() })),
        authorAnswer:
          step.responseType === "TEXT"
            ? step.authorAnswer?.textAnswer?.trim()
              ? { textAnswer: step.authorAnswer.textAnswer.trim() }
              : undefined
            : step.authorAnswer?.optionIndex !== undefined
              ? { optionIndex: step.authorAnswer.optionIndex }
              : undefined,
      })),
    }),
    [state],
  );

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!state.title.trim()) {
      errors.push("Title is required.");
    }

    if (!state.intro.trim()) {
      errors.push("Intro is required.");
    }

    if (state.steps.length < MIN_STEPS || state.steps.length > MAX_STEPS) {
      errors.push("MindCards must contain between 3 and 5 steps.");
    }

    state.steps.forEach((step, index) => {
      if (!step.text.trim()) {
        errors.push(`Step ${index + 1} needs question text.`);
      }

      if (step.responseType === "MULTIPLE_CHOICE") {
        if (step.options.length < 2 || step.options.length > MAX_MULTIPLE_CHOICE_OPTIONS) {
          errors.push(`Step ${index + 1} must have 2 to 4 options.`);
        }
      }

      if (step.responseType === "BINARY" && step.options.length !== 2) {
        errors.push(`Step ${index + 1} must have exactly 2 options.`);
      }

      if (step.responseType !== "TEXT") {
        step.options.forEach((option, optionIndex) => {
          if (!option.text.trim()) {
            errors.push(`Step ${index + 1}, option ${optionIndex + 1} cannot be empty.`);
          }
        });
      }
    });

    return errors;
  }, [state]);

  return {
    state,
    payload,
    minSteps: MIN_STEPS,
    maxSteps: MAX_STEPS,
    maxMultipleChoiceOptions: MAX_MULTIPLE_CHOICE_OPTIONS,
    canAddStep: state.steps.length < MAX_STEPS,
    canSubmit: validationErrors.length === 0,
    validationErrors,
    setTitle,
    setIntro,
    updateStep,
    setResponseType,
    addStep,
    removeStep,
    moveStep,
    addOption,
    removeOption,
    updateOption,
    setAuthorAnswerOptionIndex,
    setAuthorAnswerText,
  };
}

export type ResponseType = "MULTIPLE_CHOICE" | "BINARY" | "TEXT";

export interface UserSummary {
  id: string;
  username: string;
}

export interface OptionDto {
  id: string;
  stepId: string;
  text: string;
  order: number;
}

export interface AuthorAnswerDto {
  id: string;
  stepId: string;
  optionId: string | null;
  textAnswer: string | null;
}

export interface StepDetailDto {
  id: string;
  mindCardId: string;
  order: number;
  text: string;
  responseType: ResponseType;
  options: OptionDto[];
  authorAnswer: AuthorAnswerDto | null;
}

export interface MindCardSummaryDto {
  id: string;
  title: string;
  intro: string;
  createdAt: string;
  user: UserSummary;
  stepsCount: number;
}

export interface MindCardDetailDto {
  id: string;
  userId: string;
  title: string;
  intro: string;
  createdAt: string;
  user: UserSummary;
  steps: StepDetailDto[];
}

export interface CreateMindCardPayload {
  title: string;
  intro: string;
  steps: Array<{
    text: string;
    responseType: ResponseType;
    options?: Array<{ text: string }>;
    authorAnswer?: {
      optionIndex?: number;
      textAnswer?: string;
    };
  }>;
}

export interface SaveResponsePayload {
  mindCardId: string;
  stepId: string;
  optionId?: string;
  textAnswer?: string;
}

export interface UserResponseDto {
  id: string;
  userId: string;
  mindCardId: string;
  stepId: string;
  optionId: string | null;
  textAnswer: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendInterestPayload {
  mindCardId: string;
}

export interface InterestDto {
  id: string;
  fromUserId: string;
  mindCardId: string;
  createdAt: string;
}

import type {
  CreateMindCardPayload,
  InterestDto,
  MindCardDetailDto,
  MindCardSummaryDto,
  SaveResponsePayload,
  SendInterestPayload,
  UserResponseDto,
} from "../types/mindcard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const MVP_USER_ID = import.meta.env.VITE_MVP_USER_ID ?? "mvp-user-1";

// #region agent log
fetch("http://127.0.0.1:7392/ingest/b9c9ffe7-2f95-4b3d-b6b2-9a76535be8af", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "27ac35",
  },
  body: JSON.stringify({
    sessionId: "27ac35",
    runId: "user-not-found",
    hypothesisId: "H4",
    location: "frontend/src/api/client.ts:14",
    message: "api client configured",
    data: {
      apiBaseUrl: API_BASE_URL,
      mvpUserId: MVP_USER_ID,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

class ApiClientError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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
      hypothesisId: "H2",
      location: "frontend/src/api/client.ts:27",
      message: "api request started",
      data: {
        apiBaseUrl: API_BASE_URL,
        path,
        method: init?.method ?? "GET",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": MVP_USER_ID,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string; details?: unknown }
      | null;
    throw new ApiClientError(
      response.status,
      errorBody?.message ?? "Request failed",
      errorBody?.details,
    );
  }

  return (await response.json()) as T;
}

export function createOrUpdateMindCard(payload: CreateMindCardPayload): Promise<MindCardDetailDto> {
  return request<MindCardDetailDto>("/api/mindcard", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMindCards(): Promise<MindCardSummaryDto[]> {
  return request<MindCardSummaryDto[]>("/api/mindcards");
}

export function getMindCardById(id: string): Promise<MindCardDetailDto> {
  return request<MindCardDetailDto>(`/api/mindcard/${id}`);
}

export function saveResponse(payload: SaveResponsePayload): Promise<UserResponseDto> {
  return request<UserResponseDto>("/api/response", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getResponses(mindCardId: string): Promise<UserResponseDto[]> {
  return request<UserResponseDto[]>(`/api/responses/${mindCardId}`);
}

export function sendInterest(payload: SendInterestPayload): Promise<InterestDto> {
  return request<InterestDto>("/api/interest", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

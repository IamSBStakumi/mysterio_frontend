import { components } from "./api.d";

export type Difficulty = components["schemas"]["CreateSessionRequest"]["difficulty"];
export type PhaseType = components["schemas"]["PhaseInfo"]["phaseType"];

export type CreateSessionRequest = components["schemas"]["CreateSessionRequest"];
export type CreateSessionResponse = components["schemas"]["CreateSessionResponse"];
export type PhaseInfo = components["schemas"]["PhaseInfo"];
export type PhaseResponse = components["schemas"]["PhaseResponse"];
export type VoteRequest = components["schemas"]["VoteRequest"];
export type ResultResponse = components["schemas"]["ResultResponse"];
export type SuccessResponse = components["schemas"]["SuccessResponse"];
export type ErrorResponse = components["schemas"]["ErrorResponse"];

// カスタムエラー型
export interface ApiError {
  message: string;
  code?: string;
}

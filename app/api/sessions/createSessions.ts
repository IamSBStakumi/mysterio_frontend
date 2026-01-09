import { CreateSessionRequest, CreateSessionResponse } from "@/types/mysterio";
import { BACKEND_URL } from "@/utils/defineTargetUrl";

export async function createSession(data: CreateSessionRequest): Promise<CreateSessionResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  return response.json() as Promise<CreateSessionResponse>;
}

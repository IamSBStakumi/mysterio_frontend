import { VoteRequest, SuccessResponse } from "@/types/mysterio";

async function vote(sessionId: string, playerId: string, data: VoteRequest): Promise<SuccessResponse> {
  const response = await fetch(`/sessions/${sessionId}/vote`, {
    method: "POST",
    headers: {
      "X-Player-Id": playerId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("投票に失敗しました");
  }

  return await response.json();
}

export default vote;

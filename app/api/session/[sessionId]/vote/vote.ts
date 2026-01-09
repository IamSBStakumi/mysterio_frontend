import { SuccessResponse } from "@/types/mysterio";
import { BACKEND_URL } from "@/utils/defineTargetUrl";

async function vote(sessionId: string, playerId: string, targetPlayerId: string): Promise<SuccessResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/sessions/${sessionId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Player-Id": playerId,
    },
    body: JSON.stringify({
      targetPlayerId: targetPlayerId,
    }),
  });

  if (!response.ok) {
    throw new Error("投票に失敗しました");
  }

  return await response.json();
}

export default vote;

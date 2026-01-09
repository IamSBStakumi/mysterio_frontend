import { SuccessResponse } from "@/types/mysterio";
import { BACKEND_URL } from "@/utils/defineTargetUrl";

async function advancePhase(sessionId: string, playerId: string): Promise<SuccessResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/sessions/${sessionId}/phase/advance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Player-Id": playerId,
    },
  });

  if (!response.ok) {
    throw new Error("フェーズの進行に失敗しました");
  }

  return await response.json();
}

export default advancePhase;

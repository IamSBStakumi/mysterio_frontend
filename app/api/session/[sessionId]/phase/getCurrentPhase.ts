import { BACKEND_URL } from "@/utils/defineTargetUrl";

const getCurrentPhase = async (sessionId: string, playerId: string) => {
  const response = await fetch(`${BACKEND_URL}/api/v1/sessions/${sessionId}/phase`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-player-id": playerId,
    },
  });

  if (!response.ok) {
    throw new Error("現在のフェーズ取得に失敗しました");
  }

  return await response.json();
};

export default getCurrentPhase;

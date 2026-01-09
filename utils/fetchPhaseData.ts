const fetchPhaseData = async (sessionId: string, playerId: string) => {
  try {
    const response = await fetch(`/api/session/${sessionId}/phase`, {
      headers: {
        "Content-Type": "application/json",
        "x-player-id": playerId,
      },
    });

    const phaseData = await response.json();

    return phaseData;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "フェーズ情報の取得に失敗しました");
  }
};

export default fetchPhaseData;

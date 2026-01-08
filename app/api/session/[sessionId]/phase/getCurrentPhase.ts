const getCurrentPhase = async (sessionId: string, playerId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sessions/${sessionId}/phase`, {
    headers: {
      "Content-Type": "application/json",
      "x-player-id": playerId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch phase");
  }

  return await response.json();
};

export default getCurrentPhase;

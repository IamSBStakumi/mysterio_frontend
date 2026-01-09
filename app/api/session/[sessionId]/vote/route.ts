import { NextRequest, NextResponse } from "next/server";
import vote from "./vote";

export async function POST(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;
    const playerId = request.headers.get("x-player-id");

    if (!playerId) {
      return NextResponse.json({ message: "Player ID is required" }, { status: 400 });
    }
    const body = await request.json();

    console.log(body);

    const result = await vote(sessionId, playerId, body.targetPlayerId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error voting:", error);

    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to vote" }, { status: 500 });
  }
}

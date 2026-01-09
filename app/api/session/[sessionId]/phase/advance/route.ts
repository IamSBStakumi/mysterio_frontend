import { NextRequest, NextResponse } from "next/server";
import advancePhase from "./advancePhase";

export async function POST(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;
    const playerId = request.headers.get("x-player-id");

    if (!playerId) {
      return NextResponse.json({ message: "Player ID is required" }, { status: 400 });
    }

    const result = await advancePhase(sessionId, playerId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error advancing phase:", error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to advance phase" },
      { status: 500 }
    );
  }
}

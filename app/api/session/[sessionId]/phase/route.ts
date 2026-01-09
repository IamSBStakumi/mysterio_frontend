import { NextRequest, NextResponse } from "next/server";
import getPhase from "./getCurrentPhase";

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;
    const playerId = request.headers.get("x-player-id");

    if (!playerId) {
      return NextResponse.json({ message: "Player ID is required" }, { status: 400 });
    }

    const response = await getPhase(sessionId, playerId);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching phase:", error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch phase" },
      { status: 500 }
    );
  }
}

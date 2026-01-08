import { NextRequest, NextResponse } from "next/server";
import { CreateSessionRequest } from "@/types/mysterio";
import { createSession } from "./createSessions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerCount, difficulty } = body as CreateSessionRequest;

    // validation
    if (!playerCount || body.playerCount < 3 || body.playerCount > 5) {
      return NextResponse.json({ message: "プレイヤー人数は3~5人で指定してください" }, { status: 400 });
    }

    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
      return NextResponse.json({ message: "無効な難易度が指定されています" }, { status: 400 });
    }

    const response = await createSession({ playerCount, difficulty });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

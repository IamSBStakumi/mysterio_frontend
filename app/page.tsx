"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Difficulty } from "@/types/mysterio";
import { saveSessionData } from "@/utils/session-storage";
import GameTitle from "./components/GameTitle";
import PlayerCountInput from "./components/settings/PlayerCountInput";
import DifficultyInput from "./components/settings/DifficultyInput";
import SessionCreateButton from "./components/settings/SessionCreateButton";

export default function HomePage() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerCount,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("セッションの作成に失敗しました");
      }

      const sessionData = await response.json();

      saveSessionData({
        sessionId: sessionData.sessionId,
        playerId: sessionData.ownerPlayerId,
        isOwner: true,
        playerIds: sessionData.playerIds,
      });

      // セッション作成成功後、セッション管理画面へ遷移
      // ownerPlayerIdをクエリパラメータで渡す
      router.push(`/session/${sessionData.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "セッションの作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8">
      <GameTitle />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PlayerCountInput playerCount={playerCount} setPlayerCount={setPlayerCount} isLoading={isLoading} />

        <DifficultyInput difficulty={difficulty} setDifficulty={setDifficulty} isLoading={isLoading} />

        {/* エラーメッセージ */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <SessionCreateButton isLoading={isLoading} />
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-500 text-xs">※ シナリオの生成には数十秒かかる場合があります</p>
      </div>
    </div>
  );
}

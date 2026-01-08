"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Difficulty } from "@/types/mysterio";
import { saveSessionData } from "@/utils/session-storage";

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

  const getDifficultyLabel = (diff: Difficulty): string => {
    switch (diff) {
      case "easy":
        return "簡単（30分程度）";
      case "medium":
        return "普通（60分程度）";
      case "hard":
        return "難しい（120分程度）";
      default:
        return diff;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Mysterio
          </h1>
          <p className="text-slate-400 text-sm">AIが生成するマーダーミステリー</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* プレイヤー人数選択 */}
          <div>
            <label htmlFor="playerCount" className="block text-sm font-medium text-slate-300 mb-2">
              プレイヤー人数
            </label>
            <select
              id="playerCount"
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer"
              disabled={isLoading}
            >
              {[3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}人
                </option>
              ))}
            </select>
          </div>

          {/* 難易度選択 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">難易度</label>
            <div className="space-y-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <label
                  key={diff}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                    difficulty === diff
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-slate-600 bg-slate-700 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff}
                    checked={difficulty === diff}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <span className="text-white font-medium">{getDifficultyLabel(diff)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                シナリオを生成中...
              </span>
            ) : (
              "セッションを作成"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">※ シナリオの生成には数十秒かかる場合があります</p>
        </div>
      </div>
    </div>
  );
}

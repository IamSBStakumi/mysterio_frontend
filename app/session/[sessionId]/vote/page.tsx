"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSessionData } from "@/utils/session-storage";
import { PhaseResponse } from "@/types/mysterio";

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [sessionData, setSessionData] = useState<ReturnType<typeof getSessionData>>(null);
  const [phaseData, setPhaseData] = useState<PhaseResponse | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // セッションデータとフェーズデータの取得
  useEffect(() => {
    const data = getSessionData(sessionId);

    if (!data) {
      setError("セッション情報が見つかりません");
      setIsLoading(false);
      return;
    }

    setSessionData(data);

    const fetchPhaseData = async () => {
      try {
        const response = await fetch(`/api/session/${sessionId}/phase`, {
          headers: {
            "Content-Type": "application/json",
            "x-player-id": data.playerId,
          },
        });
        setPhaseData(await response.json());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "フェーズ情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhaseData();
  }, [sessionId, router]);

  // 投票処理
  const handleVote = async () => {
    if (!sessionData || !selectedPlayerId) return;

    // 自分自身への投票を防ぐ
    if (selectedPlayerId === sessionData.playerId) {
      setError("自分自身には投票できません");
      return;
    }

    setIsVoting(true);
    setError(null);

    try {
      await fetch(`/api/session/${sessionId}/vote`, {
        method: "POST",
        body: JSON.stringify({
          targetPlayerId: selectedPlayerId,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-player-id": sessionData.playerId,
        },
      });

      setHasVoted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "投票に失敗しました");
    } finally {
      setIsVoting(false);
    }
  };

  // セッション画面に戻る
  const handleBackToSession = () => {
    router.push(`/session/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error && !phaseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">エラー</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={handleBackToSession}
            className="w-full py-3 px-6 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition"
          >
            セッション画面へ戻る
          </button>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">投票完了</h2>
            <p className="text-slate-300">投票が正常に記録されました</p>
          </div>

          <button
            onClick={handleBackToSession}
            className="w-full py-3 px-6 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition"
          >
            セッション画面へ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* ヘッダー */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            投票フェーズ
          </h1>
          <p className="text-slate-400 text-sm">犯人だと思うプレイヤーに投票してください</p>
        </div>

        {/* フェーズ情報 */}
        {phaseData && (
          <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">投票の説明</h2>
            <p className="text-slate-300 mb-4">{phaseData.description}</p>

            {phaseData.publicText && (
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-300 whitespace-pre-wrap">{phaseData.publicText}</p>
              </div>
            )}
          </div>
        )}

        {/* 投票フォーム */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">犯人を選択</h2>

          <div className="space-y-3 mb-6">
            {sessionData?.playerIds
              .filter((id) => id !== sessionData.playerId)
              .map((playerId, index) => (
                <label
                  key={playerId}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedPlayerId === playerId
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-slate-600 bg-slate-700 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="suspect"
                    value={playerId}
                    checked={selectedPlayerId === playerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className="w-5 h-5 text-purple-500 focus:ring-purple-500 focus:ring-2"
                    disabled={isVoting}
                  />
                  <span className="ml-3 text-white font-medium">プレイヤー {index + 1}</span>
                </label>
              ))}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* 投票ボタン */}
          <button
            onClick={handleVote}
            disabled={!selectedPlayerId || isVoting}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
          >
            {isVoting ? "投票中..." : "投票する"}
          </button>
        </div>

        {/* 戻るボタン */}
        <button
          onClick={handleBackToSession}
          className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
        >
          セッション画面へ戻る
        </button>

        {/* 注意事項 */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">※ 投票は一度だけ可能です。慎重に選択してください</p>
        </div>
      </div>
    </div>
  );
}

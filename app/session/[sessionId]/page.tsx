"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSessionData } from "@/utils/session-storage";
import { PhaseResponse } from "@/types/mysterio";
import QRCode from "qrcode";
import Header from "./Header";
import ErrorView from "./ErrorView";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [sessionData, setSessionData] = useState<ReturnType<typeof getSessionData>>(null);
  const [phaseData, setPhaseData] = useState<PhaseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [showPlayerLinks, setShowPlayerLinks] = useState(false);

  // セッションデータの取得
  useEffect(() => {
    const data = getSessionData(sessionId);

    if (!data) {
      setError("セッション情報が見つかりません");
      setIsLoading(false);
      return;
    }

    setSessionData(data);
  }, [sessionId]);

  // フェーズデータの取得
  useEffect(() => {
    if (!sessionData) return;

    const fetchPhaseData = async () => {
      try {
        const response = await fetch(`/api/session/${sessionId}/phase`, {
          headers: {
            "Content-Type": "application/json",
            "x-player-id": sessionData.playerId,
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
  }, [sessionId, sessionData]);

  // QRコード生成
  useEffect(() => {
    if (!sessionData || !sessionData.isOwner) return;

    const generateQRCodes = async () => {
      const codes: Record<string, string> = {};
      const baseUrl = window.location.origin;

      for (const playerId of sessionData.playerIds) {
        const url = `${baseUrl}/player/${sessionId}/${playerId}`;
        try {
          const qrDataUrl = await QRCode.toDataURL(url, {
            width: 200,
            margin: 2,
          });
          codes[playerId] = qrDataUrl;
        } catch (err) {
          console.error("QRコード生成エラー:", err);
        }
      }

      setQrCodes(codes);
    };

    generateQRCodes();
  }, [sessionData, sessionId]);

  // フェーズを進める
  const handleAdvancePhase = async () => {
    if (!sessionData) return;

    setIsAdvancing(true);
    setError(null);

    try {
      await fetch(`/api/session/${sessionId}/phase/advance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-player-id": sessionData.playerId,
        },
      });

      // フェーズデータを再取得
      const response = await fetch(`/api/session/${sessionId}/phase`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-player-id": sessionData.playerId,
        },
      });
      setPhaseData(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "フェーズの進行に失敗しました");
    } finally {
      setIsAdvancing(false);
    }
  };

  // 結果画面へ遷移
  const handleViewResult = () => {
    router.push(`/session/${sessionId}/result`);
  };

  // 投票画面へ遷移
  const handleGoToVote = () => {
    router.push(`/session/${sessionId}/vote`);
  };

  const getPhaseTypeLabel = (phaseType: string): string => {
    switch (phaseType) {
      case "introduction":
        return "導入フェーズ";
      case "investigation":
        return "調査フェーズ";
      case "discussion":
        return "議論フェーズ";
      case "voting":
        return "投票フェーズ";
      case "reveal":
        return "結果発表";
      default:
        return phaseType;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error && !phaseData) {
    return <ErrorView error={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Header sessionId={sessionId} isOwner={sessionData?.isOwner} />

      {/* プレイヤーリンク配布（オーナーのみ） */}
      {sessionData?.isOwner && (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">プレイヤー招待</h2>
          <p className="text-slate-400 text-sm mb-4">各プレイヤーに以下のリンクまたはQRコードを共有してください</p>

          <button
            onClick={() => setShowPlayerLinks(!showPlayerLinks)}
            className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition mb-4"
          >
            {showPlayerLinks ? "リンクを非表示" : "リンクを表示"}
          </button>

          {showPlayerLinks && (
            <div className="space-y-4">
              {sessionData.playerIds.map((playerId, index) => {
                const playerUrl = `${window.location.origin}/player/${sessionId}/${playerId}`;
                return (
                  <div key={playerId} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-400 font-semibold">プレイヤー {index + 1}</span>
                      <button
                        onClick={() => copyToClipboard(playerUrl)}
                        className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
                      >
                        コピー
                      </button>
                    </div>
                    <div className="text-slate-300 text-sm break-all mb-3">{playerUrl}</div>
                    {qrCodes[playerId] && (
                      <div className="flex justify-center">
                        <img src={qrCodes[playerId]} alt={`QR code for player ${index + 1}`} className="rounded" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* フェーズ情報 */}
      {phaseData && (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{getPhaseTypeLabel(phaseData.phaseType)}</h2>
            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full">
              Phase {phaseData.phaseNumber + 1}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">説明</h3>
            <p className="text-slate-300">{phaseData.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">公開情報</h3>
            <div className="bg-slate-700 rounded-lg p-4 text-slate-300 whitespace-pre-wrap">{phaseData.publicText}</div>
          </div>

          {/* {phaseData.privateText && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-pink-400 mb-2">あなただけの情報</h3>
              <div className="bg-slate-700 rounded-lg p-4 text-slate-300 whitespace-pre-wrap border-2 border-pink-500/30">
                {phaseData.privateText}
              </div>
            </div>
          )} */}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* アクションボタン */}
      {sessionData?.isOwner && phaseData && (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6">
          {phaseData.availableActions.includes("advance_phase") ? (
            <button
              onClick={handleAdvancePhase}
              disabled={isAdvancing}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isAdvancing ? "進行中..." : "次のフェーズへ進む"}
            </button>
          ) : (
            <button
              onClick={handleGoToVote}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              投票する
            </button>
          )}

          {phaseData.phaseType === "reveal" && (
            <button
              onClick={handleViewResult}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              結果を表示
            </button>
          )}
        </div>
      )}

      {/* 非オーナー向けメッセージ */}
      {!sessionData?.isOwner && (
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6">
          <p className="text-slate-300 text-center">オーナーがフェーズを進めるのを待ちましょう</p>
        </div>
      )}
    </div>
  );
}

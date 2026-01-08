// セッション情報のlocalStorage管理

export interface StoredSessionData {
  sessionId: string;
  playerId: string;
  isOwner: boolean;
  playerIds: string[];
}

/**
 * セッション情報をlocalStorageに保存
 */
export function saveSessionData(data: StoredSessionData): void {
  if (typeof window === "undefined") return;

  const key = `session_${data.sessionId}`;
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * セッション情報をlocalStorageから取得
 */
export function getSessionData(sessionId: string): StoredSessionData | null {
  if (typeof window === "undefined") return null;

  const key = `session_${sessionId}`;
  const data = localStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data) as StoredSessionData;
  } catch {
    return null;
  }
}

/**
 * プレイヤー情報を保存（他のプレイヤーがアクセスする場合）
 * オーナーではないので isOwner: false
 */
export function savePlayerData(sessionId: string, playerId: string, playerIds: string[]): void {
  const data: StoredSessionData = {
    sessionId,
    playerId,
    isOwner: false,
    playerIds,
  };
  saveSessionData(data);
}

/**
 * セッション情報を削除
 */
export function clearSessionData(sessionId: string): void {
  if (typeof window === "undefined") return;

  const key = `session_${sessionId}`;
  localStorage.removeItem(key);
}

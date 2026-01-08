import { Dispatch, SetStateAction } from "react";

type Props = {
  playerCount: number;
  setPlayerCount: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
};

const PlayerCountInput = ({ playerCount, setPlayerCount, isLoading }: Props) => {
  return (
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
  );
};

export default PlayerCountInput;

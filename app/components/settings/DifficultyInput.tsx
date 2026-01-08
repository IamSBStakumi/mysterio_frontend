import { Difficulty } from "@/types/mysterio";
import { Dispatch, SetStateAction } from "react";

type Props = {
  difficulty: Difficulty;
  setDifficulty: Dispatch<SetStateAction<Difficulty>>;
  isLoading: boolean;
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

const DifficultyInput = ({ difficulty, setDifficulty, isLoading }: Props) => {
  return (
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
  );
};

export default DifficultyInput;

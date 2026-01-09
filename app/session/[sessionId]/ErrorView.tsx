import { useRouter } from "next/navigation";

const ErrorView = ({ error }: { error: string }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-red-400 mb-4">エラー</h2>
        <p className="text-slate-300 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 px-6 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition"
        >
          トップページへ戻る
        </button>
      </div>
    </div>
  );
};

export default ErrorView;

type HeaderProps = {
  sessionId: string;
  isOwner: boolean | undefined;
};

const Header = ({ sessionId, isOwner }: HeaderProps) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Mysterio
        </h1>
        {isOwner && (
          <span className="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">オーナー</span>
        )}
      </div>
      <p className="text-slate-400 text-sm">Session ID: {sessionId}</p>
    </div>
  );
};

export default Header;

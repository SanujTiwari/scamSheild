import { Search, ShieldOff } from "lucide-react";

function EmptyState({ title, description, actionLabel, onAction, isSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#080C13] border border-white/10 flex items-center justify-center mb-6 shadow-lg">
        {isSearch ? (
          <Search className="w-10 h-10 text-indigo-400" />
        ) : (
          <ShieldOff className="w-10 h-10 text-violet-400" />
        )}
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-[#94A3B8] text-[14px] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-mono text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

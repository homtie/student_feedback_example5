import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  const iconName = isError ? 'error' : isWarning ? 'warning' : isInfo ? 'info' : 'check_circle';
  const iconColor = isError ? 'text-[#ff6b6b]' : isWarning ? 'text-[#ffb74d]' : isInfo ? 'text-[#ab8ffe]' : 'text-[#4ade80]';

  return (
    <div
      id="app-toast"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border max-w-md animate-slideUp ${
        isError
          ? 'bg-[#2b0c14] text-white border-[#ff6b6b]/40 ring-1 ring-[#ff6b6b]/30'
          : isWarning
          ? 'bg-[#261d08] text-white border-[#ffb74d]/40 ring-1 ring-[#ffb74d]/30'
          : 'bg-[#181445] text-white border-white/10'
      }`}
    >
      <span className={`material-symbols-outlined mt-0.5 text-[22px] shrink-0 ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {iconName}
      </span>
      <div className="flex-1 pr-2">
        <h4 className="font-epilogue font-bold text-sm text-white leading-snug">{toast.title}</h4>
        {toast.description && (
          <p className="font-manrope text-xs text-white/80 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={dismissToast}
        className="text-white/60 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};

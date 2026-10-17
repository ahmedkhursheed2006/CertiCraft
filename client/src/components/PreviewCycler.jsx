import React from 'react';
import { ChevronLeft, ChevronRight, UserCheck, Eye, EyeOff } from 'lucide-react';

export default function PreviewCycler({
  records,
  currentIndex,
  onIndexChange,
  isPreviewActive,
  onTogglePreview
}) {
  if (!records || records.length === 0) return null;

  const currentRecord = records[currentIndex] || {};
  const recipientName = currentRecord.Full_Name || currentRecord.Name || currentRecord['Participant Name'] || Object.values(currentRecord)[0] || 'Unknown';

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-5 py-2.5 shadow-2xl flex items-center gap-4 z-20 select-none">
      {/* Live Preview Toggle */}
      <button
        onClick={onTogglePreview}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
          isPreviewActive
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
        }`}
      >
        {isPreviewActive ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>{isPreviewActive ? 'Live Data Mode' : 'Template Tags Mode'}</span>
      </button>

      {isPreviewActive && (
        <>
          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentIndex <= 0}
              onClick={() => onIndexChange(currentIndex - 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition"
              title="Previous Record"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center min-w-[200px]">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-200">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate max-w-[180px] font-semibold">{recipientName}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Record {currentIndex + 1} of {records.length}
              </p>
            </div>

            <button
              disabled={currentIndex >= records.length - 1}
              onClick={() => onIndexChange(currentIndex + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition"
              title="Next Record"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

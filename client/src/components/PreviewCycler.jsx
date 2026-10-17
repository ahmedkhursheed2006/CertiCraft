import React from 'react';
import { ChevronLeft, ChevronRight, UserPlus, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function PreviewCycler({
  records,
  currentIndex,
  onIndexChange,
  isPreviewActive,
  onTogglePreview,
  onOpenManualAddModal,
  onDeleteCurrentRecord
}) {
  if (!records || records.length === 0) return null;

  const total = records.length;
  const currentRecord = records[currentIndex] || {};
  const recipientName =
    currentRecord.Full_Name ||
    currentRecord.Name ||
    currentRecord['Participant Name'] ||
    Object.values(currentRecord)[0] ||
    'Unknown';

  // Seamless Circular / Infinite Looping in both directions
  const handlePrev = () => {
    if (total <= 1) return;
    const prevIndex = (currentIndex - 1 + total) % total;
    onIndexChange(prevIndex);
  };

  const handleNext = () => {
    if (total <= 1) return;
    const nextIndex = (currentIndex + 1) % total;
    onIndexChange(nextIndex);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0c0d0e]/95 backdrop-blur-md border border-neutral-800 rounded-full px-4 py-1.5 shadow-2xl flex items-center gap-3 z-20 select-none">
      {/* Toggle View Mode */}
      <button
        type="button"
        onClick={onTogglePreview}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
          isPreviewActive
            ? 'bg-neutral-800 text-white'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        {isPreviewActive ? <Eye className="w-3 h-3 text-neutral-300" /> : <EyeOff className="w-3 h-3" />}
        <span>{isPreviewActive ? 'Live Data' : 'Tags'}</span>
      </button>

      {isPreviewActive && (
        <>
          <div className="h-4 w-[1px] bg-neutral-800" />

          {/* Infinite Circular Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-300 transition active:scale-95"
              title="Previous Record (Wraps to end)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 min-w-[170px] justify-center px-1">
              <span className="text-xs text-neutral-200 font-medium truncate max-w-[130px]">
                {recipientName}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                [{currentIndex + 1}/{total}]
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-300 transition active:scale-95"
              title="Next Record (Wraps to beginning)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-neutral-800" />

          {/* Quick Manual Record Action */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenManualAddModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
              title="Add another certificate manually"
            >
              <UserPlus className="w-3 h-3 text-neutral-400" />
              <span>Add Recipient</span>
            </button>

            {total > 1 && onDeleteCurrentRecord && (
              <button
                type="button"
                onClick={() => onDeleteCurrentRecord(currentIndex)}
                className="p-1 rounded-full hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition"
                title="Delete this certificate"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { X, UserPlus, Check, Sparkles } from 'lucide-react';

export default function ManualRecordModal({
  isOpen,
  onClose,
  onAddRecord,
  nextRecordIndex
}) {
  const [fullName, setFullName] = useState('');
  const [courseName, setCourseName] = useState('Advanced Full-Stack Engineering & Cloud Architecture');
  const [date, setDate] = useState('October 17, 2026');
  const [certId, setCertId] = useState(`VLM-2026-${String(nextRecordIndex || 1).padStart(4, '0')}`);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onAddRecord({
      'Full_Name': fullName.trim(),
      'Course_Name': courseName.trim(),
      'Date': date.trim(),
      'Certificate_ID': certId.trim()
    });

    setFullName('');
    setCertId(`VLM-2026-${String((nextRecordIndex || 1) + 1).padStart(4, '0')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-[#0c0d0e] border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Add Certificate Manually</h3>
              <p className="text-[11px] text-neutral-400">Add an individual recipient without an Excel/CSV file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1">
              Recipient Full Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Bartholomew Sterling"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1">
              Course / Event / Award Title
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Cloud Security Engineering Fellowship"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                Issue Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 17, 2026"
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                Certificate Serial ID
              </label>
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. VLM-2026-0001"
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded text-xs transition border border-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add to Certificates List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

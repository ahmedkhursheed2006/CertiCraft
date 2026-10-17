import React, { useState } from 'react';
import { X, Type, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { loadCustomFontFile } from '../utils/fontManager';

export default function FontModal({
  isOpen,
  onClose,
  fonts,
  onAddCustomFont
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFontFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
      setErrorMsg('Please upload a valid font file (.ttf, .otf, .woff, or .woff2).');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const fontObj = await loadCustomFontFile(file);
      onAddCustomFont(fontObj);
      setSuccessMsg(`Font "${fontObj.family}" loaded successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to register font: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-[#0c0d0e] border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Typography Registry</h3>
              <p className="text-[11px] text-neutral-400">Load brand typography into the vector engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center gap-2 text-xs text-neutral-200">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Upload Area */}
          <div className="border border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/60 rounded-xl p-5 text-center flex flex-col items-center justify-center">
            <Upload className="w-5 h-5 text-neutral-400 mb-1.5" />
            <p className="text-xs font-semibold text-neutral-200">
              Upload Custom Font (.ttf, .otf, .woff, .woff2)
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
              Automatically registers in document.fonts for real-time canvas and vector PDF export
            </p>
            <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded cursor-pointer transition border border-neutral-700">
              {loading ? 'Registering...' : 'Select Font File'}
              <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFontFile(e.target.files[0]);
                }}
              />
            </label>
          </div>

          {/* Registered Fonts List */}
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
              Installed Fonts ({fonts.length})
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {fonts.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-neutral-200 truncate">{f.name}</p>
                      {f.custom && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
                          Custom
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm text-neutral-400 mt-1 truncate"
                      style={{ fontFamily: `"${f.family}", sans-serif` }}
                    >
                      Certificate of Achievement
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

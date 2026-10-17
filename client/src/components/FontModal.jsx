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
      setSuccessMsg(`Font "${fontObj.family}" installed successfully!`);
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg('Failed to load font: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Custom Typography &amp; Fonts</h3>
              <p className="text-xs text-slate-400">Upload your own TTF / OTF / WOFF fonts for the certificate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Upload Font Box */}
          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/50 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
            <Upload className="w-7 h-7 text-pink-400 mb-2" />
            <p className="text-sm font-semibold text-slate-200">
              Upload Custom Font (.ttf, .otf, .woff, .woff2)
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Your custom font will be immediately usable across all text boxes and exports
            </p>
            <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition border border-slate-700">
              {loading ? 'Registering Font...' : 'Select Font File'}
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

          {/* Installed & Built-In Fonts List */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Available Fonts ({fonts.length})
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {fonts.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-200">{f.name}</p>
                      {f.custom && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          CUSTOM
                        </span>
                      )}
                    </div>
                    {/* Live Font Render Specimen */}
                    <p
                      className="text-base text-slate-400 mt-0.5"
                      style={{ fontFamily: `"${f.family}", sans-serif` }}
                    >
                      Certificate of Achievement &amp; Excellence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

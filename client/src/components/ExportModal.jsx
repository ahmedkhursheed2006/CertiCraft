import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, Sparkles, Cloud, CheckCircle, Loader2 } from 'lucide-react';
import { exportBatchToZip, renderCertificateCanvas, canvasToPdfBytes, downloadBlob, formatFilename, loadImage } from '../utils/exportGenerator';
import confetti from 'canvas-confetti';

export default function ExportModal({
  isOpen,
  onClose,
  template,
  elements,
  records,
  currentRecord,
  onOpenDriveModal
}) {
  const [format, setFormat] = useState('pdf'); // 'pdf' or 'png'
  const [exportMode, setExportMode] = useState('bulk'); // 'bulk' or 'single'
  const [namePattern, setNamePattern] = useState('{{Full_Name}}_Certificate');
  const [zipName, setZipName] = useState('Certificates_Batch.zip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentName: '' });

  if (!isOpen) return null;

  const dataset = exportMode === 'bulk' && records.length > 0 ? records : [currentRecord || { 'Full_Name': 'Sample_Recipient' }];

  const handleExport = async () => {
    setIsProcessing(true);

    try {
      if (exportMode === 'single') {
        const bgImg = template.backgroundUrl ? await loadImage(template.backgroundUrl) : null;
        const canvas = await renderCertificateCanvas(bgImg, elements, currentRecord, template.width, template.height);
        const filename = formatFilename(namePattern, currentRecord, 0, format);

        if (format === 'pdf') {
          const pdfBytes = await canvasToPdfBytes(canvas);
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          downloadBlob(blob, filename);
        } else {
          canvas.toBlob((blob) => {
            if (blob) downloadBlob(blob, filename);
          }, 'image/png');
        }

        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        onClose();
      } else {
        // Bulk ZIP export
        await exportBatchToZip({
          bgUrl: template.backgroundUrl,
          elements,
          records: dataset,
          canvasWidth: template.width,
          canvasHeight: template.height,
          format,
          namePattern,
          zipName: zipName.endsWith('.zip') ? zipName : `${zipName}.zip`,
          onProgress: (current, total, currentName) => {
            setProgress({ current, total, currentName });
          }
        });
        setTimeout(() => {
          setIsProcessing(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      alert('Error during export: ' + err.message);
      setIsProcessing(false);
    }
  };

  const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-[#0b0e14] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Export Certificates</h3>
              <p className="text-xs text-slate-400">Generate high-DPI print-ready files</p>
            </div>
          </div>
          <button
            disabled={isProcessing}
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Export Mode */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Scope of Generation
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isProcessing}
                onClick={() => setExportMode('bulk')}
                className={`p-3 rounded-xl border text-left transition ${
                  exportMode === 'bulk'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                    : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-semibold">Bulk Batch ({records.length})</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Zip all recipient files</p>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => setExportMode('single')}
                className={`p-3 rounded-xl border text-left transition ${
                  exportMode === 'single'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                    : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-semibold">Current Preview Only</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Download 1 single certificate</p>
              </button>
            </div>
          </div>

          {/* File Format */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={isProcessing}
                onClick={() => setFormat('pdf')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                  format === 'pdf'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 text-red-400" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Vector PDF</p>
                  <p className="text-[10px] text-slate-400">High-res print ready</p>
                </div>
              </button>

              <button
                disabled={isProcessing}
                onClick={() => setFormat('png')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                  format === 'png'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Lossless PNG</p>
                  <p className="text-[10px] text-slate-400">Ultra-sharp image</p>
                </div>
              </button>
            </div>
          </div>

          {/* Filename Formula */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Individual Filename Pattern
            </label>
            <input
              type="text"
              disabled={isProcessing}
              value={namePattern}
              onChange={(e) => setNamePattern(e.target.value)}
              className="w-full bg-black/60 border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-mono text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Sample output: <span className="text-slate-300">Dr_Evelyn_Montgomery_Certificate.{format}</span>
            </p>
          </div>

          {/* Progress Bar during generation */}
          {isProcessing && (
            <div className="p-4 bg-black/60 rounded-xl border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </span>
                <span className="font-mono text-slate-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 truncate font-mono">
                {progress.currentName || 'Preparing files...'} ({progress.current}/{progress.total})
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => {
              onClose();
              if (onOpenDriveModal) onOpenDriveModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium border border-blue-500/30 transition"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span>Sync to Google Drive</span>
          </button>

          <button
            disabled={isProcessing}
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white rounded-lg text-xs font-semibold shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{exportMode === 'bulk' ? `Download ZIP (${dataset.length})` : 'Download File'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

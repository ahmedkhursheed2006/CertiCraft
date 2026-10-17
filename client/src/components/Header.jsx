import React from 'react';
import { Award, Upload, FileSpreadsheet, Download, Type, Sparkles } from 'lucide-react';

export default function Header({
  templates,
  currentTemplate,
  onSelectTemplate,
  onUploadTemplateImage,
  onOpenDataModal,
  onOpenFontModal,
  onOpenExportModal,
  recordCount
}) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between select-none z-30">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight leading-none">CertiCraft</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              STUDIO
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">Dynamic Certificate Generator</p>
        </div>
      </div>

      {/* Center Actions: Template Selector & Template Upload */}
      <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
        <span className="text-xs text-slate-400 px-2 font-medium">Template:</span>
        <select
          value={currentTemplate.id}
          onChange={(e) => onSelectTemplate(e.target.value)}
          className="bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name}
            </option>
          ))}
          {currentTemplate.id.startsWith('custom_') && (
            <option value={currentTemplate.id}>{currentTemplate.name}</option>
          )}
        </select>

        {/* Upload Custom Universal Template Button */}
        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-xs font-medium cursor-pointer transition border border-slate-700">
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUploadTemplateImage}
          />
        </label>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Custom Font Uploader */}
        <button
          onClick={onOpenFontModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition"
        >
          <Type className="w-3.5 h-3.5 text-pink-400" />
          <span>Fonts</span>
        </button>

        {/* Excel / CSV Data Ingestion */}
        <button
          onClick={onOpenDataModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Data ({recordCount})</span>
        </button>

        {/* Generate & Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/25 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Generate &amp; Export</span>
        </button>
      </div>
    </header>
  );
}

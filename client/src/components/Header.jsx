import React from 'react';
import { Upload, FileSpreadsheet, Type, Cloud, ArrowLeft, Download, ChevronDown, Check } from 'lucide-react';
import VellumLogo from './VellumLogo';

export default function Header({
  templates,
  currentTemplate,
  onSelectTemplate,
  onUploadTemplateImage,
  onOpenDataModal,
  onOpenFontModal,
  onOpenExportModal,
  onOpenDriveModal,
  onNavigateHome,
  recordCount
}) {
  return (
    <header className="h-13 bg-[#0c0d0e] border-b border-neutral-800/80 px-4 flex items-center justify-between select-none z-30">
      {/* Left: Breadcrumb & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded-md transition"
          title="Return to Product Overview"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <div className="h-4 w-[1px] bg-neutral-800" />

        <VellumLogo className="w-4 h-4" showText={true} />

        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 font-mono pl-1">
          <span>/</span>
          <span className="text-neutral-300 font-medium truncate max-w-[160px]">
            {currentTemplate.name}
          </span>
        </div>
      </div>

      {/* Center: Template Switcher & Upload */}
      <div className="flex items-center gap-1.5 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
        <span className="text-[11px] text-neutral-400 px-2 font-medium">Template:</span>
        <select
          value={currentTemplate.id}
          onChange={(e) => onSelectTemplate(e.target.value)}
          className="bg-neutral-950 text-xs text-neutral-200 border border-neutral-800 rounded px-2 py-1 focus:outline-none focus:border-neutral-600 font-medium"
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

        <label className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium cursor-pointer transition border border-neutral-700">
          <Upload className="w-3.5 h-3.5 text-neutral-400" />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUploadTemplateImage}
          />
        </label>
      </div>

      {/* Right: Studio Actions */}
      {/* Right: Studio Actions */}
      <div className="flex items-center gap-2">
        {/* Primary Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded-md text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        <div className="h-4 w-[1px] bg-neutral-800 mx-0.5" />

        {/* Dataset Ingestion */}
        <button
          onClick={onOpenDataModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-md text-xs font-medium border border-neutral-800 transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-400" />
          <span>Data Records ({recordCount})</span>
        </button>

        {/* Custom Fonts */}
        <button
          onClick={onOpenFontModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-md text-xs font-medium border border-neutral-800 transition"
        >
          <Type className="w-3.5 h-3.5 text-neutral-400" />
          <span>Font Library</span>
        </button>
      </div>
    </header>
  );
}

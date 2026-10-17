import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Italic, Layers } from 'lucide-react';

export default function RightSidebar({
  selectedElement,
  currentRecord,
  onUpdateCurrentRecordValue,
  fonts,
  onChangeElement
}) {
  if (!selectedElement) {
    return (
      <aside className="w-76 bg-[#0c0d0e] border-l border-neutral-800/80 p-6 flex flex-col items-center justify-center text-center select-none h-[calc(100vh-3.25rem)]">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-500">
          <Layers className="w-5 h-5 text-neutral-400" />
        </div>
        <h3 className="text-xs font-semibold text-neutral-300 mb-1">No Element Selected</h3>
        <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed">
          Select any text element on the canvas to inspect its container and typography.
        </p>
      </aside>
    );
  }

  // Extract clean variable key from tag (e.g. "{{Full_Name}}" -> "Full_Name")
  const rawTag = selectedElement.tag || '';
  const match = rawTag.match(/\{\{\s*([a-zA-Z0-9_\-\s]+)\s*\}\}/);
  const variableKey = match ? match[1].trim() : rawTag.replace(/[{}]/g, '').trim();

  // Determine current live value
  const currentValue =
    currentRecord && variableKey && currentRecord[variableKey] !== undefined
      ? currentRecord[variableKey]
      : (selectedElement.text || '');

  const handleCurrentValueChange = (newVal) => {
    if (onUpdateCurrentRecordValue && variableKey) {
      onUpdateCurrentRecordValue(variableKey, newVal);
    } else {
      onChangeElement({
        ...selectedElement,
        text: newVal
      });
    }
  };

  const handleChange = (key, value) => {
    onChangeElement({
      ...selectedElement,
      [key]: value
    });
  };

  const COLOR_PALETTE = ['#f4f4f5', '#fbbf24', '#e2e8f0', '#38bdf8', '#34d399', '#f87171', '#09090b', '#71717a'];

  return (
    <aside className="w-76 bg-[#0c0d0e] border-l border-neutral-800/80 flex flex-col h-[calc(100vh-3.25rem)] overflow-y-auto select-none">
      <div className="px-4 py-3 border-b border-neutral-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Inspector
        </span>
        <span className="text-[10px] font-mono text-neutral-500">
          {selectedElement.id}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Field 1: Current Live Value (Directly Editable with Live Preview) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-white flex items-center gap-1.5">
              <span>Current Value</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                Live
              </span>
            </label>
            {variableKey && (
              <span className="text-[10px] font-mono text-neutral-500">
                &#123;&#123;{variableKey}&#125;&#125;
              </span>
            )}
          </div>
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleCurrentValueChange(e.target.value)}
            placeholder="Type value here..."
            className="w-full bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-white shadow-inner"
          />
          <p className="text-[10px] text-neutral-500 mt-1">
            Updates the certificate live on canvas and in the active record.
          </p>
        </div>

        {/* Field 2: Variable Tag */}
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">
            Data Variable Placeholder
          </label>
          <input
            type="text"
            value={selectedElement.tag || ''}
            onChange={(e) => handleChange('tag', e.target.value)}
            placeholder="{{Field_Name}}"
            className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
          />
        </div>

        <div className="h-[1px] bg-neutral-800/80" />

        {/* Section: Typography */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Font Family
            </label>
            <select
              value={selectedElement.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
            >
              {fonts.map((f, idx) => (
                <option key={idx} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Size (px)
              </label>
              <input
                type="number"
                min="8"
                max="240"
                value={selectedElement.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 12)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                Weight
              </label>
              <select
                value={selectedElement.fontWeight || 'normal'}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
              >
                <option value="300">Light (300)</option>
                <option value="normal">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="bold">Bold (700)</option>
                <option value="800">Black (800)</option>
              </select>
            </div>
          </div>

          {/* Text Alignment & Italic */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Horizontal &amp; Vertical Alignment
            </label>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded border border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleChange('align', 'left')}
                  title="Align Left"
                  className={`flex-1 py-1 rounded flex items-center justify-center transition ${
                    selectedElement.align === 'left' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('align', 'center')}
                  title="Align Center"
                  className={`flex-1 py-1 rounded flex items-center justify-center transition ${
                    selectedElement.align === 'center' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('align', 'right')}
                  title="Align Right"
                  className={`flex-1 py-1 rounded flex items-center justify-center transition ${
                    selectedElement.align === 'right' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-neutral-800 my-auto" />
                <button
                  type="button"
                  onClick={() => handleChange('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
                  title="Italic"
                  className={`px-2.5 py-1 rounded flex items-center justify-center transition ${
                    selectedElement.fontStyle === 'italic' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Vertical Alignment inside container */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded border border-neutral-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleChange('verticalAlign', 'top')}
                  className={`flex-1 py-0.5 rounded transition ${
                    (selectedElement.verticalAlign || 'middle') === 'top' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('verticalAlign', 'middle')}
                  className={`flex-1 py-0.5 rounded transition ${
                    (selectedElement.verticalAlign || 'middle') === 'middle' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Middle
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('verticalAlign', 'bottom')}
                  className={`flex-1 py-0.5 rounded transition ${
                    selectedElement.verticalAlign === 'bottom' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Bottom
                </button>
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">
              Fill Color
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={selectedElement.fill || '#f4f4f5'}
                onChange={(e) => handleChange('fill', e.target.value)}
                className="w-7 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer p-0"
              />
              <input
                type="text"
                value={selectedElement.fill || '#f4f4f5'}
                onChange={(e) => handleChange('fill', e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs font-mono text-neutral-200 focus:outline-none focus:border-neutral-600 uppercase"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleChange('fill', c)}
                  className="w-4 h-4 rounded-full border border-neutral-700 hover:scale-110 transition"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-neutral-800/80" />

        {/* Auto-Fit Toggle */}
        <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="autoFitCheck"
            checked={!!selectedElement.autoFit}
            onChange={(e) => handleChange('autoFit', e.target.checked)}
            className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 cursor-pointer"
          />
          <label htmlFor="autoFitCheck" className="text-xs cursor-pointer select-none">
            <span className="font-medium text-neutral-200 block">Auto-Fit String Width</span>
            <span className="text-[10px] text-neutral-500 leading-tight block mt-0.5">
              Scales font size down automatically if text exceeds the container width.
            </span>
          </label>
        </div>

        {/* Container Geometry & Coordinates (Allowing Full Height Modification) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-neutral-400">
              Container Geometry (px)
            </label>
            <span className="text-[10px] text-neutral-500 font-mono">
              X, Y, W, H
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
              <span className="text-neutral-500 text-[10px]">X</span>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-neutral-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
              <span className="text-neutral-500 text-[10px]">Y</span>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-neutral-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
              <span className="text-neutral-500 text-[10px]">W</span>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => handleChange('width', Math.max(20, parseInt(e.target.value) || 20))}
                className="w-full bg-transparent text-neutral-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 ring-1 ring-neutral-700">
              <span className="text-white text-[10px] font-bold">H</span>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handleChange('height', Math.max(20, parseInt(e.target.value) || 20))}
                className="w-full bg-transparent text-white font-medium focus:outline-none"
                title="Container Height (px)"
              />
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">
            Drag any of the 8 bounding box handles on the canvas or type exact H above.
          </p>
        </div>
      </div>
    </aside>
  );
}

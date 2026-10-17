import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Italic, Bold, Maximize2, Sparkles } from 'lucide-react';

export default function RightSidebar({
  selectedElement,
  fonts,
  onChangeElement
}) {
  if (!selectedElement) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center select-none h-[calc(100vh-4rem)]">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-500">
          <Sparkles className="w-6 h-6 text-indigo-400/60" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">No Element Selected</h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Click any text box on the certificate or add one from the left sidebar to customize its font, styling, and position.
        </p>
      </aside>
    );
  }

  const handleChange = (key, value) => {
    onChangeElement({
      ...selectedElement,
      [key]: value
    });
  };

  const COLOR_PALETTE = ['#fbbf24', '#ffffff', '#000000', '#38bdf8', '#34d399', '#f87171', '#94a3b8', '#d97706'];

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto select-none">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Element Properties
        </h2>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {/* Dynamic Placeholder Tag */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Variable Tag / Placeholder
          </label>
          <input
            type="text"
            value={selectedElement.tag || ''}
            onChange={(e) => handleChange('tag', e.target.value)}
            placeholder="{{Field_Name}}"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Replaced by corresponding Excel/CSV column during generation.
          </p>
        </div>

        {/* Fallback Preview Text */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Sample Preview Text
          </label>
          <input
            type="text"
            value={selectedElement.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Font Family Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Font Family
          </label>
          <select
            value={selectedElement.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {fonts.map((f, idx) => (
              <option key={idx} value={f.family}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Size (px)
            </label>
            <input
              type="number"
              min="8"
              max="200"
              value={selectedElement.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 12)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Weight
            </label>
            <select
              value={selectedElement.fontWeight || 'normal'}
              onChange={(e) => handleChange('fontWeight', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="300">Light (300)</option>
              <option value="normal">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="bold">Bold (700)</option>
              <option value="800">Extra-Bold (800)</option>
            </select>
          </div>
        </div>

        {/* Text Alignment & Style */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Alignment &amp; Style
          </label>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleChange('align', 'left')}
              className={`flex-1 py-1.5 rounded flex items-center justify-center transition ${
                selectedElement.align === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChange('align', 'center')}
              className={`flex-1 py-1.5 rounded flex items-center justify-center transition ${
                selectedElement.align === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChange('align', 'right')}
              className={`flex-1 py-1.5 rounded flex items-center justify-center transition ${
                selectedElement.align === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-5 bg-slate-800 my-auto" />
            <button
              onClick={() => handleChange('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
              className={`px-3 py-1.5 rounded flex items-center justify-center transition ${
                selectedElement.fontStyle === 'italic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Text Color
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={selectedElement.fill || '#ffffff'}
              onChange={(e) => handleChange('fill', e.target.value)}
              className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer p-0"
            />
            <input
              type="text"
              value={selectedElement.fill || '#ffffff'}
              onChange={(e) => handleChange('fill', e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
            />
          </div>
          {/* Quick Color Palette */}
          <div className="flex items-center gap-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => handleChange('fill', c)}
                className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Auto-Fit / Shrink Feature */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
          <input
            type="checkbox"
            id="autoFitCheck"
            checked={!!selectedElement.autoFit}
            onChange={(e) => handleChange('autoFit', e.target.checked)}
            className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="autoFitCheck" className="text-xs cursor-pointer">
            <span className="font-medium text-slate-200 block">Auto-Shrink to Fit Box</span>
            <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
              Dynamically scales down the font size if a recipient's name is too long for the text box.
            </span>
          </label>
        </div>

        {/* Coordinates & Dimensions */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Coordinates (px)
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <span className="text-slate-500">X:</span>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-slate-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <span className="text-slate-500">Y:</span>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-slate-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <span className="text-slate-500">W:</span>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => handleChange('width', parseInt(e.target.value) || 20)}
                className="w-full bg-transparent text-slate-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <span className="text-slate-500">H:</span>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value) || 20)}
                className="w-full bg-transparent text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

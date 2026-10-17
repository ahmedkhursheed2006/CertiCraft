import React from 'react';
import { Plus, Trash2, Copy, Grid, Layers, Eye, EyeOff, Hash, Calendar, BookOpen, User } from 'lucide-react';

export default function LeftSidebar({
  elements,
  selectedId,
  onSelectElement,
  onAddElement,
  onDuplicateElement,
  onDeleteElement,
  showGrid,
  onToggleGrid
}) {
  const PRESETS = [
    { label: 'Recipient Name', tag: '{{Full_Name}}', icon: User, fontSize: 50, fontFamily: 'Great Vibes', fill: '#fbbf24', width: 900, height: 90 },
    { label: 'Course / Event', tag: '{{Course_Name}}', icon: BookOpen, fontSize: 22, fontFamily: 'Montserrat', fill: '#e2e8f0', width: 900, height: 50 },
    { label: 'Issue Date', tag: '{{Date}}', icon: Calendar, fontSize: 18, fontFamily: 'Inter', fill: '#fbbf24', width: 220, height: 40 },
    { label: 'Certificate ID', tag: '{{Certificate_ID}}', icon: Hash, fontSize: 13, fontFamily: 'Inter', fill: '#64748b', width: 280, height: 30 }
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Section 1: Add New Elements */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Add Dynamic Box</span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => onAddElement(p)}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition group"
              >
                <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[11px] font-medium leading-tight text-center">{p.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onAddElement({ label: 'Custom Text', tag: '{{Custom_Text}}', fontSize: 24, fontFamily: 'Inter', fill: '#ffffff', width: 400, height: 50 })}
          className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Field</span>
        </button>
      </div>

      {/* Section 2: Layers List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Canvas Layers ({elements.length})</span>
          </div>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
          {elements.map((el, index) => {
            const isSelected = el.id === selectedId;
            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer border transition ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-white'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] text-slate-500 font-mono w-4">{index + 1}</span>
                  <div className="truncate">
                    <p className="font-medium truncate">{el.tag || el.text}</p>
                    <p className="text-[10px] text-slate-500 truncate">{el.fontFamily} • {el.fontSize}px</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-70 hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(el.id);
                    }}
                    title="Duplicate"
                    className="p-1 hover:text-indigo-400 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    title="Delete"
                    className="p-1 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Bottom Toggles (Grid) */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={onToggleGrid}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition ${
            showGrid
              ? 'bg-slate-800 text-indigo-400 border-indigo-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            <span>Alignment Grid</span>
          </div>
          <span className="text-[10px] font-semibold uppercase">{showGrid ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </aside>
  );
}

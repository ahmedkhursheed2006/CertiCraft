import React, { useState } from 'react';
import { Plus, Trash2, Copy, Grid, Layers, User, Calendar, BookOpen, Hash, SlidersHorizontal } from 'lucide-react';

export default function LeftSidebar({
  elements,
  selectedId,
  onSelectElement,
  onAddElement,
  onDuplicateElement,
  onDeleteElement,
  showGrid,
  onToggleGrid,
  headers,
}) {
  const [activeTab, setActiveTab] = useState('fields'); // 'fields' or 'layers'

  const PRESETS = [
    { label: 'Recipient Name', tag: '{{Full_Name}}', icon: User, fontSize: 52, fontFamily: 'Cinzel', fill: '#f4f4f5', width: 900, height: 90 },
    { label: 'Event / Course', tag: '{{Course_Name}}', icon: BookOpen, fontSize: 20, fontFamily: 'Montserrat', fill: '#a1a1aa', width: 900, height: 50 },
    { label: 'Issue Date', tag: '{{Date}}', icon: Calendar, fontSize: 16, fontFamily: 'Inter', fill: '#f4f4f5', width: 220, height: 40 },
    { label: 'Certificate ID', tag: '{{Certificate_ID}}', icon: Hash, fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#71717a', width: 280, height: 30 }
  ];

  // Generate dynamic presets from uploaded CSV/Excel headers
  const dynamicPresets = (headers && headers.length > 0)
    ? headers.map((h) => ({
        label: h.replace(/_/g, ' '),
        tag: `{{${h}}}`,
        icon: SlidersHorizontal,
        fontSize: 16,
        fontFamily: 'Inter',
        fill: '#f4f4f5',
        width: 900,
        height: 40
      }))
    : [];

  // Use dynamic presets if available, otherwise fallback to static PRESETS
  const displayedPresets = dynamicPresets.length > 0 ? dynamicPresets : PRESETS;

  return (
    <aside className="w-68 bg-[#0c0d0e] border-r border-neutral-800/80 flex flex-col h-[calc(100vh-3.25rem)] select-none">
      {/* Segmented Top Tabs */}
      <div className="p-2.5 border-b border-neutral-800/80">
        <div className="grid grid-cols-2 gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setActiveTab('fields')}
            className={`py-1 rounded text-xs font-medium transition ${
              activeTab === 'fields'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Variables
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`py-1 rounded text-xs font-medium transition ${
              activeTab === 'layers'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Layers ({elements.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Variable Text Boxes */}
      {activeTab === 'fields' && (
        <div className="p-3 space-y-2 flex-1 overflow-y-auto">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block px-1">
            Standard Field Presets
          </span>

          <div className="space-y-1.5">
            {displayedPresets.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onAddElement(p)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/40 hover:bg-neutral-800/60 border border-neutral-800/80 hover:border-neutral-700 text-neutral-300 hover:text-white transition group text-left"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                    <div>
                      <p className="text-xs font-medium">{p.label}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">{p.tag}</p>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onAddElement({ label: 'Custom Field', tag: '{{Custom_Field}}', fontSize: 24, fontFamily: 'Inter', fill: '#f4f4f5', width: 400, height: 50 })}
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-medium transition"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-400" />
            <span>Add Custom Variable</span>
          </button>
        </div>
      )}

      {/* Tab 2: Layers Hierarchy */}
      {activeTab === 'layers' && (
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block px-1 mb-2">
            Canvas Elements
          </span>

          {elements.map((el, index) => {
            const isSelected = el.id === selectedId;
            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer border transition ${
                  isSelected
                    ? 'bg-neutral-800/90 border-neutral-600 text-white'
                    : 'bg-neutral-900/30 border-neutral-800/60 text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] text-neutral-600 font-mono w-3">{index + 1}</span>
                  <div className="truncate">
                    <p className="font-medium truncate font-mono text-[11px]">{el.tag || el.text}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{el.fontFamily} • {el.fontSize}px</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(el.id);
                    }}
                    title="Duplicate"
                    className="p-1 hover:text-white rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    title="Delete"
                    className="p-1 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Toggles (Grid) */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/40">
        <button
          onClick={onToggleGrid}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition ${
            showGrid
              ? 'bg-neutral-800 text-white border-neutral-700'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Grid className="w-3.5 h-3.5" />
            <span>Alignment Grid</span>
          </div>
          <span className="text-[10px] font-mono uppercase">{showGrid ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </aside>
  );
}

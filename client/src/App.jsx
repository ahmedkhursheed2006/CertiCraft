import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import CanvasEditor from './components/CanvasEditor';
import PreviewCycler from './components/PreviewCycler';
import DataModal from './components/DataModal';
import FontModal from './components/FontModal';
import ExportModal from './components/ExportModal';

import { SAMPLE_TEMPLATES, DEFAULT_ELEMENTS, SAMPLE_RECIPIENTS } from './utils/sampleCertificates';
import { BUILT_IN_FONTS } from './utils/fontManager';

export default function App() {
  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState(SAMPLE_TEMPLATES[0]);
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState('el_name');
  const [fonts, setFonts] = useState(BUILT_IN_FONTS);
  const [records, setRecords] = useState(SAMPLE_RECIPIENTS);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Modals state
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Keyboard shortcut listener for Delete & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          handleDeleteElement(selectedId);
        }
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements]);

  // Select pre-existing template
  const handleSelectTemplate = (id) => {
    const found = templates.find((t) => t.id === id);
    if (found) setCurrentTemplate(found);
  };

  // Upload custom universal certificate template image
  const handleUploadTemplateImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        const customTpl = {
          id: 'custom_' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          width: img.naturalWidth || 1920,
          height: img.naturalHeight || 1080,
          backgroundUrl: dataUrl
        };
        setTemplates((prev) => [customTpl, ...prev]);
        setCurrentTemplate(customTpl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Add new dynamic text element
  const handleAddElement = (preset) => {
    const newId = 'el_' + Date.now();
    const newEl = {
      id: newId,
      tag: preset.tag || '{{Custom_Field}}',
      text: preset.label || 'Dynamic Text Box',
      x: Math.round((currentTemplate.width - (preset.width || 400)) / 2),
      y: Math.round((currentTemplate.height - (preset.height || 50)) / 2),
      width: preset.width || 400,
      height: preset.height || 50,
      fontSize: preset.fontSize || 24,
      fontFamily: preset.fontFamily || 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: preset.fill || '#ffffff',
      align: 'center',
      autoFit: true
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

  // Duplicate an element
  const handleDuplicateElement = (id) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const duplicated = {
      ...el,
      id: 'el_' + Date.now(),
      x: el.x + 30,
      y: el.y + 30
    };
    setElements((prev) => [...prev, duplicated]);
    setSelectedId(duplicated.id);
  };

  // Delete an element
  const handleDeleteElement = (id) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Update element properties from canvas or sidebar
  const handleChangeElement = (newAttrs) => {
    setElements((prev) =>
      prev.map((el) => (el.id === newAttrs.id ? newAttrs : el))
    );
  };

  // Add newly uploaded custom font
  const handleAddCustomFont = (fontObj) => {
    setFonts((prev) => [fontObj, ...prev]);
    // If an element is active, immediately apply this custom font to it!
    if (selectedId) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedId ? { ...el, fontFamily: fontObj.family } : el))
      );
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);
  const currentRecord = isPreviewActive && records.length > 0 ? records[currentRecordIndex] : null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <Header
        templates={templates}
        currentTemplate={currentTemplate}
        onSelectTemplate={handleSelectTemplate}
        onUploadTemplateImage={handleUploadTemplateImage}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenFontModal={() => setIsFontModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        recordCount={records.length}
      />

      {/* Main Studio Body: Left Sidebar + Canvas + Right Sidebar */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar: Presets & Layers */}
        <LeftSidebar
          elements={elements}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
          onAddElement={handleAddElement}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
        />

        {/* Center: Visual Canvas */}
        <div className="flex-1 relative flex flex-col h-full overflow-hidden">
          <CanvasEditor
            template={currentTemplate}
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onChangeElement={handleChangeElement}
            currentRecord={currentRecord}
            showGrid={showGrid}
          />

          {/* Floating Bottom Data Navigator */}
          <PreviewCycler
            records={records}
            currentIndex={currentRecordIndex}
            onIndexChange={setCurrentRecordIndex}
            isPreviewActive={isPreviewActive}
            onTogglePreview={() => setIsPreviewActive(!isPreviewActive)}
          />
        </div>

        {/* Right Sidebar: Typography & Box Customization */}
        <RightSidebar
          selectedElement={selectedElement}
          fonts={fonts}
          onChangeElement={handleChangeElement}
        />
      </div>

      {/* Modals */}
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        records={records}
        onSaveRecords={(newRecords) => {
          setRecords(newRecords);
          setCurrentRecordIndex(0);
          setIsPreviewActive(true);
        }}
      />

      <FontModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        fonts={fonts}
        onAddCustomFont={handleAddCustomFont}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        template={currentTemplate}
        elements={elements}
        records={records}
        currentRecord={currentRecord}
      />
    </div>
  );
}

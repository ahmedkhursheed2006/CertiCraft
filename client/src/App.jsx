import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import CanvasEditor from './components/CanvasEditor';
import PreviewCycler from './components/PreviewCycler';
import DataModal from './components/DataModal';
import FontModal from './components/FontModal';
import ExportModal from './components/ExportModal';
import GoogleDriveModal from './components/GoogleDriveModal';
import LandingPage from './components/LandingPage';

import { SAMPLE_TEMPLATES, DEFAULT_ELEMENTS, SAMPLE_RECIPIENTS } from './utils/sampleCertificates';
import { BUILT_IN_FONTS } from './utils/fontManager';

export default function App() {
  // Navigation: 'landing' (single-page overview) or 'studio' (dedicated workspace)
  const [viewMode, setViewMode] = useState('landing');

  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState(SAMPLE_TEMPLATES[0]);
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState('el_name');
  const [fonts, setFonts] = useState(BUILT_IN_FONTS);
  const [records, setRecords] = useState(SAMPLE_RECIPIENTS);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Derive CSV/Excel headers from loaded records for dynamic field presets
  const recordHeaders = records.length > 0 ? Object.keys(records[0]) : [];

  // Modals state
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);


  // Keyboard shortcut listener for Delete & Escape in Studio mode
  useEffect(() => {
    if (viewMode !== 'studio') return;
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
  }, [selectedId, elements, viewMode]);



  const handleSelectTemplate = (id) => {
    const found = templates.find((t) => t.id === id);
    if (found) setCurrentTemplate(found);
  };

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

  const handleAddElement = (preset) => {
    const newId = 'el_' + Date.now();
    const newEl = {
      id: newId,
      tag: preset.tag || '{{Custom_Field}}',
      text: preset.label || 'Dynamic Text Box',
      x: Math.round((currentTemplate.width - (preset.width || 400)) / 2),
      y: Math.round((currentTemplate.height - (preset.height || 60)) / 2),
      width: preset.width || 400,
      height: preset.height || 60,
      fontSize: preset.fontSize || 24,
      fontFamily: preset.fontFamily || 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: preset.fill || '#f4f4f5',
      align: 'center',
      verticalAlign: 'middle',
      autoFit: true
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

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

  const handleDeleteElement = (id) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleChangeElement = (newAttrs) => {
    setElements((prev) =>
      prev.map((el) => (el.id === newAttrs.id ? newAttrs : el))
    );
  };

  const handleAddCustomFont = (fontObj) => {
    setFonts((prev) => [fontObj, ...prev]);
    if (selectedId) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedId ? { ...el, fontFamily: fontObj.family } : el))
      );
    }
  };

  // Instant 1-Click New Certificate Addition (ZERO DIALOGS)
  const handleAddDirectRecipient = () => {
    const nextNum = records.length + 1;
    const templateCourse = currentRecord?.Course_Name || 'Advanced Full-Stack Engineering';
    const templateDate = currentRecord?.Date || 'October 17, 2026';

    const newRecord = {
      'Full_Name': `New Recipient ${nextNum}`,
      'Course_Name': templateCourse,
      'Date': templateDate,
      'Certificate_ID': `VLM-2026-${String(nextNum).padStart(4, '0')}`
    };

    setRecords((prev) => {
      const updated = [...prev, newRecord];
      setCurrentRecordIndex(updated.length - 1);
      return updated;
    });
    setIsPreviewActive(true);
  };

  // Delete certificate from list
  const handleDeleteCurrentRecord = (indexToDelete) => {
    if (records.length <= 1) return;
    setRecords((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      setCurrentRecordIndex((current) => Math.min(current, updated.length - 1));
      return updated;
    });
  };

  // Live Inspector Field Modification
  const handleUpdateCurrentRecordValue = (key, val) => {
    if (records.length > 0) {
      setRecords((prev) => {
        const copy = [...prev];
        copy[currentRecordIndex] = {
          ...copy[currentRecordIndex],
          [key]: val
        };
        return copy;
      });
    }

    if (selectedId) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedId ? { ...el, text: val } : el))
      );
    }
  };

  // Double-Click Inline Canvas Edit Handler
  const handleUpdateTextValue = (element, val) => {
    const rawTag = element.tag || '';
    const match = rawTag.match(/\{\{\s*([a-zA-Z0-9_\-\s]+)\s*\}\}/);
    const key = match ? match[1].trim() : rawTag.replace(/[{}]/g, '').trim();

    if (key && records.length > 0) {
      setRecords((prev) => {
        const copy = [...prev];
        copy[currentRecordIndex] = {
          ...copy[currentRecordIndex],
          [key]: val
        };
        return copy;
      });
    }

    setElements((prev) =>
      prev.map((el) => (el.id === element.id ? { ...el, text: val } : el))
    );
  };

  const selectedElement = elements.find((el) => el.id === selectedId);
  const currentRecord = isPreviewActive && records.length > 0 ? records[currentRecordIndex] : null;

  // View 1: Landing Page (Single-page with smooth scrolling anchors & sandbox demo)
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchStudio={() => {
          setViewMode('studio');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />
    );
  }

  // View 2: Full Dedicated Vellum Studio Page
  return (
    <div className="flex flex-col h-screen w-screen bg-[#08090b] text-neutral-100 overflow-hidden font-sans select-none">
      {/* Studio Top Header */}
      <Header
        templates={templates}
        currentTemplate={currentTemplate}
        onSelectTemplate={handleSelectTemplate}
        onUploadTemplateImage={handleUploadTemplateImage}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenFontModal={() => setIsFontModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onNavigateHome={() => setViewMode('landing')}
        recordCount={records.length}
      />


      {/* Main Studio Workspace */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar: Variables & Layers */}
        <LeftSidebar
          elements={elements}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
          onAddElement={handleAddElement}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
          showGrid={showGrid}
            headers={recordHeaders}
          onToggleGrid={() => setShowGrid(!showGrid)}
        />

        {/* Center: Interactive Canvas Editor with Double Click Edit & Full Height Adjustment */}
        <div className="flex-1 relative flex flex-col h-full overflow-hidden">
          <CanvasEditor
            template={currentTemplate}
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onChangeElement={handleChangeElement}
            onUpdateTextValue={handleUpdateTextValue}
            currentRecord={currentRecord}
            showGrid={showGrid}
          />

          {/* Floating Data Record Cycler with Infinite Circular Navigation & 1-Click New Certificate */}
          <PreviewCycler
            records={records}
            currentIndex={currentRecordIndex}
            onIndexChange={setCurrentRecordIndex}
            isPreviewActive={isPreviewActive}
            onTogglePreview={() => setIsPreviewActive(!isPreviewActive)}
            onOpenManualAddModal={handleAddDirectRecipient}
            onDeleteCurrentRecord={handleDeleteCurrentRecord}
          />
        </div>

        {/* Right Sidebar: Inspector with Live Current Value and Container Height */}
        <RightSidebar
          selectedElement={selectedElement}
          currentRecord={currentRecord}
          onUpdateCurrentRecordValue={handleUpdateCurrentRecordValue}
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
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
      />

      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        template={currentTemplate}
        elements={elements}
        records={records}
        currentRecord={currentRecord}
      />
    </div>
  );
}

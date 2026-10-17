import React, { useState } from 'react';
import {
  ArrowRight,
  FileSpreadsheet,
  Cloud,
  Type,
  Maximize2,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Download,
  Upload,
  Sparkles,
  Lock,
  Workflow,
  CheckCircle2,
  FolderSync
} from 'lucide-react';
import VellumLogo from './VellumLogo';

export default function LandingPage({ onLaunchStudio }) {
  const [activeStep, setActiveStep] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(250);
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Sandbox Demo State (Lightweight & Non-exporting)
  const [demoName, setDemoName] = useState('Dr. Eleanor Montgomery');
  const [demoCourse, setDemoCourse] = useState('Full-Stack Cloud Infrastructure Fellowship');
  const [demoDate, setDemoDate] = useState('October 17, 2026');
  const [demoTheme, setDemoTheme] = useState('gold');
  const [showExportTeaser, setShowExportTeaser] = useState(false);

  // Sequential Workflow Walkthrough Steps
  const STEPS = [
    {
      step: '01',
      title: 'Ingest Universal Artwork',
      badge: 'Resolution Invariant',
      summary: 'Upload your high-res certificate design in PNG, SVG, or JPG. Vellum detects the natural pixel dimensions and locks in 300 DPI vector fidelity without downsampling.',
      details: [
        'Supports standard A4 (3508 × 2480 px), 1920 × 1080 px, or custom dimensions',
        'Preserves fine border guilloche and seal line work',
        'Pre-loaded with royal, corporate, and modern built-in templates'
      ]
    },
    {
      step: '02',
      title: 'Bind Dynamic Text Regions',
      badge: 'Sub-Pixel Anchors',
      summary: 'Draw and place bounding boxes directly onto the canvas. Set alignment to Left, Center, or Right, and enable Auto-Fit font scaling so long names never clip.',
      details: [
        'Preset variable tags: {{Full_Name}}, {{Course_Name}}, {{Date}}, {{Certificate_ID}}',
        'Full typography styling: family, weight, size, and hex fill color',
        'Automatic string measurement ensures names fit within boundaries'
      ]
    },
    {
      step: '03',
      title: 'Map Attendee Spreadsheet',
      badge: 'In-Memory Parsing',
      summary: 'Drop your attendee list in .xlsx or .csv format. Vellum parses columns in milliseconds directly in browser memory without sending rows to third-party servers.',
      details: [
        'Instant column detection automatically binds to your variable tags',
        'Live data cycler allows previewing real attendees on the canvas before generating',
        'Built-in test generator creates 50 sample records with one click'
      ]
    },
    {
      step: '04',
      title: 'Batch Export to ZIP or Google Drive',
      badge: 'Vector Pipeline',
      summary: 'Compile hundreds of certificates in seconds. Package them as a downloadable .zip archive or stream them directly into a designated Google Drive folder via OAuth 2.0.',
      details: [
        'Custom pattern-based filenames (e.g. {{Full_Name}}_Certificate.pdf)',
        'Choose between razor-sharp vector PDF or lossless 300 DPI PNG',
        'Direct Google Workspace folder creation and file dispatch'
      ]
    }
  ];



  const FAQS = [
    {
      q: 'How does Vellum maintain print-quality resolution?',
      a: 'Unlike web tools that render at low 72 DPI screen resolution, Vellum computes typography and vector layers relative to your background’s native pixel coordinates (e.g., 3508 x 2480 for 300 DPI A4). Output PDFs are genuine vector documents that remain razor sharp at any print scale.'
    },
    {
      q: 'Are attendee records stored or processed on your servers?',
      a: 'No. Vellum executes its entire parsing and rendering pipeline in your browser’s local sandbox using web workers and client-side pdf-lib. Your attendee spreadsheets and names never touch external servers unless you explicitly trigger Google Drive sync.'
    },
    {
      q: 'Can I upload custom organizational typefaces?',
      a: 'Yes. Vellum features a native typography registry supporting .ttf, .otf, .woff, and .woff2 font binaries. Once uploaded, fonts are registered with the CSS FontFace API and embedded directly into generated PDFs.'
    },
    {
      q: 'How does the Google Drive integration handle folder permissions?',
      a: 'Vellum requests the minimum necessary Google OAuth scope (https://www.googleapis.com/auth/drive.file). This restricts Vellum’s access solely to files and folders created through the app itself, preserving full privacy for the rest of your Drive.'
    },
    {
      q: 'What is the limit on recipient batch sizes?',
      a: 'Because rendering is hardware-accelerated directly in browser memory, batches of 50 to 500 certificates compile in seconds. For batches above 2,000, Vellum batches operations asynchronously to preserve responsive UI frame rates.'
    }
  ];

  const manualHours = ((participantsCount * 3.2) / 60).toFixed(1);
  const vellumSeconds = Math.max(2, Math.round(participantsCount * 0.12));
  const costSavings = Math.round(manualHours * 45);

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f5] font-sans selection:bg-neutral-800 selection:text-white flex flex-col relative overflow-hidden">
      {/* Full-Page Continuous Fixed Grid Underlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-100 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[45%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/[0.02] rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.015] rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Banner (Solid Opaque) */}
      <div id="top" className="bg-[#0e1015] border-b border-neutral-800 py-2 px-4 text-center text-xs text-neutral-400 flex items-center justify-center gap-3 select-none relative z-10">
        <span className="font-mono text-[10px] text-neutral-300 bg-[#161922] px-2 py-0.5 rounded border border-neutral-700">
          v2.4.0
        </span>
        <span>Precision Vector PDF Rendering &amp; Google Drive Integration</span>
        <button
          onClick={onLaunchStudio}
          className="text-white hover:underline font-medium flex items-center gap-1 transition"
        >
          <span>Open Full Studio &rarr;</span>
        </button>
      </div>

      {/* Global Sticky Navigation Header (Solid Opaque) */}
      <header className="sticky top-0 z-40 bg-[#0e1015] border-b border-neutral-800 px-6 lg:px-12 h-14 flex items-center justify-between select-none shadow-md">
        <a href="#top" className="flex items-center gap-2">
          <VellumLogo className="w-5 h-5" showText={true} />
        </a>

        {/* Anchor Links with Smooth Scrolling */}
        <nav className="hidden md:flex items-center gap-7 text-xs text-neutral-400">
          <a href="#demo" className="hover:text-white transition">
            Preview Sandbox
          </a>
          <a href="#walkthrough" className="hover:text-white transition">
            Walkthrough
          </a>
          <a href="#features" className="hover:text-white transition">
            Architecture
          </a>
          <a href="#benchmarks" className="hover:text-white transition">
            Throughput
          </a>
          <a href="#comparison" className="hover:text-white transition">
            Comparison
          </a>
          <a href="#faq" className="hover:text-white transition">
            FAQ
          </a>
        </nav>

        {/* CTA to Full Studio Page */}
        <button
          onClick={onLaunchStudio}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded-md text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <span>Launch Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mb-20 pt-20 pb-16 px-6 lg:px-12 max-w-5xl mx-auto text-center select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12141a] border border-neutral-800 text-xs text-neutral-300 mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px] text-neutral-400">Vellum Infrastructure</span>
          <span className="text-neutral-600">•</span>
          <span>Engineered for Bulk Credentialing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white max-w-3xl mx-auto leading-[1.1]">
          The Precision Engine for Dynamic Certificates
        </h1>

        <p className="mt-5 text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Place textboxes visually on your universal certificate, bind your spreadsheet columns, and generate hundreds of 300 DPI vector PDFs in seconds.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded-lg text-xs font-semibold shadow-md transition active:scale-95"
          >
            <span>Launch Full Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href="#demo"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#12141a] hover:bg-[#181b24] text-neutral-300 rounded-lg text-xs font-medium border border-neutral-800 transition shadow-sm"
          >
            <span>Test Interactive Sandbox ↓</span>
          </a>
        </div>
      </section>

      {/* SECTION 1: Interactive Preview Sandbox (Solid Opaque Card Container) */}
      <section id="demo" className="relative z-10 scroll-mt-16 px-6 lg:px-12 max-w-5xl mx-auto pb-20 w-full select-none">
        <div className="rounded-xl border border-neutral-800 bg-[#0e1015] overflow-hidden shadow-2xl">
          {/* Top Window Bar (Solid) */}
          <div className="h-11 px-4 bg-[#14161e] border-b border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              </div>
              <span className="text-[11px] font-mono text-neutral-300 ml-2">
                Interactive Preview Sandbox (Read-Only Demo)
              </span>
            </div>

            <button
              onClick={onLaunchStudio}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-200 text-neutral-950 rounded text-xs font-semibold shadow-sm transition"
            >
              <span>Open Studio to Export</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Sandbox Controls Bar (Solid) */}
          <div className="p-3 bg-[#11131a] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-[11px] font-medium">Recipient:</span>
              <input
                type="text"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                placeholder="Recipient name..."
                className="bg-[#090a0d] border border-neutral-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-white shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-[11px] font-medium">Design Style:</span>
              <div className="flex items-center gap-1 bg-[#090a0d] p-0.5 rounded border border-neutral-800">
                <button
                  onClick={() => setDemoTheme('gold')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${demoTheme === 'gold' ? 'bg-[#1e222e] text-amber-300' : 'text-neutral-400'}`}
                >
                  Classic Gold
                </button>
                <button
                  onClick={() => setDemoTheme('blue')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${demoTheme === 'blue' ? 'bg-[#1e222e] text-blue-300' : 'text-neutral-400'}`}
                >
                  Tech Blue
                </button>
                <button
                  onClick={() => setDemoTheme('minimal')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${demoTheme === 'minimal' ? 'bg-[#1e222e] text-neutral-200' : 'text-neutral-400'}`}
                >
                  Minimalist
                </button>
              </div>
            </div>

            {/* Locked Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowExportTeaser(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#181a24] hover:bg-[#202330] text-neutral-300 rounded text-xs font-medium border border-neutral-700 transition"
              >
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>Export ZIP</span>
              </button>
              <button
                onClick={() => setShowExportTeaser(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#181a24] hover:bg-[#202330] text-neutral-300 rounded text-xs font-medium border border-neutral-700 transition"
              >
                <Cloud className="w-3 h-3 text-neutral-400" />
                <span>Drive Sync</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Preview Canvas (Solid Background Underneath Canvas) */}
          <div className="p-8 bg-[#090a0d] dot-grid min-h-[420px] flex items-center justify-center relative">
            <div
              className={`w-full max-w-xl aspect-[16/9] rounded-lg border p-8 relative shadow-2xl flex flex-col justify-between transition-all duration-300 ${
                demoTheme === 'gold'
                  ? 'bg-gradient-to-br from-[#0a0d14] via-[#0f172a] to-[#090d16] border-amber-500/30'
                  : demoTheme === 'blue'
                  ? 'bg-gradient-to-br from-[#030712] via-[#0b1329] to-[#090d16] border-blue-500/30'
                  : 'bg-[#fafaf9] text-neutral-900 border-neutral-300'
              }`}
            >
              <div
                className={`absolute inset-2 border rounded pointer-events-none ${
                  demoTheme === 'minimal' ? 'border-neutral-300' : 'border-white/10'
                }`}
              />

              <div className="text-center">
                <p
                  className={`text-[10px] uppercase font-mono tracking-widest ${
                    demoTheme === 'minimal' ? 'text-neutral-500' : 'text-amber-400/90'
                  }`}
                >
                  CERTIFICATE OF ACHIEVEMENT
                </p>
                <p
                  className={`text-[10px] tracking-wider mt-0.5 ${
                    demoTheme === 'minimal' ? 'text-neutral-400' : 'text-neutral-400'
                  }`}
                >
                  THIS IS PROUDLY CONFERRED UPON
                </p>
              </div>

              <div className="text-center my-auto py-2">
                <p
                  className={`text-3xl font-serif italic ${
                    demoTheme === 'minimal' ? 'text-neutral-900 font-bold' : 'text-white'
                  }`}
                >
                  {demoName || 'Recipient Name'}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    demoTheme === 'minimal' ? 'text-neutral-600' : 'text-neutral-300'
                  }`}
                >
                  {demoCourse}
                </p>
              </div>

              <div
                className={`flex justify-between items-center text-[10px] font-mono border-t pt-2 ${
                  demoTheme === 'minimal' ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-500'
                }`}
              >
                <span>DATE: {demoDate}</span>
                <span>CERT-2026-98124</span>
              </div>
            </div>

            {/* Modal Prompt when user tries to export from Preview Sandbox (Solid Opaque) */}
            {showExportTeaser && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-20 animate-in fade-in duration-150">
                <div className="bg-[#0e1015] border border-neutral-700 rounded-xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#161922] border border-neutral-700 flex items-center justify-center mx-auto text-neutral-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Full Studio Features Required</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      You are in the preview sandbox. To upload your own universal certificates, import spreadsheets, and batch-export PDFs or sync to Google Drive, open the full Vellum Studio.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => setShowExportTeaser(false)}
                      className="px-3.5 py-1.5 bg-[#161922] hover:bg-[#1f2330] text-neutral-300 border border-neutral-700 rounded text-xs transition"
                    >
                      Close Preview
                    </button>
                    <button
                      onClick={onLaunchStudio}
                      className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Open Full Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: Workflow Walkthrough (Solid Cards with Zero Grid Bleed) */}
      <section id="walkthrough" className="relative z-10 scroll-mt-16 py-20 px-6 lg:px-12 max-w-5xl mx-auto border-t border-neutral-800 w-full select-none">
        <div className="text-left mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0e1015] border border-neutral-800 text-[11px] font-mono text-neutral-400 mb-2 shadow-sm">
            <Workflow className="w-3.5 h-3.5 text-neutral-300" />
            <span>Workflow Walkthrough</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Four steps from blank canvas to verified certificates
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            A frictionless, in-browser pipeline designed for operational speed, typography control, and batch reliability.
          </p>
        </div>

        {/* 4 Solid Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((st, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-xl border text-left cursor-pointer transition shadow-lg ${
                  isSelected
                    ? 'bg-[#12151e] border-neutral-600 ring-1 ring-neutral-600'
                    : 'bg-[#0e1015] border-neutral-800 hover:border-neutral-700 hover:bg-[#11131a]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-neutral-400">
                    STEP {st.step}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-300 bg-[#181a24] px-2 py-0.5 rounded border border-neutral-700">
                    {st.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-2">
                  {st.title}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  {st.summary}
                </p>

                <div className="space-y-1.5 border-t border-neutral-800/80 pt-3">
                  {st.details.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-[11px] text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Action Callout (Solid) */}
        <div className="mt-8 p-4 rounded-xl bg-[#0e1015] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 text-xs text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Ready to test the workflow with your own template and CSV list?</span>
          </div>
          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded text-xs transition shadow-sm"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* SECTION 3: Feature Architecture Bento (Solid Cards) */}
      <section id="features" className="relative z-10 scroll-mt-16 py-20 px-6 lg:px-12 max-w-5xl mx-auto border-t border-neutral-800 w-full select-none">
        <div className="text-left mb-10">
          <p className="text-[11px] font-mono uppercase text-neutral-500 tracking-wider">Architecture</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mt-1">
            Engineered for High-Throughput Production
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0e1015] border border-neutral-800 shadow-md">
            <Layers className="w-5 h-5 text-neutral-300 mb-3" />
            <h3 className="text-xs font-semibold text-white mb-1.5">Canvas Precision</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Figma-style drag, snap, and 8-point resize handles with sub-pixel coordinate accuracy.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0e1015] border border-neutral-800 shadow-md">
            <Type className="w-5 h-5 text-neutral-300 mb-3" />
            <h3 className="text-xs font-semibold text-white mb-1.5">Typography Registry</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Load custom brand .ttf and .otf binaries directly into browser memory for vector embedding.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0e1015] border border-neutral-800 shadow-md">
            <Maximize2 className="w-5 h-5 text-neutral-300 mb-3" />
            <h3 className="text-xs font-semibold text-white mb-1.5">Auto-Fit Scaling</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dynamically scales down long recipient names in real time to prevent clipping.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0e1015] border border-neutral-800 shadow-md">
            <FileSpreadsheet className="w-5 h-5 text-neutral-300 mb-3" />
            <h3 className="text-xs font-semibold text-white mb-1.5">Spreadsheet Ingestion</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Parse Excel and CSV files in milliseconds. Instant mapping to template variables.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0e1015] border border-neutral-800 shadow-md">
            <Cloud className="w-5 h-5 text-blue-400 mb-3" />
            <h3 className="text-xs font-semibold text-white mb-1.5">Drive Cloud Pipeline</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Scoped Google OAuth 2.0 streaming directly to your selected organizational Drive folders.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0e1015] border border-neutral-800 shadow-md">
            <Download className="w-5 h-5 text-neutral-300 mb-3" />
            <h3 className="text-xs font-semibold text-white mb-1.5">Vector PDF &amp; ZIP</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Genuine 300 DPI vector documents packaged into clean, organized zip archives.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Benchmarks / Calculator (Solid) */}
      <section id="benchmarks" className="relative z-10 scroll-mt-16 py-20 px-6 lg:px-12 max-w-4xl mx-auto border-t border-neutral-800 w-full select-none">
        <div className="bg-[#0e1015] p-8 rounded-2xl border border-neutral-800 text-center shadow-xl">
          <p className="text-[11px] font-mono uppercase text-neutral-500 tracking-wider mb-1">
            Throughput Calculator
          </p>
          <h2 className="text-2xl font-semibold text-white">Compare Operational Speed</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            Adjust the participant slider to simulate batch generation times.
          </p>

          <div className="my-8 max-w-lg mx-auto">
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-2">
              <span>Recipients</span>
              <span className="font-bold text-white">{participantsCount} attendees</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={participantsCount}
              onChange={(e) => setParticipantsCount(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5 bg-[#181a24] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-[#090a0d] border border-neutral-800">
              <p className="text-[11px] text-neutral-500">Manual / Word Merge</p>
              <p className="text-xl font-mono font-bold text-neutral-300 mt-1">{manualHours} hrs</p>
            </div>
            <div className="p-4 rounded-lg bg-[#141722] border border-neutral-700 shadow-md">
              <p className="text-[11px] text-neutral-300 font-medium">Vellum Vector Engine</p>
              <p className="text-xl font-mono font-bold text-white mt-1">{vellumSeconds} sec</p>
            </div>
            <div className="p-4 rounded-lg bg-[#090a0d] border border-neutral-800">
              <p className="text-[11px] text-neutral-500">Operational Savings</p>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-1">${costSavings}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Feature Comparison (Solid Table) */}
      <section id="comparison" className="relative z-10 scroll-mt-16 py-20 px-6 lg:px-12 max-w-5xl mx-auto border-t border-neutral-800 w-full select-none">
        <div className="text-left mb-8">
          <p className="text-[11px] font-mono uppercase text-neutral-500 tracking-wider">Feature Matrix</p>
          <h2 className="text-2xl font-semibold text-white tracking-tight mt-1">Built specifically for bulk document operations</h2>
        </div>

        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-[#0e1015] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-[#12141c] text-neutral-400 border-b border-neutral-800 text-[11px]">
                  <th className="p-3.5 font-medium">Capability</th>
                  <th className="p-3.5 font-medium text-white">Vellum</th>
                  <th className="p-3.5 font-medium">Adobe / Canva</th>
                  <th className="p-3.5 font-medium">Legacy Mail-Merge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                <tr className="bg-[#0e1015]">
                  <td className="p-3.5 text-white font-medium">Auto-Fit String Width</td>
                  <td className="p-3.5 text-emerald-400 font-mono text-[11px] font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Built-In</td>
                  <td className="p-3.5 text-neutral-500">Manual inspection</td>
                  <td className="p-3.5 text-neutral-500">Text clips or wraps</td>
                </tr>
                <tr className="bg-[#0e1015]">
                  <td className="p-3.5 text-white font-medium">Direct Google Drive Sync</td>
                  <td className="p-3.5 text-emerald-400 font-mono text-[11px] font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> OAuth 2.0 API</td>
                  <td className="p-3.5 text-neutral-500">Manual upload</td>
                  <td className="p-3.5 text-neutral-500">Not supported</td>
                </tr>
                <tr className="bg-[#0e1015]">
                  <td className="p-3.5 text-white font-medium">Client-Side Vector Engine</td>
                  <td className="p-3.5 text-emerald-400 font-mono text-[11px] font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Zero Server Latency</td>
                  <td className="p-3.5 text-neutral-500">Server queuing</td>
                  <td className="p-3.5 text-neutral-500">Desktop only</td>
                </tr>
                <tr className="bg-[#0e1015]">
                  <td className="p-3.5 text-white font-medium">Custom Binary Fonts (.ttf/.otf)</td>
                  <td className="p-3.5 text-emerald-400 font-mono text-[11px] font-medium flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Native FontFace</td>
                  <td className="p-3.5 text-neutral-500">Paid tier required</td>
                  <td className="p-3.5 text-neutral-500">System install only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 6: Documentation FAQ (Solid Cards) */}
      <section id="faq" className="relative z-10 scroll-mt-16 py-20 px-6 lg:px-12 max-w-3xl mx-auto border-t border-neutral-800 w-full select-none">
        <div className="text-left mb-8">
          <p className="text-[11px] font-mono uppercase text-neutral-500 tracking-wider">Documentation</p>
          <h2 className="text-2xl font-semibold text-white tracking-tight mt-1">Frequently Answered Questions</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-[#0e1015] border border-neutral-800 rounded-lg overflow-hidden transition shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-medium text-neutral-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3 bg-[#0a0b0e]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner (Solid) */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-4xl mx-auto text-center border-t border-neutral-800 select-none">
        <div className="bg-[#0e1015] p-10 rounded-2xl border border-neutral-800 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Deploy your credentialing pipeline in minutes
          </h2>
          <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
            Ready to generate certificates? Open Vellum Studio with all tools unlocked.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onLaunchStudio}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-200 text-neutral-950 rounded-lg text-xs font-semibold shadow-md transition active:scale-95"
            >
              <span>Launch Vellum Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Footer (Solid) */}
      <footer className="relative z-10 border-t border-neutral-800 bg-[#0e1015] py-10 px-6 lg:px-12 text-xs text-neutral-500 mt-auto select-none">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2">
            <VellumLogo className="w-4 h-4" showText={true} subtitle="Precision Certificate Infrastructure" />
          </a>

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Client Render Sandbox Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

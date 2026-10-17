import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { X, Upload, FileSpreadsheet, Download, Sparkles, AlertCircle, CheckCircle2, UserPlus, Trash2 } from 'lucide-react';
import { SAMPLE_RECIPIENTS } from '../utils/sampleCertificates';

export default function DataModal({
  isOpen,
  onClose,
  records,
  onSaveRecords
}) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [localRecords, setLocalRecords] = useState(records || []);

  // Quick Manual Add Form State
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCourse, setManualCourse] = useState('Advanced Full-Stack Engineering & Cloud Architecture');
  const [manualDate, setManualDate] = useState('October 17, 2026');
  const [manualId, setManualId] = useState('');

  useEffect(() => {
    setLocalRecords(records || []);
  }, [records]);

  if (!isOpen) return null;

  const commitRecords = (newRecords, sourceLabel) => {
    setLocalRecords(newRecords);
    onSaveRecords(newRecords);
    setErrorMsg('');
    setSuccessMsg(`Successfully loaded ${newRecords.length} records (${sourceLabel})`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddManualRow = (e) => {
    e?.preventDefault();
    if (!manualName.trim()) {
      setErrorMsg('Recipient Full Name is required.');
      return;
    }

    const nextId = manualId.trim() || `VLM-2026-${String(localRecords.length + 1).padStart(4, '0')}`;
    const newEntry = {
      'Full_Name': manualName.trim(),
      'Course_Name': manualCourse.trim(),
      'Date': manualDate.trim(),
      'Certificate_ID': nextId
    };

    const updated = [...localRecords, newEntry];
    commitRecords(updated, `Added "${manualName.trim()}"`);
    setManualName('');
    setManualId('');
    setShowManualForm(false);
  };

  const handleDeleteRow = (indexToDelete) => {
    const updated = localRecords.filter((_, idx) => idx !== indexToDelete);
    commitRecords(updated, 'Deleted record');
  };

  const processExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (json.length === 0) {
          setErrorMsg('The uploaded Excel sheet contains no rows.');
          return;
        }
        commitRecords(json, file.name);
      } catch (err) {
        setErrorMsg('Failed to parse Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processCsv = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setErrorMsg('The CSV file is empty.');
          return;
        }
        commitRecords(results.data, file.name);
      },
      error: (err) => {
        setErrorMsg('Failed to parse CSV: ' + err.message);
      }
    });
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'xlsx' || ext === 'xls') {
      processExcel(file);
    } else if (ext === 'csv') {
      processCsv(file);
    } else {
      setErrorMsg('Please upload a valid .xlsx or .csv spreadsheet.');
    }
  };

  const generate50TestParticipants = () => {
    const FIRST_NAMES = [
      'Alexander', 'Elena', 'Marcus', 'Sophia', 'David', 'Zara', 'Liam', 'Aria', 'Ethan', 'Chloe',
      'Noah', 'Amara', 'Lucas', 'Maya', 'Mason', 'Olivia', 'James', 'Isabella', 'Benjamin', 'Mia'
    ];
    const LAST_NAMES = [
      'Sterling', 'Vance', 'Chen', 'Al-Mansoor', "O'Connor", 'Kowalski', 'Dubois', 'Nakamura',
      'Patel', 'Kim', 'Santos', 'Meyer', 'Fischer', 'Johansson', 'Reyes', 'Montgomery', 'Sinclair'
    ];
    const COURSES = [
      'Full-Stack Cloud Infrastructure Fellowship',
      'Advanced Distributed Systems & Microservices',
      'Modern AI & Systems Architecture Summit',
      'Cybersecurity & Network Defense Bootcamp'
    ];

    const generated = [];
    for (let i = 1; i <= 50; i++) {
      const fName = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
      const course = COURSES[i % COURSES.length];
      generated.push({
        'Full_Name': `${fName} ${lName}`,
        'Course_Name': course,
        'Date': 'October 17, 2026',
        'Certificate_ID': `VLM-2026-${String(i).padStart(4, '0')}`
      });
    }

    commitRecords(generated, '50 Generated Test Participants');
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Full_Name,Course_Name,Date,Certificate_ID\n' +
      'Alexander Hayes,Mastering Full-Stack Architecture,October 17 2026,VLM-2026-0001\n' +
      'Samantha Vance,Mastering Full-Stack Architecture,October 17 2026,VLM-2026-0002\n' +
      "Liam O'Connor,Mastering Full-Stack Architecture,October 17 2026,VLM-2026-0003\n" +
      'Elena Montgomery,Mastering Full-Stack Architecture,October 17 2026,VLM-2026-0004';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vellum_sample_attendees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = localRecords.length > 0 ? Object.keys(localRecords[0]) : [];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-[#0c0d0e] border border-neutral-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Dataset Ingestion &amp; Mapping</h3>
              <p className="text-[11px] text-neutral-400">Upload attendee files, generate batches, or add manually</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`border border-dashed rounded-xl p-5 text-center transition flex flex-col items-center justify-center ${
              dragActive ? 'border-neutral-400 bg-neutral-900/60' : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
            }`}
          >
            <Upload className="w-5 h-5 text-neutral-400 mb-1.5" />
            <p className="text-xs font-semibold text-neutral-200">
              Drag &amp; drop an Excel (.xlsx) or CSV file
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5 mb-2.5">
              Spreadsheet columns automatically map to variables like &#123;&#123;Full_Name&#125;&#125;
            </p>
            <label className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded cursor-pointer transition border border-neutral-700">
              Browse Spreadsheet
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
            </label>
          </div>

          {/* Action Row: Sample 5, Generate 50, Add Manually */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => commitRecords(SAMPLE_RECIPIENTS, '5 Sample Recipients')}
                className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded text-xs font-medium transition"
              >
                Sample 5
              </button>

              <button
                type="button"
                onClick={generate50TestParticipants}
                className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded text-xs font-semibold transition active:scale-95 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate 50 Test Records</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualForm(!showManualForm)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition border ${
                  showManualForm
                    ? 'bg-white text-neutral-950 border-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Manually</span>
              </button>
            </div>

            <button
              type="button"
              onClick={downloadSampleCsv}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
          </div>

          {/* Inline Manual Form Drawer */}
          {showManualForm && (
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-200">
                  New Certificate Recipient
                </span>
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="text-neutral-500 hover:text-neutral-300 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Dr. Jordan Vance"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Course / Award</label>
                  <input
                    type="text"
                    value={manualCourse}
                    onChange={(e) => setManualCourse(e.target.value)}
                    placeholder="Course name..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">Certificate ID</label>
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder={`VLM-2026-${String(localRecords.length + 1).padStart(4, '0')}`}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddManualRow}
                  className="px-3.5 py-1 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded text-xs transition"
                >
                  Add Recipient to List
                </button>
              </div>
            </div>
          )}

          {/* Table Preview */}
          {localRecords.length > 0 ? (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-200 flex items-center gap-2">
                  <span>Loaded Dataset</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {localRecords.length} records ready
                  </span>
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {headers.length} columns detected
                </span>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden max-h-52 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 text-neutral-400 font-medium border-b border-neutral-800 sticky top-0">
                      <th className="p-2 w-10 text-center">#</th>
                      {headers.map((h, i) => (
                        <th key={i} className="p-2 border-l border-neutral-800 font-mono text-[10px] text-neutral-300">
                          &#123;&#123;{h}&#125;&#125;
                        </th>
                      ))}
                      <th className="p-2 w-10 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localRecords.slice(0, 15).map((r, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-neutral-800/50 hover:bg-neutral-900/40">
                        <td className="p-2 text-center text-neutral-600 font-mono text-[10px]">{rowIdx + 1}</td>
                        {headers.map((h, colIdx) => (
                          <td key={colIdx} className="p-2 border-l border-neutral-800/50 text-neutral-300 truncate max-w-[150px]">
                            {String(r[h] || '')}
                          </td>
                        ))}
                        <td className="p-2 text-center border-l border-neutral-800/50">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(rowIdx)}
                            title="Delete this record"
                            className="p-1 text-neutral-500 hover:text-red-400 rounded transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {localRecords.length > 15 && (
                <p className="text-[10px] text-neutral-500 text-center mt-1.5 font-mono">
                  Showing first 15 of {localRecords.length} records. All {localRecords.length} are in memory and ready for batch generation.
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-neutral-500 border border-neutral-800/80 rounded-lg bg-neutral-950/40">
              <p className="text-xs">No records loaded yet. Upload a file or click "Generate 50 Test Records" above.</p>
            </div>
          )}
        </div>

        {/* Footer with Explicit Apply Button */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            {localRecords.length} certificates in queue
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded text-xs font-semibold transition"
          >
            Apply &amp; Return to Canvas
          </button>
        </div>
      </div>
    </div>
  );
}

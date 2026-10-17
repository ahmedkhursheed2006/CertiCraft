import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { X, Upload, FileSpreadsheet, Download, Check, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_RECIPIENTS } from '../utils/sampleCertificates';

export default function DataModal({
  isOpen,
  onClose,
  records,
  onSaveRecords
}) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handles .xlsx / .xls parsing
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
        onSaveRecords(json);
        setErrorMsg('');
        onClose();
      } catch (err) {
        setErrorMsg('Failed to parse Excel file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handles .csv parsing
  const processCsv = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setErrorMsg('The uploaded CSV file is empty.');
          return;
        }
        onSaveRecords(results.data);
        setErrorMsg('');
        onClose();
      },
      error: (err) => {
        setErrorMsg('Failed to parse CSV file: ' + err.message);
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
      setErrorMsg('Please upload a valid .xlsx, .xls, or .csv spreadsheet.');
    }
  };

  // Quick generator for 50 realistic test participants
  const generate50TestParticipants = () => {
    const FIRST_NAMES = ['Elena', 'Marcus', 'Sophia', 'David', 'Zara', 'Liam', 'Aria', 'Ethan', 'Chloe', 'Noah', 'Amara', 'Lucas', 'Maya', 'Mason', 'Olivia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Henry'];
    const LAST_NAMES = ['Sterling', 'Vance', 'Chen', 'Al-Mansoor', 'O\'Connor', 'Kowalski', 'Dubois', 'Nakamura', 'Patel', 'Kim', 'Santos', 'Meyer', 'Fischer', 'Johansson', 'Reyes'];
    const generated = [];

    for (let i = 1; i <= 50; i++) {
      const fName = FIRST_NAMES[i % FIRST_NAMES.length];
      const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
      generated.push({
        'Full_Name': `${fName} ${lName}`,
        'Course_Name': 'Advanced Full-Stack Engineering & Cloud Architecture',
        'Date': 'October 17, 2026',
        'Certificate_ID': `CERT-2026-${String(i).padStart(4, '0')}`
      });
    }
    onSaveRecords(generated);
    onClose();
  };

  // Download sample CSV template
  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Full_Name,Course_Name,Date,Certificate_ID\n" +
      "Alexander Hayes,Mastering Full-Stack Architecture,October 17 2026,CERT-2026-001\n" +
      "Samantha Vance,Mastering Full-Stack Architecture,October 17 2026,CERT-2026-002\n" +
      "Liam O'Connor,Mastering Full-Stack Architecture,October 17 2026,CERT-2026-003";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certificate_sample_participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Dynamic Data Ingestion</h3>
              <p className="text-xs text-slate-400">Upload your Excel or CSV file to batch generate certificates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition flex flex-col items-center justify-center cursor-pointer ${
              dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
            }`}
          >
            <Upload className="w-8 h-8 text-emerald-400 mb-2" />
            <p className="text-sm font-semibold text-slate-200">
              Drag &amp; drop your .xlsx or .csv file here
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Columns will automatically match variable tags like &#123;&#123;Full_Name&#125;&#125;
            </p>
            <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition border border-slate-700">
              Browse Files
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

          {/* Quick Test Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSaveRecords(SAMPLE_RECIPIENTS);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample 5 Recipients</span>
              </button>

              <button
                onClick={generate50TestParticipants}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 50 Test Participants</span>
              </button>
            </div>

            <button
              onClick={downloadSampleCsv}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download sample CSV template</span>
            </button>
          </div>

          {/* Current Loaded Data Preview */}
          {records.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Currently Loaded Data ({records.length} records)
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {headers.length} columns detected
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
                      <th className="p-2 w-10 text-center">#</th>
                      {headers.map((h, i) => (
                        <th key={i} className="p-2 border-l border-slate-800/60 font-mono text-[11px] text-indigo-300">
                          &#123;&#123;{h}&#125;&#125;
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 8).map((r, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-2 text-center text-slate-500 font-mono text-[10px]">{rowIdx + 1}</td>
                        {headers.map((h, colIdx) => (
                          <td key={colIdx} className="p-2 border-l border-slate-800/50 text-slate-300 truncate max-w-[150px]">
                            {String(r[h] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {records.length > 8 && (
                <p className="text-[11px] text-slate-500 text-center mt-1.5">
                  Showing first 8 of {records.length} records
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

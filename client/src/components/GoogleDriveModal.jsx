import React, { useState, useEffect } from 'react';
import { X, Cloud, CheckCircle, FolderPlus, Folder, Loader2, ShieldCheck, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import { renderCertificateCanvas, canvasToPdfBytes, formatFilename, loadImage } from '../utils/exportGenerator';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export default function GoogleDriveModal({
  isOpen,
  onClose,
  template,
  elements,
  records,
  currentRecord
}) {
  const [authStatus, setAuthStatus] = useState({
    isConnected: false,
    user: null,
    token: null
  });
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('folder_certs_2026');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [uploadSuccess, setUploadSuccess] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('vellum_gdrive_token');
    const savedUser = localStorage.getItem('vellum_gdrive_user');
    if (savedToken && savedUser) {
      try {
        setAuthStatus({
          isConnected: true,
          token: savedToken,
          user: JSON.parse(savedUser)
        });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (authStatus.isConnected) {
      fetchFolders();
    }
  }, [authStatus.isConnected]);

  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/drive/folders`, {
        headers: {
          Authorization: `Bearer ${authStatus.token || 'demo-token'}`
        }
      });
      const data = await res.json();
      if (data.folders) {
        setFolders(data.folders);
        if (data.folders.length > 0 && !selectedFolderId) {
          setSelectedFolderId(data.folders[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  const handleConnectGoogle = async () => {
    const mockUser = {
      name: 'Ahmed Khursheed',
      email: 'ahmed.khursheed@googlemail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    const mockToken = 'gdrive_oauth_token_' + Date.now();

    localStorage.setItem('vellum_gdrive_token', mockToken);
    localStorage.setItem('vellum_gdrive_user', JSON.stringify(mockUser));

    setAuthStatus({
      isConnected: true,
      token: mockToken,
      user: mockUser
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('vellum_gdrive_token');
    localStorage.removeItem('vellum_gdrive_user');
    setAuthStatus({ isConnected: false, token: null, user: null });
    setUploadSuccess(null);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    try {
      const res = await fetch(`${API_BASE}/api/drive/create-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStatus.token || 'demo-token'}`
        },
        body: JSON.stringify({ folderName: newFolderName.trim() })
      });
      const data = await res.json();
      if (data.folder) {
        setFolders((prev) => [data.folder, ...prev]);
        setSelectedFolderId(data.folder.id);
        setNewFolderName('');
      }
    } catch (err) {
      alert('Failed to create folder: ' + err.message);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleBatchUploadToDrive = async () => {
    setIsUploading(true);
    setUploadSuccess(null);

    const dataset = records.length > 0 ? records : [currentRecord || { 'Full_Name': 'Sample_Recipient' }];
    const total = dataset.length;
    const bgImg = template.backgroundUrl ? await loadImage(template.backgroundUrl) : null;
    const filesToUpload = [];

    try {
      for (let i = 0; i < total; i++) {
        const record = dataset[i];
        const canvas = await renderCertificateCanvas(bgImg, elements, record, template.width, template.height);
        const filename = formatFilename('{{Full_Name}}_Certificate', record, i, 'pdf');

        setUploadProgress({
          current: i + 1,
          total,
          currentName: filename
        });

        const pdfBytes = await canvasToPdfBytes(canvas);
        let binary = '';
        const bytes = new Uint8Array(pdfBytes);
        for (let b = 0; b < bytes.byteLength; b++) {
          binary += String.fromCharCode(bytes[b]);
        }
        const base64Data = btoa(binary);

        filesToUpload.push({
          filename,
          base64Data,
          mimeType: 'application/pdf'
        });

        await new Promise((r) => setTimeout(r, 10));
      }

      const selectedFolder = folders.find((f) => f.id === selectedFolderId);
      const res = await fetch(`${API_BASE}/api/drive/upload-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStatus.token || 'demo-token'}`
        },
        body: JSON.stringify({
          folderId: selectedFolderId,
          folderName: selectedFolder ? selectedFolder.name : 'Certificates 2026',
          files: filesToUpload
        })
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccess({
          count: data.count,
          folderName: data.folderName,
          files: data.files
        });
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-[#0c0d0e] border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-blue-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">Google Workspace Connector</h3>
              <p className="text-[11px] text-neutral-400">Stream batch certificates to Google Drive</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!authStatus.isConnected ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto">
                <Cloud className="w-6 h-6 text-neutral-300" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-100">Authorize Google Drive Access</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Connect your Google account to automatically organize generated certificates into your chosen Drive folders.
                </p>
              </div>

              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/80 text-left text-xs text-neutral-400 space-y-1">
                <div className="flex items-center gap-2 text-neutral-300 font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Scoped Permission (`drive.file`)</span>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Vellum only reads and writes files created specifically through this application.
                </p>
              </div>

              <button
                onClick={handleConnectGoogle}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white hover:bg-neutral-200 text-neutral-950 rounded text-xs font-semibold shadow-sm transition active:scale-98"
              >
                <span>Authorize &amp; Sign in with Google</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account Badge */}
              <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold flex items-center justify-center text-xs">
                    {authStatus.user?.name ? authStatus.user.name[0] : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-neutral-200">{authStatus.user?.name}</p>
                      <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60 font-mono">
                        Active
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-mono">{authStatus.user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  title="Disconnect Google Account"
                  className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Folder Selector */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1.5">
                  Target Destination Folder
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {folders.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFolderId(f.id)}
                      className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer transition ${
                        selectedFolderId === f.id
                          ? 'bg-neutral-800 border-neutral-600 text-white'
                          : 'bg-neutral-950 border-neutral-800/80 text-neutral-400 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      {selectedFolderId === f.id && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  ))}
                </div>

                {/* Inline Folder Creation */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name..."
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                  />
                  <button
                    onClick={handleCreateFolder}
                    disabled={isCreatingFolder || !newFolderName.trim()}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 rounded text-xs font-medium border border-neutral-700 flex items-center gap-1"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Create</span>
                  </button>
                </div>
              </div>

              {/* Progress */}
              {isUploading && (
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Streaming to Google Drive...
                    </span>
                    <span className="font-mono text-neutral-400">
                      {uploadProgress.total > 0
                        ? Math.round((uploadProgress.current / uploadProgress.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-150"
                      style={{
                        width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate font-mono">
                    {uploadProgress.currentName} ({uploadProgress.current}/{uploadProgress.total})
                  </p>
                </div>
              )}

              {/* Success */}
              {uploadSuccess && (
                <div className="p-3 bg-neutral-950 border border-neutral-700 rounded space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Upload Completed</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Saved {uploadSuccess.count} certificates into folder: <span className="font-mono text-white">"{uploadSuccess.folderName}"</span>.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <p className="text-[10px] text-neutral-500 font-mono">
            {records.length > 0 ? `${records.length} records ready` : '1 certificate ready'}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded text-xs border border-neutral-800 transition"
            >
              Close
            </button>

            {authStatus.isConnected && (
              <button
                onClick={handleBatchUploadToDrive}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-neutral-950 rounded text-xs font-semibold shadow-sm transition active:scale-98 disabled:opacity-40"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                <span>Stream to Folder</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

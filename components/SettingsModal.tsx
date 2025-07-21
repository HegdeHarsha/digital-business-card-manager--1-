
import React, { useState, useEffect, useCallback } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { XIcon } from './icons';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { sheetUrl, setSheetUrl } = useEmployees();
  const [currentUrl, setCurrentUrl] = useState(sheetUrl);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleConnectSheet = () => {
    setSheetUrl(currentUrl);
    handleClose();
  };
  
  const handleUseLocalStorage = () => {
    setSheetUrl('');
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    setCurrentUrl(sheetUrl);
  }, [sheetUrl]);

  const animationClasses = isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100';

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className={`w-full max-w-2xl bg-white rounded-lg shadow-xl transform transition-all duration-300 ${animationClasses}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200" aria-label="Close settings">
            <XIcon className="w-6 h-6 text-gray-500" />
          </button>
          <h2 id="settings-title" className="text-2xl font-bold text-brand-dark">Data Source Settings</h2>
          <p className="mt-2 text-gray-600">
            Choose your data source. This determines how you manage employee cards.
          </p>

          <div className="mt-6 space-y-6">
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg text-brand-dark">Live Mode (Recommended for Teams)</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Connect a Google Sheet as the single source of truth. The app will display cards from the sheet. All edits must be made directly in the Google Sheet, then synced here.
                </p>
                <div className="mt-4">
                    <label htmlFor="sheet-url" className="block text-sm font-medium text-gray-700">
                        Google Sheet Public CSV URL
                    </label>
                    <input
                    type="url"
                    id="sheet-url"
                    name="sheet-url"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Paste your published sheet URL here..."
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        To get this URL: in Google Sheets, go to File &gt; Share &gt; Publish to web, and publish as a CSV.
                    </p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleConnectSheet}
                        disabled={!currentUrl.trim()}
                        className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-primary text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Connect Sheet &amp; Use Live Mode
                    </button>
                </div>
            </div>

            <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-brand-dark">Manual Mode</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Manage cards manually within this application. All data is stored in your browser's local storage. Best for single-user or testing purposes.
                </p>
                <div className="mt-4">
                    <button
                        onClick={handleUseLocalStorage}
                        className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Switch to Manual Mode (Local Storage)
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;


import React, { useState, useEffect } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import EmployeeCard from '../components/EmployeeCard';
import { Employee } from '../types';
import { PhoneIcon, MailIcon, GlobeIcon, XIcon, RefreshCwIcon } from '../components/icons';
import { QRCodeCanvas } from 'qrcode.react';

const EmployeeDetailModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = React.useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation to finish
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);

    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const ContactItem: React.FC<{ icon: React.ReactNode; text: string; link: string; }> = ({ icon, text, link }) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="text-brand-primary">{icon}</div>
            <span className="text-gray-700 break-all">{text}</span>
        </a>
    );

    const animationClasses = isClosing 
      ? 'opacity-0 scale-95'
      : 'opacity-100 scale-100';
      
    const shareUrl = `${window.location.origin}${window.location.pathname}#/view/${employee.id}`;

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${animationClasses}`}
                onClick={handleModalContentClick}
            >
                <div className="relative">
                    <button 
                        onClick={handleClose} 
                        className="absolute top-2 right-2 p-2 text-white bg-black bg-opacity-20 rounded-full hover:bg-opacity-40 z-10"
                        aria-label="Close"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    <div className="h-24 bg-brand-primary"></div>
                    <img src={employee.photoUrl} alt={employee.name} className="w-32 h-32 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-24" />
                </div>
                
                <div className="pt-20 pb-8 px-6 text-center">
                    <h1 className="text-2xl font-bold text-brand-dark">{employee.name}</h1>
                    <p className="text-gray-600">{employee.title}</p>
                    
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        {employee.logoUrl && <img src={employee.logoUrl} alt={`${employee.companyName} logo`} className="w-6 h-6 rounded-sm object-contain"/>}
                        <p className="font-semibold text-brand-dark">{employee.companyName}</p>
                    </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="space-y-2">
                        {employee.phone && <ContactItem icon={<PhoneIcon className="w-5 h-5" />} text={employee.phone} link={`tel:${employee.phone}`} />}
                        {employee.email && <ContactItem icon={<MailIcon className="w-5 h-5" />} text={employee.email} link={`mailto:${employee.email}`} />}
                        {employee.website && <ContactItem icon={<GlobeIcon className="w-5 h-5" />} text={employee.website} link={`https://${employee.website}`} />}
                    </div>
                </div>
                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center mb-4">Share Card</h3>
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-2 bg-white border rounded-lg">
                            <QRCodeCanvas 
                                value={shareUrl}
                                size={160}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                                includeMargin={false}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="share-link" className="sr-only">Shareable Link</label>
                            <input
                                id="share-link"
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md text-center"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
  const { employees, isLoading, isSheetMode, syncFromSheet, error } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  if (isLoading) {
    return <div className="text-center p-10">Loading employee data...</div>;
  }
  
  const modeInfo = isSheetMode
    ? {
        title: "Live Mode (from Google Sheet)",
        description: "Cards are live from your Google Sheet. To edit details, update the sheet and click 'Sync'."
      }
    : {
        title: "Manual Mode",
        description: "Cards are managed here and saved in your browser. All editing is done within this app."
      };

  const noDataMessage = isSheetMode
    ? 'Check your Google Sheet for data or try syncing. Ensure the sheet is published and the URL is correct.'
    : 'Get started by adding a new employee card.';

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-brand-dark">Employee Card Dashboard</h1>
             <div className="mt-2 text-sm bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-r-lg p-3 inline-block max-w-md">
                <span className="font-bold">{modeInfo.title}:</span> {modeInfo.description}
            </div>
        </div>
        {isSheetMode && (
          <button 
            onClick={syncFromSheet} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center gap-2 self-start"
          >
            <RefreshCwIcon className="w-5 h-5" />
            Sync from Sheet
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}
      
      {employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map(employee => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onCardClick={() => setSelectedEmployee(employee)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">No employee cards found.</h2>
          <p className="text-gray-500 mt-2">
            {noDataMessage}
          </p>
        </div>
      )}
      {selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;

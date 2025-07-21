

import React from 'react';
import { useParams } from 'react-router-dom';
import { useEmployees } from '../contexts/EmployeeContext';
import { PhoneIcon, MailIcon, GlobeIcon } from '../components/icons';
import { QRCodeCanvas } from 'qrcode.react';

const BusinessCardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Destructure error and isSheetMode to handle data loading failures gracefully.
  const { getEmployeeById, isLoading, error, isSheetMode } = useEmployees();

  // Directly derive the employee from the context on each render.
  const employee = id ? getEmployeeById(id) : undefined;

  // 1. Display a loading state while the initial data fetch is in progress.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-10 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold">Loading Business Card...</h2>
          <p className="text-gray-600 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // 2. NEW: If in sheet mode and an error occurred, show a specific data fetch error.
  // This is crucial for diagnosing issues with the Google Sheet URL or connection.
  if (isSheetMode && error) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="w-full max-w-lg text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">Failed to Load Data</h2>
          <p className="text-gray-600 mt-3">There was a problem loading data from the Google Sheet.</p>
          <p className="text-sm text-gray-500 mt-4 bg-gray-100 p-3 rounded-md break-words">{error}</p>
        </div>
      </div>
    );
  }

  // 3. If loading is complete and no employee matches the ID, then display "Not Found".
  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-secondary p-4">
        <div className="w-full max-w-lg text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">Employee Not Found</h2>
          <p className="text-gray-600 mt-2">The business card you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  const shareUrl = new URL(`/view/${employee.id}`, window.location.origin).href;

  const ContactItem: React.FC<{ icon: React.ReactNode; text: string; link: string; }> = ({ icon, text, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="text-brand-primary">{icon}</div>
      <span className="text-gray-700 break-all">{text}</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500">
        <div className="relative">
          <div className="h-24 bg-brand-primary"></div>
          <img src={employee.photoUrl || 'https://picsum.photos/seed/placeholder/400'} alt={employee.name} className="w-32 h-32 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-24" />
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
             {employee.website && <ContactItem icon={<GlobeIcon className="w-5 h-5" />} text={employee.website} link={!employee.website.startsWith('http') ? `https://${employee.website}` : employee.website} />}
          </div>
        </div>
         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <h3 className="text-xs text-gray-500 mb-2">Scan QR code to save contact</h3>
            <div className="inline-block p-2 bg-white border rounded-lg">
                <QRCodeCanvas 
                    value={shareUrl}
                    size={128}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardView;
import { useState } from 'react';
import { UserCertificate } from '@/db/portfolio';
import Modal from './modal';
import CertificateForm from './certificate-form';
import AIHelpSection from './ai-help-section';

interface CertificateSectionProps {
  certificates: UserCertificate[];
  onAddCertificate: (data: any) => Promise<void>;
  onDeleteCertificate: (userCertId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function CertificateSection({ 
  certificates, 
  onAddCertificate, 
  onDeleteCertificate, 
  isLoading = false 
}: CertificateSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAIHelp, setShowAIHelp] = useState(false);

  const handleSubmit = async (data: any) => {
    await onAddCertificate(data);
    setShowModal(false);
  };

  const handleDelete = async (userCertId: number) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      await onDeleteCertificate(userCertId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Certificates</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIHelp(!showAIHelp)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAIHelp ? "Hide Help" : "Get Help"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            disabled={isLoading}
          >
            + Add Certificate
          </button>
        </div>
      </div>

      <AIHelpSection type="certificates" isVisible={showAIHelp} />

      {certificates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🏆</div>
          <p>No certificates added yet. Click "Add Certificate" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.user_cert_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{cert.certificate?.cert_name}</h3>
                <button
                  onClick={() => handleDelete(cert.user_cert_id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">Issued by: {cert.certificate?.cert_provider}</p>
              <p className="text-sm text-gray-500 mb-2">Issue Date: {new Date(cert.date_obtained).toLocaleDateString()}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {cert.certificate?.cert_level}
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {cert.certificate?.cert_category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Certificate">
        <CertificateForm
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}

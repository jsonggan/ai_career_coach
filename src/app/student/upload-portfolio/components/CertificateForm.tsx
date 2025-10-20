import { useState } from 'react';

interface CertificateFormData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
}

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CertificateForm({ onSubmit, onCancel, isLoading = false }: CertificateFormProps) {
  const [formData, setFormData] = useState<CertificateFormData>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: ''
  });

  const handleSubmit = async () => {
    if (formData.name && formData.issuer && formData.issueDate) {
      await onSubmit(formData);
      setFormData({ name: '', issuer: '', issueDate: '', expiryDate: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., AWS Certified Solutions Architect"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
        <input
          type="text"
          value={formData.issuer}
          onChange={(e) => setFormData({...formData, issuer: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Amazon Web Services"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
        <input
          type="date"
          value={formData.issueDate}
          onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          disabled={isLoading || !formData.name || !formData.issuer || !formData.issueDate}
        >
          {isLoading ? 'Adding...' : 'Add Certificate'}
        </button>
      </div>
    </div>
  );
}

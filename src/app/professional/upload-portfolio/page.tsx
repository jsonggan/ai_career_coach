export default function ProfessionalUploadPortfolio() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Portfolio</h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload your professional certificates, completed courses, and project portfolios to showcase your expertise and achievements.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-500">
              This feature is under development. Soon you&apos;ll be able to upload and manage your professional portfolio here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

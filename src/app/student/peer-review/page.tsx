export default function StudentPeerReview() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Peer Review</h1>
        <p className="text-lg text-gray-600 mb-8">
          Review and get reviewed by your fellow students to improve your academic work and receive valuable feedback.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-500">
              This feature is under development. Soon you'll be able to participate in peer reviews with other students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

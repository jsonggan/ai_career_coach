export default function UserProfile() {
  const userData = {
    name: "Andrew Ng",
    title: "Computer Science and Design",
    avatar: "/avatar.png",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <img
            src={userData.avatar || "/placeholder.svg"}
            alt={userData.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            aria-label="Share"
            className="rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 p-2 shadow-sm"
            type="button"
          >
            {/* simple share icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
          </button>
          <button
            aria-label="Settings"
            className="rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 p-2 shadow-sm"
            type="button"
          >
            {/* simple settings gear icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.69 0 1.31-.39 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.3l.06.06c.51.51 1.24.66 1.88.4.64-.26 1.02-.88 1.02-1.57V2a2 2 0 1 1 4 0v.09c0 .69.39 1.31 1 1.57.64.26 1.37.11 1.88-.4l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.51.51-.66 1.24-.4 1.88.26.64.88 1.02 1.57 1.02H22a2 2 0 1 1 0 4h-.09c-.69 0-1.31.39-1.57 1.02z" />
            </svg>
          </button>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="text-gray-400">Hello </span>
            {userData.name}
          </h1>
          <p className="text-xl text-gray-600 mt-2">{userData.title}</p>
        </div>
      </div>
    </div>
  );
}

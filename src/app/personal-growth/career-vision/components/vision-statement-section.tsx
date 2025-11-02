'use client';

import { useState } from 'react';

interface VisionStatementSectionProps {
  visionStatement: string;
  onVisionChange: (vision: string) => void;
}

export default function VisionStatementSection({
  visionStatement,
  onVisionChange
}: VisionStatementSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localVision, setLocalVision] = useState(visionStatement);

  const handleSave = () => {
    onVisionChange(localVision);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalVision(visionStatement);
    setIsEditing(false);
  };

  const visionPrompts = [
    "In 5-10 years, I see myself...",
    "My ideal role would involve...", 
    "The impact I want to make is...",
    "I will be known for...",
    "My core values guide me to..."
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Vision Statement</h2>
          <p className="text-gray-600 mt-1">What do you want to become? Define your 5-10 year aspiration.</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {visionStatement ? 'Edit Vision' : 'Create Vision'}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vision Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-amber-900 mb-2">💡 Vision Statement Guidelines</h3>
        <ul className="text-amber-800 text-sm space-y-1">
          <li>• <strong>Be specific and detailed</strong> - Paint a vivid picture of your future self</li>
          <li>• <strong>Focus on values and purpose</strong> - What drives and motivates you?</li>
          <li>• <strong>5-10 year time horizon</strong> - Think long-term but achievable</li>
          <li>• <strong>Make it inspirational</strong> - Something that excites and energizes you</li>
          <li>• <strong>Make it actionable</strong> - Clear enough to guide your decisions</li>
        </ul>
      </div>

      {/* Vision Content */}
      {!isEditing && visionStatement ? (
        <div className="prose max-w-none">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🌟</div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">My Vision</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{visionStatement}</p>
              </div>
            </div>
          </div>
        </div>
      ) : !isEditing && !visionStatement ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-lg mb-2">Your vision statement will appear here</p>
          <p className="text-sm">Click "Create Vision" to get started on defining your future aspirations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Prompt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {visionPrompts.map((prompt, index) => (
              <div 
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  const textarea = document.getElementById('vision-textarea') as HTMLTextAreaElement;
                  if (textarea) {
                    textarea.value = localVision + (localVision ? '\n\n' : '') + prompt + ' ';
                    setLocalVision(textarea.value);
                    textarea.focus();
                  }
                }}
              >
                <p className="text-sm text-gray-700 font-medium">{prompt}</p>
              </div>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            id="vision-textarea"
            value={localVision}
            onChange={(e) => setLocalVision(e.target.value)}
            placeholder="Start writing your vision statement here... Describe who you want to become, what you want to achieve, and the impact you want to make. Be specific, detailed, and inspirational."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            autoFocus
          />
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Click the prompt cards above to get started</span>
            <span>{localVision.length} characters</span>
          </div>
        </div>
      )}
    </div>
  );
}

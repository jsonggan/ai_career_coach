'use client';

import { useState, useEffect } from 'react';
import { Goal, Milestone } from '../career-vision-client';

interface GoalFormProps {
  goal: Goal | null;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function GoalForm({ goal, onSave, onCancel, isLoading = false }: GoalFormProps) {
  const [formData, setFormData] = useState<Omit<Goal, 'id'>>({
    title: '',
    description: '',
    category: 'Career',
    priority: 'Medium',
    targetDate: '',
    progress: 0,
    status: 'Not Started',
    milestones: [],
    year: new Date().getFullYear()
  });

  const [milestones, setMilestones] = useState<Omit<Milestone, 'id'>[]>([]);
  const [newMilestone, setNewMilestone] = useState({ title: '', targetDate: '' });

  useEffect(() => {
    if (goal) {
      setFormData(goal);
      setMilestones(goal.milestones.map(({ id, ...rest }) => rest));
    }
  }, [goal]);

  const handleInputChange = (field: keyof Omit<Goal, 'id' | 'milestones'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.targetDate) {
      setMilestones(prev => [...prev, { ...newMilestone, completed: false }]);
      setNewMilestone({ title: '', targetDate: '' });
    }
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const milestonesWithIds: Milestone[] = milestones.map((milestone, index) => ({
      id: goal?.milestones[index]?.id || Date.now().toString() + index,
      ...milestone
    }));

    const goalToSave: Goal = {
      id: goal?.id || '',
      ...formData,
      milestones: milestonesWithIds
    };

    onSave(goalToSave);
  };

  const smartExamples = {
    'Career': {
      title: 'Get promoted to Senior Developer',
      description: 'Achieve a senior developer position by demonstrating technical leadership, mentoring junior developers, and delivering high-impact projects.'
    },
    'Skills': {
      title: 'Master React and TypeScript',
      description: 'Become proficient in React and TypeScript by building 3 projects, completing advanced courses, and contributing to open-source projects.'
    },
    'Personal': {
      title: 'Improve work-life balance',
      description: 'Establish boundaries between work and personal life by setting specific work hours and dedicating time to hobbies and family.'
    },
    'Education': {
      title: 'Complete MBA degree',
      description: 'Earn an MBA in Business Administration with a focus on Technology Management from an accredited university.'
    },
    'Health': {
      title: 'Run a half marathon',
      description: 'Complete a half marathon race by following a structured training program and maintaining consistent weekly runs.'
    }
  };

  const currentExample = smartExamples[formData.category as keyof typeof smartExamples];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {goal ? 'Edit Goal' : 'Create New Goal'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Career">Career</option>
                <option value="Skills">Skills</option>
                <option value="Personal">Personal</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
              </select>
            </div>

            {/* Example for selected category */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 SMART Goal Example for {formData.category}:</h4>
              <p className="text-sm text-blue-800 mb-1"><strong>{currentExample.title}</strong></p>
              <p className="text-xs text-blue-700">{currentExample.description}</p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal ml-1">(Specific & Clear)</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Get promoted to Senior Developer by December 2025"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal ml-1">(Measurable & Achievable details)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what success looks like, how you'll measure progress, and what steps you'll take..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Priority and Target Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal ml-1">(Time-bound)</span>
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Milestones Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarterly Milestones
                <span className="text-gray-500 font-normal ml-1">(Break goal into smaller steps)</span>
              </label>
              
              {/* Add new milestone */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Milestone title..."
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newMilestone.targetDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, targetDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      max={formData.targetDate}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addMilestone}
                      disabled={!newMilestone.title || !newMilestone.targetDate}
                      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing milestones */}
              {milestones.length > 0 && (
                <div className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <span className="text-gray-900">{milestone.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(milestone.targetDate).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {goal ? 'Update Goal' : 'Create Goal'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

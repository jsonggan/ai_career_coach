'use client';

import { Goal } from '../career-vision-client';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goalId: string, progress: number) => void;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdateProgress
}: GoalCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Career': 'bg-blue-100 text-blue-800 border-blue-200',
      'Skills': 'bg-green-100 text-green-800 border-green-200',
      'Personal': 'bg-purple-100 text-purple-800 border-purple-200',
      'Education': 'bg-orange-100 text-orange-800 border-orange-200',
      'Health': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'text-red-600',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Not Started': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== 'Completed';

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(goal.category)}`}>
              {goal.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
          </div>
          <p className="text-gray-600 mb-3">{goal.description}</p>
          
          {/* Goal Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Priority:</span>
              <span className={`ml-1 font-medium ${getPriorityColor(goal.priority)}`}>
                {goal.priority}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Target Date:</span>
              <span className={`ml-1 font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(goal.targetDate)}
                {isOverdue && ' ⚠️'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Progress:</span>
              <span className="ml-1 font-medium text-gray-900">{goal.progress}%</span>
            </div>
            <div>
              <span className="text-gray-500">Milestones:</span>
              <span className="ml-1 font-medium text-gray-900">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Goal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Goal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm text-gray-600">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Progress Control */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-600">Update Progress:</span>
        <input
          type="range"
          min="0"
          max="100"
          value={goal.progress}
          onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
          {goal.progress}%
        </span>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Milestones</h4>
          <div className="space-y-2">
            {goal.milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3 text-sm">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  milestone.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {milestone.completed && (
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                  {milestone.title}
                </span>
                <span className="text-gray-400 text-xs ml-auto">
                  {formatDate(milestone.targetDate)}
                </span>
              </div>
            ))}
            {goal.milestones.length > 3 && (
              <div className="text-xs text-gray-500 pl-7">
                +{goal.milestones.length - 3} more milestones
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

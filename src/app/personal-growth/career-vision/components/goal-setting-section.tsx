'use client';

import { useState } from 'react';
import { Goal, Milestone } from '../career-vision-client';
import GoalCard from './goal-card';
import GoalForm from './goal-form';

interface GoalSettingSectionProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
}

export default function GoalSettingSection({
  goals,
  onGoalsUpdate
}: GoalSettingSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    onGoalsUpdate(updatedGoals);
  };

  const handleSaveGoal = (goal: Goal) => {
    if (editingGoal) {
      // Update existing goal
      const updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
      onGoalsUpdate(updatedGoals);
    } else {
      // Add new goal
      const newGoal: Goal = {
        ...goal,
        id: Date.now().toString(),
      };
      onGoalsUpdate([...goals, newGoal]);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleUpdateProgress = (goalId: string, progress: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            progress,
            status: progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
          } 
        : goal
    );
    onGoalsUpdate(updatedGoals);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{currentYear} Annual Goals</h2>
          <p className="text-gray-600 mt-1">Set 3-5 main goals using SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)</p>
        </div>
        <button
          onClick={handleAddGoal}
          disabled={goals.length >= 5}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Goal ({goals.length}/5)
        </button>
      </div>

      {/* SMART Criteria Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-green-900 mb-2">🎯 SMART Goal Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="text-center">
            <div className="font-medium text-green-800">Specific</div>
            <div className="text-xs text-green-700">Clear & well-defined</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-800">Measurable</div>
            <div className="text-xs text-green-700">Track progress</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-800">Achievable</div>
            <div className="text-xs text-green-700">Realistic & attainable</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-800">Relevant</div>
            <div className="text-xs text-green-700">Aligned with vision</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-green-800">Time-bound</div>
            <div className="text-xs text-green-700">Clear deadline</div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-lg mb-2">No goals set for {currentYear} yet</p>
          <p className="text-sm mb-4">Start by creating your first SMART goal to work towards your vision</p>
          <button
            onClick={handleAddGoal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onSave={handleSaveGoal}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

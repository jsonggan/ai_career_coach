'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Goal, Milestone } from '../career-vision-client';
import GoalCard from './goal-card';
import GoalForm from './goal-form';

interface GoalSettingSectionProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  userId: number;
  currentYear: number;
}

export default function GoalSettingSection({
  goals,
  onGoalsUpdate,
  userId,
  currentYear
}: GoalSettingSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/career-vision/goals', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId: parseInt(goalId),
          userId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete goal');
      }

      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      onGoalsUpdate(updatedGoals);
      toast.success('Goal deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoal = async (goal: Goal) => {
    setIsLoading(true);
    try {
      if (editingGoal) {
        // Update existing goal
        const response = await fetch('/api/v1/career-vision/goals', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goalId: parseInt(goal.id),
            userId,
            title: goal.title,
            description: goal.description,
            category: goal.category,
            priority: goal.priority,
            targetDate: goal.targetDate,
            progress: goal.progress,
            status: goal.status,
            milestones: goal.milestones.map(m => ({
              title: m.title,
              targetDate: m.targetDate,
              completed: m.completed
            }))
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update goal');
        }

        const updatedGoal = {
          ...goal,
          id: result.data.goal_id.toString(),
          milestones: result.data.milestones?.map((m: any) => ({
            id: m.milestone_id.toString(),
            title: m.title,
            targetDate: new Date(m.target_date).toISOString().split('T')[0],
            completed: m.completed
          })) || []
        };

        const updatedGoals = goals.map(g => g.id === goal.id ? updatedGoal : g);
        onGoalsUpdate(updatedGoals);
        toast.success('Goal updated successfully!');
      } else {
        // Add new goal
        const response = await fetch('/api/v1/career-vision/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            year: currentYear,
            title: goal.title,
            description: goal.description,
            category: goal.category,
            priority: goal.priority,
            targetDate: goal.targetDate,
            milestones: goal.milestones.map(m => ({
              title: m.title,
              targetDate: m.targetDate
            }))
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create goal');
        }

        const newGoal: Goal = {
          id: result.data.goal_id.toString(),
          title: result.data.title,
          description: result.data.description,
          category: result.data.category,
          priority: result.data.priority,
          targetDate: new Date(result.data.target_date).toISOString().split('T')[0],
          progress: result.data.progress,
          status: result.data.status,
          year: result.data.year,
          milestones: result.data.milestones?.map((m: any) => ({
            id: m.milestone_id.toString(),
            title: m.title,
            targetDate: new Date(m.target_date).toISOString().split('T')[0],
            completed: m.completed
          })) || []
        };

        onGoalsUpdate([...goals, newGoal]);
        toast.success('Goal created successfully!');
      }
      
      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      const response = await fetch('/api/v1/career-vision/goals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId: parseInt(goalId),
          userId,
          progress
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update progress');
      }

      const updatedGoals = goals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              progress,
              status: result.data.status
            } 
          : goal
      );
      onGoalsUpdate(updatedGoals);
      toast.success('Progress updated!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update progress');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{currentYear} Annual Goals</h2>
          <p className="text-gray-600 mt-1">Set 3-5 main goals using SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)</p>
        </div>
        <button
          onClick={handleAddGoal}
          disabled={goals.length >= 5 || isLoading}
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
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

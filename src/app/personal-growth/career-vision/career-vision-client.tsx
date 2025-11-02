'use client';

import { useState } from 'react';
import VisionStatementSection from './components/vision-statement-section';
import GoalSettingSection from './components/goal-setting-section';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Career' | 'Skills' | 'Personal' | 'Education' | 'Health';
  priority: 'High' | 'Medium' | 'Low';
  targetDate: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
}

export default function CareerVisionClient() {
  const [visionStatement, setVisionStatement] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);

  const handleVisionChange = (vision: string) => {
    setVisionStatement(vision);
  };

  const handleGoalUpdate = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Vision</h1>
          <p className="text-lg text-gray-600 mb-4">
            Define your long-term aspirations and create actionable goals to achieve your vision.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-lg">🎯</div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Your Personal Roadmap</h3>
                <p className="text-blue-700 text-sm">
                  Create a clear vision for your future and break it down into achievable goals. 
                  Use the <strong>SMART criteria</strong> to make your goals specific, measurable, achievable, relevant, and time-bound.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Statement Section */}
        <VisionStatementSection 
          visionStatement={visionStatement}
          onVisionChange={handleVisionChange}
        />

        {/* Goal Setting Section */}
        <GoalSettingSection 
          goals={goals}
          onGoalsUpdate={handleGoalUpdate}
        />
      </div>
    </div>
  );
}

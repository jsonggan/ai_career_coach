// Mock data for dashboard components

export interface DashboardStats {
  activeCycles: number;
  pendingReviews: number;
  completed: number;
  teamMembers: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  details?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'info' | 'overdue';
}

export interface DeadlineItem {
  id: string;
  title: string;
  participants: number;
  dueDate: string;
  priority: 'urgent' | 'normal';
}

export const dashboardStats: DashboardStats = {
  activeCycles: 3,
  pendingReviews: 12,
  completed: 28,
  teamMembers: 45,
};

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    user: 'Alice Tan',
    action: 'Completed self-assessment',
    timestamp: '2 hours ago',
    status: 'completed',
  },
  {
    id: '2',
    user: 'Amanda Lee',
    action: 'Scheduled 1-on-1 with Edward Lim',
    timestamp: '3 hours ago',
    status: 'info',
  },
  {
    id: '3',
    user: 'Sarah Chen',
    action: 'Submitted peer feedback for Edward Lim',
    timestamp: '4 hours ago',
    status: 'completed',
  },
  {
    id: '4',
    user: 'Rajesh Kumar',
    action: 'Manager review pending',
    timestamp: '1 day ago',
    status: 'pending',
  },
  {
    id: '5',
    user: 'HR Admin',
    action: 'Created Q4 2024 cycle',
    timestamp: '3 days ago',
    status: 'info',
  },
  {
    id: '6',
    user: 'Mei Ling',
    action: 'Self-assessment overdue',
    timestamp: '5 days ago',
    status: 'overdue',
  },
];

export const upcomingDeadlines: DeadlineItem[] = [
  {
    id: '1',
    title: 'Mid-Year 2025 Self-Assessments',
    participants: 8,
    dueDate: 'Due in 3 days',
    priority: 'urgent',
  },
  {
    id: '2',
    title: 'Q4 2024 Manager Reviews',
    participants: 12,
    dueDate: 'Due in 1 week',
    priority: 'normal',
  },
  {
    id: '3',
    title: 'Annual Review Cycle',
    participants: 25,
    dueDate: 'Due in 2 weeks',
    priority: 'normal',
  },
];

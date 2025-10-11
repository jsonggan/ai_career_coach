import StatsCards from "./components/stats-cards";
import RecentActivity from "./components/recent-activity";
import UpcomingDeadlines from "./components/upcoming-deadlines";
import { dashboardStats, recentActivity, upcomingDeadlines } from "./mock-data";

export default function DashboardPage() {
  return (
    <div
      className="flex flex-col w-full px-16 py-8"
      style={{ maxWidth: "1400px" }}
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600 m-0">
          Overview of performance appraisal activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-5">
        <StatsCards stats={dashboardStats} />
      </div>

      {/* Activity and Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivity} />
        <UpcomingDeadlines deadlines={upcomingDeadlines} />
      </div>
    </div>
  );
}

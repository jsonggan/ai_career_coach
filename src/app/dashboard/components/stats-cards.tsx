import clsx from "clsx";
import type { DashboardStats } from "../mock-data";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <div className="border border-gray-200 bg-white rounded-lg p-6 h-32 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col justify-center">
        <span className="text-gray-600 text-sm font-medium mb-2">{title}</span>
        <span className="text-3xl font-bold text-gray-900 mb-1">{value}</span>
        <span className="text-gray-500 text-sm">{subtitle}</span>
      </div>
      <div
        className={clsx(
          "flex items-center justify-center rounded-lg shrink-0",
          iconBg
        )}
        style={{ width: 56, height: 56 }}
      >
        <i className={clsx(icon, iconColor, "text-2xl")} />
      </div>
    </div>
  );
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Cycles"
        value={stats.activeCycles}
        subtitle="Currently running"
        icon="pi pi-calendar"
        iconColor="text-blue-500"
        iconBg="bg-blue-50"
      />
      <StatCard
        title="Pending Reviews"
        value={stats.pendingReviews}
        subtitle="Awaiting completion"
        icon="pi pi-clock"
        iconColor="text-orange-500"
        iconBg="bg-orange-50"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        subtitle="This quarter"
        icon="pi pi-check-circle"
        iconColor="text-green-500"
        iconBg="bg-green-50"
      />
      <StatCard
        title="Team Members"
        value={stats.teamMembers}
        subtitle="Total employees"
        icon="pi pi-users"
        iconColor="text-purple-500"
        iconBg="bg-purple-50"
      />
    </div>
  );
}

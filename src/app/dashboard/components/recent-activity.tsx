import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import clsx from "clsx";
import type { ActivityItem } from "../mock-data";

interface RecentActivityProps {
  activities: ActivityItem[];
}

function getStatusBadge(status: ActivityItem["status"]) {
  switch (status) {
    case "completed":
      return (
        <Badge
          value="completed"
          className="bg-black text-white text-xs px-2 py-1 rounded"
        />
      );
    case "pending":
      return (
        <Badge
          value="pending"
          className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded"
        />
      );
    case "info":
      return (
        <Badge
          value="info"
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
        />
      );
    case "overdue":
      return (
        <Badge
          value="overdue"
          className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded"
        />
      );
    default:
      return null;
  }
}

function getStatusIndicator(status: ActivityItem["status"]) {
  const baseClasses = "w-2 h-2 rounded-full flex-shrink-0";

  switch (status) {
    case "completed":
      return <div className={clsx(baseClasses, "bg-green-500")} />;
    case "pending":
      return <div className={clsx(baseClasses, "bg-orange-500")} />;
    case "info":
      return <div className={clsx(baseClasses, "bg-blue-500")} />;
    case "overdue":
      return <div className={clsx(baseClasses, "bg-red-500")} />;
    default:
      return <div className={clsx(baseClasses, "bg-gray-400")} />;
  }
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border border-gray-200 shadow-sm h-full rounded-lg bg-white">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <i className="pi pi-chart-line text-xl text-gray-600" />
          <h2 className="text-xl font-semibold text-black m-0">
            Recent Activity
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-6 m-0">
          Latest updates across all appraisal cycles
        </p>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-md"
            >
              {getStatusIndicator(activity.status)}

              <div className="flex-1 min-w-0">
                <span className="font-semibold text-black text-sm">
                  {activity.user}
                </span>
                <p className="text-gray-600 text-sm m-0">{activity.action}</p>
                <span className="text-gray-500 text-xs">
                  {activity.timestamp}
                </span>
              </div>

              {getStatusBadge(activity.status)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

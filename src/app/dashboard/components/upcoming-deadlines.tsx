import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import clsx from "clsx";
import type { DeadlineItem } from "../mock-data";

interface UpcomingDeadlinesProps {
  deadlines: DeadlineItem[];
}

function getPriorityBadge(priority: DeadlineItem["priority"]) {
  switch (priority) {
    case "urgent":
      return (
        <Badge
          value="Urgent"
          className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded"
        />
      );
    case "normal":
      return (
        <Badge
          value="Normal"
          className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded"
        />
      );
    default:
      return null;
  }
}

function getPriorityIndicator(priority: DeadlineItem["priority"]) {
  const baseClasses = "w-2 h-2 rounded-full flex-shrink-0";

  switch (priority) {
    case "urgent":
      return <div className={clsx(baseClasses, "bg-red-500")} />;
    case "normal":
      return <div className={clsx(baseClasses, "bg-blue-500")} />;
    default:
      return <div className={clsx(baseClasses, "bg-gray-400")} />;
  }
}

export default function UpcomingDeadlines({
  deadlines,
}: UpcomingDeadlinesProps) {
  return (
    <Card className="border border-gray-200 shadow-sm h-full rounded-lg bg-white">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <i className="pi pi-clock text-xl text-gray-600" />
          <h2 className="text-xl font-semibold text-black m-0">
            Upcoming Deadlines
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-6 m-0">
          Important dates and milestones
        </p>

        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-md"
            >
              {getPriorityIndicator(deadline.priority)}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-black text-sm">
                  {deadline.title}
                </h3>

                <div className="flex items-center gap-1 ">
                  <span className="text-gray-600 text-sm">
                    {deadline.participants} participants
                  </span>
                </div>

                <div className="flex items-center mt-1">
                  <span className="text-gray-500 text-xs">
                    {deadline.dueDate}
                  </span>
                </div>
              </div>

              {getPriorityBadge(deadline.priority)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

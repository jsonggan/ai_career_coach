"use client";

import { DataTable } from "primereact/datatable";
import { Avatar } from "primereact/avatar";
import { Column } from "primereact/column";
import { format } from "date-fns";
import { AvatarGroup } from "primereact/avatargroup";
import { ProjectDataTableProps } from "./types";
import { useProjectList } from "@/query/projects";
import { Project } from "@/app/api/projects/types";
import ProjectStatus from "../project-status";
import { Skeleton } from "primereact/skeleton";

const loaderItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
  id: i,
}));

function ProjectDataTable(props: ProjectDataTableProps) {
  const { data = [], isLoading } = useProjectList();
  const { onRowClick } = props;

  const columns = [
    {
      field: "name",
      label: "Project Name",
    },
    {
      field: "client",
      label: "Client",
      template: (row: Project) => (
        <span className="font-light">{row.client}</span>
      ),
    },
    {
      field: "date",
      label: "Timeline",
      template: (row: Project) => (
        <span className="font-light">
          {format(new Date(row.start), "d/M/yy")} -{" "}
          {format(new Date(row.end), "d/M/yy")}
        </span>
      ),
    },
    {
      field: "members",
      label: "Team",
      template: (row: Project) => (
        <AvatarGroup>
          {row.roles.slice(0, 3).map(({ id, user }) => (
            <Avatar
              key={id}
              image={user.avatar}
              shape="circle"
              pt={{
                image: {
                  width: 28,
                  height: 28,
                },
              }}
            />
          ))}
          {row.roles.length > 3 && (
            <Avatar label={`+${row.roles.length - 3}`} shape="circle" />
          )}
        </AvatarGroup>
      ),
    },
    {
      field: "status",
      label: "Status",
      template: (row: Project) => <ProjectStatus status={row.status} />,
    },
  ];

  return (
    <div className="w-full border-1 border-round-xl border-100 shadow-1">
      <DataTable
        paginator
        value={isLoading ? loaderItems : data}
        rows={10}
        dataKey="id"
        rowsPerPageOptions={[]}
        selectionMode="single"
        onRowClick={(row) => onRowClick(row.data as any)}
        emptyMessage="No projects found"
        pt={{
          paginator: {
            root: {
              className: "border-round-bottom-xl",
            },
          },
        }}
      >
        {columns.map(({ field, label, template }) => (
          <Column
            key={field}
            field={field}
            header={label}
            body={isLoading ? <Skeleton width="12vw" /> : template}
            headerClassName="font-light text-sm"
          />
        ))}
      </DataTable>
    </div>
  );
}

export default ProjectDataTable;

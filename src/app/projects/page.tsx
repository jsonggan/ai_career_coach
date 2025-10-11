"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import ProjectDataTable from "@/components/project-data-table";
import { useRouter } from "next/navigation";
import { useCreateProjectDialogStore } from "@/store/create-dialog";

export default function ProjectsPage() {
  const router = useRouter();
  const { openDialog } = useCreateProjectDialogStore();

  return (
    <div className="flex flex-column w-full" style={{ maxWidth: "1200px" }}>
      <div className="flex justify-content-between mt-5 align-items-center mb-3">
        <h1 className="text-3xl font-semibold">Pipeline</h1>
        <Button
          onClick={() => openDialog()}
          rounded
          label="Add Project"
          icon="pi pi-plus"
          size="small"
        />
      </div>
      <ProjectDataTable
        onRowClick={(row) => router.push(`/projects/${row.id}`)}
      />
    </div>
  );
}

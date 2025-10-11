"use client";

import NotFound from "@/app/not-found";
import { faker } from "@faker-js/faker";
import ReactMarkdown from "react-markdown";
import ProjectStatus from "@/components/project-status";
import { useProjectById } from "@/query/projects";
import { useParams } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ListBox } from "primereact/listbox";
import { Chip } from "primereact/chip";
import { Avatar } from "primereact/avatar";
import MatchChip from "@/components/match-chip";
import clsx from "clsx";

interface Material {
  id: string;
  name: string;
}

function ProjectPage() {
  const { id: projectId } = useParams();
  const [isReadModeOpen, setIsReadMoreOpen] = useState(false);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const { data } = useProjectById(String(projectId));

  useEffect(() => {
    const data = [];

    for (let i = 0; i < 4; i++) {
      data.push({
        id: faker.datatype.uuid(),
        name: faker.system.commonFileName("pdf"),
      });
    }

    setMaterials(data);
  }, []);

  return data ? (
    <div className="flex flex-column w-full" style={{ maxWidth: "1200px" }}>
      <div className="flex flex-column-reverse md:flex-row justify-content-between mt-5 align-items-center mb-3">
        <div className="flex align-items-center gap-3">
          <h1 className="text-3xl font-semibold">{data.name}</h1>
          <ProjectStatus status={data.status} />
        </div>
        <Button
          className="align-self-end md:align-self-center"
          rounded
          label="Assign"
          icon="pi pi-users"
          size="small"
        />
      </div>
      <div className="grid">
        <div className="col-12">
          <Card
            title="Project Description"
            className="shadow-none"
            pt={{
              content: {
                className: "overflow-y-hidden relative",
                style: {
                  height: isReadModeOpen ? "min-content" : "200px",
                },
              },
            }}
            footer={
              <div className="flex justify-content-end">
                <Button
                  text
                  className="p-0"
                  pt={{
                    label: {
                      className: "font-light text-sm",
                    },
                  }}
                  label={isReadModeOpen ? "Read less" : "Read more"}
                  onClick={() => setIsReadMoreOpen(!isReadModeOpen)}
                />
              </div>
            }
          >
            <ReactMarkdown>{data.description}</ReactMarkdown>
            {!isReadModeOpen && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)",
                }}
              />
            )}
          </Card>
        </div>
        <div className="col-12 md:col-6">
          <Card
            title="Objectives"
            className="shadow-none"
            pt={{
              content: {
                className: "overflow-y-hidden relative",
                style: {
                  height: isObjectivesOpen ? "min-content" : "140px",
                },
              },
            }}
            footer={
              <div className="flex justify-content-end">
                <Button
                  text
                  className="p-0"
                  pt={{
                    label: {
                      className: "font-light text-sm",
                    },
                  }}
                  label={isObjectivesOpen ? "Read less" : "Read more"}
                  onClick={() => setIsObjectivesOpen(!isObjectivesOpen)}
                />
              </div>
            }
          >
            {data.objectives.map(({ id, name, description }) => (
              <div key={id}>
                <p className="font-semibold m-0">{name}</p>
                <p className="font-light">{description}</p>
              </div>
            ))}
            {!isObjectivesOpen && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)",
                }}
              />
            )}
          </Card>
        </div>
        <div className="col-12 md:col-6">
          <Card
            title="Timeline"
            className={clsx("shadow-none", !isObjectivesOpen && "h-full")}
          >
            <div className="grid">
              <div className="col-2 font-bold">Start</div>
              <div className="col-10">
                {format(new Date(data.start), "d MMM y")}
              </div>
              <div className="col-2 font-bold">End</div>
              <div className="col-10">
                {format(new Date(data.end), "d MMM y")}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-8">
          <Card title="Your Team" className="shadow-none">
            <div className="flex flex-column gap-4">
              {data.roles.map(
                ({ id, role, description, match, skills, user }) => (
                  <div
                    key={id}
                    className="flex flex-column-reverse md:flex-row align-items-center gap-3"
                  >
                    <div className="flex flex-column">
                      <h4 className="text-lg font-semibold m-0 mb-2">{role}</h4>
                      <p className="m-0 text-color-secondary font-light">
                        {description}
                      </p>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {skills.map((name) => (
                          <Chip
                            key={name}
                            label={name}
                            pt={{
                              root: {
                                className: "bg-blue-50 py-1 px-2",
                              },
                              label: {
                                className: "text-blue-500 text-sm m-0 mx-1",
                              },
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="surface-ground border-round-xl p-3 flex flex-column gap-2 align-items-center max-w-13rem w-full">
                      <Avatar
                        key={id}
                        image={user.avatar}
                        shape="circle"
                        size="xlarge"
                        pt={{
                          image: {
                            width: 64,
                            height: 64,
                          },
                        }}
                      />
                      <p className="m-0 text-center font-bold mt-2">
                        {user.name}
                      </p>
                      <p className="m-0 text-center text-sm text-color-secondary mb-2">
                        {role}
                      </p>
                      <MatchChip value={match} />
                    </div>
                  </div>
                ),
              )}
            </div>
          </Card>
        </div>
        <div className="col-12 md:col-4">
          <Card
            title="Materials"
            className="shadow-none"
            pt={{
              content: {
                className: "p-0",
              },
            }}
          >
            <ListBox
              className="border-none w-full"
              itemTemplate={({ name }) => (
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-file-pdf text-red-400" />
                  <p className="m-0">{name}</p>
                </div>
              )}
              pt={{
                item: {
                  className: "px-2",
                },
              }}
              optionLabel="name"
              options={materials}
            />
          </Card>
        </div>
      </div>
    </div>
  ) : (
    <NotFound />
  );
}

export default ProjectPage;

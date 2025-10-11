import { Project } from "@/app/api/projects/types";
import { Button } from "primereact/button";

interface ObjectiveCardProps {
  objective: Project["objectives"][number];

  onObjectiveDeleteRequest?: (objective: Project["objectives"][number]) => void;
  onObjectiveSelect?: (objective: Project["objectives"][number]) => void;
  interactionDisabled?: boolean;
}

function ObjectiveCard(props: ObjectiveCardProps) {
  const {
    objective,
    onObjectiveDeleteRequest,
    onObjectiveSelect,
    interactionDisabled,
  } = props;

  return (
    <div className="surface-card p-2 border-round w-full flex flex-column w-full gap-1 border-left-3 border-purple-500">
      <h5 className="m-0 font-light">{objective.name}</h5>
      <p className="m-0 text-color-secondary text-xs">
        {objective.description}
      </p>
      {!interactionDisabled && (
        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            text
            label="Delete"
            severity="danger"
            className="p-0"
            pt={{
              label: {
                className: "text-xs font-light",
              },
            }}
            onClick={() => onObjectiveDeleteRequest?.(objective)}
          />
          <Button
            text
            label="Edit"
            className="p-0"
            pt={{
              label: {
                className: "text-xs font-light",
              },
            }}
            onClick={() => onObjectiveSelect?.(objective)}
          />
        </div>
      )}
    </div>
  );
}

export default ObjectiveCard;

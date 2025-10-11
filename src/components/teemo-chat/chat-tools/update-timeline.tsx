import clsx from "clsx";
import styles from "../index.module.css";
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { Button } from "primereact/button";

interface UpdateTimelineProps {
  start: string;
  end: string;

  onConfirm: (start: string, end: string) => void;
  interactionDisabled?: boolean;
}

function UpdateTimeline(props: UpdateTimelineProps) {
  const { start, end, interactionDisabled = false, onConfirm } = props;
  const [startDate, setStartDate] = useState(new Date(start));
  const [endDate, setEndDate] = useState(new Date(end));
  const hasChanged =
    startDate.getTime() !== new Date(start).getTime() ||
    endDate.getTime() !== new Date(end).getTime();

  return (
    <div className={clsx("flex flex-column", styles.chatTools)}>
      <span className="text-xs text-color mb-1">Start</span>
      <Calendar
        inputClassName="p-inputtext-sm"
        value={startDate}
        onChange={(e) => e.value && setStartDate(e.value)}
        dateFormat="d MM yy"
        disabled={interactionDisabled}
      />
      <span className="text-xs text-color mt-3 mb-1">End</span>
      <Calendar
        inputClassName="p-inputtext-sm"
        value={endDate}
        dateFormat="d MM yy"
        onChange={(e) => e.value && setEndDate(e.value)}
        disabled={interactionDisabled}
        minDate={startDate}
      />
      {!interactionDisabled && (
        <div className="flex justify-content-end mt-3">
          <Button
            rounded
            outlined
            label="Update"
            size="small"
            className="p-2 px-3"
            disabled={!hasChanged}
            onClick={() =>
              onConfirm(startDate.toISOString(), endDate.toISOString())
            }
          />
        </div>
      )}
    </div>
  );
}

export default UpdateTimeline;

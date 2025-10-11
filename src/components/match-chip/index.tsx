import { Tag } from "primereact/tag";
import { MatchChipProps } from "./types";

function MatchChip(props: MatchChipProps) {
  const { value } = props;

  const severity = value < 30 ? "danger" : value < 60 ? "warning" : "success";

  return (
    <Tag
      value={`${value}% Match`}
      severity={severity}
      className="font-light border-round-xl px-2"
    />
  );
}

export default MatchChip;

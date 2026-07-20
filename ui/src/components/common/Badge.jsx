import { STATUS_LABELS, CHANCE_LABELS } from "../../utils/constants";

export const StatusBadge = ({ status }) => (
  <span className={`badge badge--status-${status}`}>{STATUS_LABELS[status] || status}</span>
);

export const ChanceBadge = ({ chance }) => (
  <span className={`badge badge--chance-${chance}`}>{CHANCE_LABELS[chance] || chance}</span>
);

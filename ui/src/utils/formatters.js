export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatPercent = (value, digits = 0) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
};

export const isOverdue = (dateOnly) => {
  if (!dateOnly) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateOnly) < today;
};

export const todayDateOnly = () => new Date().toISOString().slice(0, 10);

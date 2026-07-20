export const ROLES = { ADMIN: "admin", EMPLOYEE: "employee" };

export const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export const CHANCE_OPTIONS = [
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
];

export const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]));
export const CHANCE_LABELS = Object.fromEntries(CHANCE_OPTIONS.map((o) => [o.value, o.label]));

export const DATE_RANGE_PRESETS = [
  { value: "mtd", label: "Month to date" },
  { value: "ytd", label: "Year to date" },
  { value: "custom", label: "Custom range" },
];

import { ROLES } from "../../utils/constants";

export const NAV_ITEMS = {
  [ROLES.EMPLOYEE]: [
    { to: "/leads", label: "My Leads", icon: "📋" },
    { to: "/leads/new", label: "Add Lead", icon: "➕" },
    { to: "/map", label: "Map", icon: "🗺️" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/leads", label: "All Leads", icon: "📋" },
    { to: "/admin/map", label: "Team Map", icon: "🗺️" },
    { to: "/admin/employees", label: "Employee Performance", icon: "🏆" },
    { to: "/admin/areas", label: "Area Performance", icon: "📍" },
    { to: "/admin/users", label: "Manage Employees", icon: "⚙️" },
  ],
};

// A curated subset for the mobile/tablet bottom nav — thumb reach only
// stretches to 4-5 items, the rest live in the slide-in sidebar drawer.
export const BOTTOM_NAV_ITEMS = {
  [ROLES.EMPLOYEE]: [
    { to: "/leads", label: "Leads", icon: "📋" },
    { to: "/leads/new", label: "Add", icon: "➕" },
    { to: "/map", label: "Map", icon: "🗺️" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/leads", label: "Leads", icon: "📋" },
    { to: "/admin/map", label: "Map", icon: "🗺️" },
    { to: "/admin/users", label: "Team", icon: "⚙️" },
  ],
};

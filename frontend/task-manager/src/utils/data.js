import {LuClipboardCheck, LuLayoutDashboard, LuLogOut, LuSquarePlus, LuUsers} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: 1,
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: 2,
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: 3,
    label: "Create Tasks",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: 4,
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: 5,
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  }
];

export const SIDE_MENU_USER_DATA = [
  {
    id: 1,
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: 2,
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: 3,
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "Low"},
  { label: "Medium", value: "Medium"},
  { label: "High", value: "High"},
];

export const STATUS_DATA = [
  { label: "Pending", value: "Pending"},
  { label: "In Progress", value: "In Progress"},
  { label: "Completed", value: "Completed"},
];
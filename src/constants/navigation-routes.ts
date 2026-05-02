type Route = {
  path: string;
  label: string;
  menuIcon?: string;
  pageTitle?: string;
};

export const ADMIN_ROUTES: {
  PRIMARY: Route[];
  SECONDARY: Route[];
} = {
  PRIMARY: [
    {
      path: "/admin/",
      label: "Home",
      pageTitle: "Dashboard",
      menuIcon: "home",
    },
    {
      path: "/admin/team",
      label: "Team",
      menuIcon: "account_circle",
    },
    {
      path: "/admin/clients",
      label: "Clients",
      menuIcon: "groups",
    },
    {
      path: "/admin/expenses",
      label: "Expenses",
      menuIcon: "payment",
    },
    {
      path: "/admin/projects",
      label: "Projects",
      menuIcon: "folder",
    },
    {
      path: "/admin/tasks",
      label: "Tasks",
      menuIcon: "check_box",
    },
    {
      path: "/admin/calendar",
      label: "Calendar",
      menuIcon: "calendar_today",
    },
    {
      path: "/admin/documents",
      label: "Documents",
      menuIcon: "description",
    },
    {
      path: "/admin/templates",
      label: "Templates",
      menuIcon: "description",
    },
  ],
  SECONDARY: [
    {
      path: "/admin/settings",
      label: "Settings",
      menuIcon: "settings",
    },
  ],
};

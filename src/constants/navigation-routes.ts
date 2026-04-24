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

// {navItems.map((item) => {
//   const isActive = location.pathname === item.path;
//   const btnClass = isActive
//     ? `bg-(--color-sidebar-active) text-white shadow-md flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3' : 'w-[48px] h-[48px] rounded-[16px] justify-center'}`
//     : `text-(--color-sidebar-text) hover:text-white transition-colors flex items-center shrink-0 ${isExpanded ? 'w-full rounded-[16px] px-4 py-3 hover:bg-white/5' : 'w-[48px] h-[48px] rounded-[16px] justify-center hover:bg-white/5'}`;

//   return isExpanded ? (
//     <Link to={item.path} key={item.label} className={btnClass}>
//       <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
//       <span className="ml-4 font-medium text-[15px] whitespace-nowrap">{item.label}</span>
//     </Link>
//   ) : (
//     <div key={item.label} className="group relative flex justify-center">
//       <Link to={item.path} className={btnClass}>
//         <div className="shrink-0 flex items-center justify-center">{item.icon}</div>
//       </Link>
//       {/* Custom Tailwind Tooltip */}
//       <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block bg-(--color-sidebar-active) text-white rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap z-100 shadow-md border border-gray-700/50">
//         {item.label}
//       </div>
//     </div>
//   );
// })}

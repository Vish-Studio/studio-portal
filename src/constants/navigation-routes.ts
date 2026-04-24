type Route = {
  path: string;
  label: string;
  menuIcon?: string;
  pageTitle?: string;
};

const ADMIN_ROUTES: Route[] = [
  {
    path: "/admin/",
    label: "Home",
    pageTitle: "Dashboard",
    menuIcon: "home",
  },
  {
    path: "/admin/clients",
    label: "Clients",
  },
];

import {
  LayoutDashboard,
  Package,
  Factory,
  ClipboardList,
  Users,
  Boxes,
  BarChart3,
  CreditCard,
} from "lucide-react";

export const navigationConfig = [
  {
    group: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    group: "Operations",
    items: [
      {
        name: "Orders",
        path: "/orders",
        icon: ClipboardList,
      },

      {
        name: "Products",
        path: "/products",
        icon: Package,
      },

      {
        name: "Raw Materials",
        path: "/raw-materials",
        icon: Boxes,
      },

      {
        name: "Production",
        path: "/production",
        icon: Factory,
      },
    ],
  },

  {
    group: "Management",
    items: [
      {
        name: "Customers",
        path: "/customers",
        icon: Users,
      },
    ],
  },

  {
    group: "Business",
    items: [
      {
        name: "Expenses",
        path: "/expenses",
        icon: CreditCard,
      },

      {
        name: "Reports",
        path: "/reports",
        icon: BarChart3,
      },
    ],
  },
];
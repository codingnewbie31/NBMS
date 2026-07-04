import { 
  LayoutDashboard, 
  Boxes, 
  Factory, 
  ClipboardList, 
  Truck, 
  Users, 
  UserCheck, 
  BarChart3, 
  CreditCard, 
  Settings 
} from 'lucide-react';

// Central configuration defining navigation structure and icons
export const navigationConfig = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    group: "Operations",
    items: [
      { name: "Inventory", path: "/inventory", icon: Boxes },
      { name: "Production", path: "/production", icon: Factory },
      { name: "Orders", path: "/orders", icon: ClipboardList },
      { name: "Deliveries", path: "/deliveries", icon: Truck }
    ]
  },
  {
    group: "Management",
    items: [
      { name: "Customers", path: "/customers", icon: Users },
      { name: "Employees", path: "/employees", icon: UserCheck }
    ]
  },
  {
    group: "Business",
    items: [
      { name: "Reports", path: "/reports", icon: BarChart3 },
      { name: "Expenses", path: "/expenses", icon: CreditCard }
    ]
  },
  {
    group: "System",
    items: [
      { name: "Settings", path: "/settings", icon: Settings }
    ]
  }
];
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./layout/AppLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import NewOrderPage from "./pages/NewOrderPage";
import CustomersPage from "./pages/CustomersPage";
import ProductsPage from "./pages/ProductsPage";
import ProductionPage from "./pages/ProductionPage";
import ExpensesPage from "./pages/ExpensesPage";
import RawMaterialsPage from "./pages/RawMaterialsPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  // Authentication State
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Page Title Mapping
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/orders":
        return "Orders";
      case "/orders/new":
        return "New Order";
      case "/customers":
        return "Customers";
      case "/products":
        return "Products";
      case "/production":
        return "Production";
      case "/expenses":
        return "Expenses";
      default:
        return "Dashboard";
    }
  };

  // Login Routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Protected Routes
  return (
    <AppLayout
      currentPath={location.pathname}
      currentTitle={getPageTitle(location.pathname)}
      onNavigate={(path) => navigate(path)}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<NewOrderPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/raw-materials" element={<RawMaterialsPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

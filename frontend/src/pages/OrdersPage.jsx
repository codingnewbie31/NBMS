// src/pages/OrdersPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  AlertTriangle,
  Building2,
  Calendar,
  PackageSearch,
  ArrowUpDown,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Badge,
  EmptyState,
  ConfirmDialog,
  PageHero,
  SearchBar,
  FilterBar,
  DataTable,
} from "../components/ui";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Preserved original API call
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete handler - preserved business logic
  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.customerId?.businessName?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "paid" && order.outstandingBalance === 0) ||
        (statusFilter === "due" && order.outstandingBalance > 0);

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Sorting logic
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "grandTotal":
          aValue = a.grandTotal || 0;
          bValue = b.grandTotal || 0;
          break;
        case "orderNumber":
          aValue = a.orderNumber || "";
          bValue = b.orderNumber || "";
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        default:
          return 0;
      }

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [filteredOrders, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const paidOrders = orders.filter((o) => o.outstandingBalance === 0).length;
    const pendingOrders = orders.filter((o) => o.outstandingBalance > 0).length;
    return { totalRevenue, paidOrders, pendingOrders };
  }, [orders]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Table columns configuration
  const columns = [
    {
      key: "orderNumber",
      label: "Order #",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-semibold text-emerald-700">
          {value}
        </span>
      ),
    },
    {
      key: "customerId",
      label: "Customer",
      render: (_, item) => (
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-medium text-slate-800 truncate">
            {item.customerId?.businessName || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-slate-500 text-sm whitespace-nowrap">
          {new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "grandTotal",
      label: "Total",
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="font-semibold text-slate-900 whitespace-nowrap">
          Rs. {value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "amountPaid",
      label: "Paid",
      align: "right",
      hideOnMobile: true,
      render: (value) => (
        <span className="text-emerald-600 font-medium whitespace-nowrap">
          Rs. {value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "outstandingBalance",
      label: "Balance",
      align: "right",
      render: (value) =>
        value > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 whitespace-nowrap">
            <AlertTriangle className="h-3 w-3" />
            Rs. {value?.toLocaleString()}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <DollarSign className="h-3 w-3" />
            Paid
          </span>
        ),
    },
  ];

  // Row actions renderer
  const renderActions = (order) => (
    <>
      <button
        onClick={() => navigate(`/orders/${order._id}`)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-100 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        aria-label={`View order ${order.orderNumber}`}
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => navigate(`/orders/${order._id}/edit`)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label={`Edit order ${order.orderNumber}`}
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => setDeleteId(order._id)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
        aria-label={`Delete order ${order.orderNumber}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );

  // Filter options
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "due", label: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Header using PageHero */}
      <PageHero
        eyebrow={today}
        title="Orders"
        subtitle="Manage and track customer orders"
        stats={[
          { label: "Total Orders", value: orders.length },
          { label: "Revenue", value: `Rs. ${stats.totalRevenue.toLocaleString()}` },
          { label: "Paid", value: stats.paidOrders },
          { label: "Pending", value: stats.pendingOrders, highlight: stats.pendingOrders > 0 },
        ]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            onClick={() => navigate("/orders/new")}
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            New Order
          </Button>
        }
      />

      {/* Search & Filters using shared components */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search orders by number or customer..."
        />
        <FilterBar
          filters={filterOptions}
          activeFilter={statusFilter}
          onChange={setStatusFilter}
          label="Filter orders by status"
        />
      </div>

      {/* Active filters indicator */}
      {(searchTerm || statusFilter !== "all") && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 rounded-full p-0.5 hover:bg-slate-200"
              >
                ×
              </button>
            </span>
          )}
          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {statusFilter === "paid" ? "Paid" : "Pending"}
              <button
                onClick={() => setStatusFilter("all")}
                className="ml-1 rounded-full p-0.5 hover:bg-emerald-100"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="ml-auto text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Data Table using DataTable component */}
      <DataTable
        columns={columns}
        data={paginatedOrders}
        sortConfig={sortConfig}
        onSort={setSortConfig}
        loading={loading}
        error={error}
        onRetry={fetchOrders}
        rowActions={renderActions}
        pagination={{
          currentPage,
          totalPages,
          itemsPerPage,
          totalItems: sortedOrders.length,
          onPageChange: setCurrentPage,
        }}
        emptyState={{
          icon: PackageSearch,
          title: searchTerm || statusFilter !== "all" ? "No matching orders found" : "No orders yet",
          description: searchTerm || statusFilter !== "all"
            ? "Try adjusting your search terms or filters."
            : "Create your first order to get started.",
          action: searchTerm || statusFilter !== "all" ? (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate("/orders/new")}
            >
              Create Order
            </Button>
          ),
        }}
      />

      {/* Delete Confirmation */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Order"
          message="Are you sure you want to delete this order? This action cannot be undone."
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
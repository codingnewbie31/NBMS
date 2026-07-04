// src/pages/CustomersPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  X,
  Users,
  UserPlus,
  Building2,
  Phone,
  MapPin,
  DollarSign,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  PackageSearch,
  Wallet,
  History,
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
  Card,
} from "../components/ui";

export default function CustomersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data state
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Form state - preserved field names
  const [form, setForm] = useState({
    customerName: "",
    businessName: "",
    phoneNumber: "",
    area: "",
  });

  // Preserved API calls
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (customerId) => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data.filter((p) => p.customerId?._id === customerId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Form handlers - preserved business logic
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      customerName: customer.customerName,
      businessName: customer.businessName,
      phoneNumber: customer.phoneNumber,
      area: customer.area || "",
    });
    setShowForm(true);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer._id}`, form);
      } else {
        await api.post("/customers", form);
      }
      setShowForm(false);
      setEditingCustomer(null);
      setForm({ customerName: "", businessName: "", phoneNumber: "", area: "" });
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(false);
    fetchPayments(customer._id);
  };

  const handleLogPayment = async (e) => {
    e.preventDefault();
    try {
      await api.post("/payments", {
        customerId: selectedCustomer._id,
        amount: Number(paymentAmount),
      });
      setPaymentAmount("");
      fetchCustomers();
      fetchPayments(selectedCustomer._id);
      const res = await api.get("/customers");
      setCustomers(res.data);
      const updated = res.data.find((c) => c._id === selectedCustomer._id);
      setSelectedCustomer(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setForm({ customerName: "", businessName: "", phoneNumber: "", area: "" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        customer.businessName?.toLowerCase().includes(searchLower) ||
        customer.customerName?.toLowerCase().includes(searchLower) ||
        customer.phoneNumber?.toLowerCase().includes(searchLower) ||
        customer.area?.toLowerCase().includes(searchLower);

      const matchesBalance =
        balanceFilter === "all" ||
        (balanceFilter === "withBalance" && customer.currentBalance > 0) ||
        (balanceFilter === "noBalance" && customer.currentBalance === 0);

      return matchesSearch && matchesBalance;
    });
  }, [customers, searchTerm, balanceFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const withBalance = customers.filter((c) => c.currentBalance > 0).length;
    const totalOutstanding = customers.reduce(
      (sum, c) => sum + (c.currentBalance || 0),
      0
    );
    const noBalance = customers.filter((c) => c.currentBalance === 0).length;

    return { totalCustomers, withBalance, totalOutstanding, noBalance };
  }, [customers]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter options
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "withBalance", label: "With Balance" },
    { value: "noBalance", label: "Cleared" },
  ];

  // Table columns for main list
  const columns = [
    {
      key: "businessName",
      label: "Business",
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{value}</p>
            <p className="text-xs text-slate-400">{item.customerName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      label: "Contact",
      render: (value) => (
        <span className="text-slate-600 text-sm">{value}</span>
      ),
    },
    {
      key: "area",
      label: "Area",
      hideOnMobile: true,
      render: (value) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {value || "—"}
        </span>
      ),
    },
    {
      key: "currentBalance",
      label: "Balance",
      align: "right",
      sortable: true,
      render: (value) =>
        value > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 whitespace-nowrap">
            <AlertTriangle className="h-3 w-3" />
            Rs. {value?.toLocaleString()}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <DollarSign className="h-3 w-3" />
            Cleared
          </span>
        ),
    },
  ];

  // Row actions
  const renderActions = (customer) => (
    <>
      <button
        onClick={() => handleSelectCustomer(customer)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-100 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        aria-label={`View ledger for ${customer.businessName}`}
        title="View Ledger"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleEdit(customer)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-label={`Edit ${customer.businessName}`}
        title="Edit Customer"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => setDeleteId(customer._id)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
        aria-label={`Delete ${customer.businessName}`}
        title="Delete Customer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );

  // Customer Ledger View
  if (selectedCustomer) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setSelectedCustomer(null)}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Customers
        </button>

        {/* Customer Info Card */}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                <Building2 className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedCustomer.businessName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCustomer.customerName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {selectedCustomer.phoneNumber}
                  </span>
                  {selectedCustomer.area && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedCustomer.area}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center sm:text-right">
              <p className="text-xs font-medium uppercase text-slate-400">
                Outstanding Balance
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  selectedCustomer.currentBalance > 0
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                Rs. {selectedCustomer.currentBalance?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Log Payment Form */}
          {selectedCustomer.currentBalance > 0 && (
            <form
              onSubmit={handleLogPayment}
              className="mt-6 flex flex-col gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Record Payment
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount received"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
              <Button type="submit" variant="primary" icon={Wallet}>
                Log Payment
              </Button>
            </form>
          )}
        </Card>

        {/* Payment History */}
        <Card
          title="Payment History"
          icon={History}
        >
          {payments.length === 0 ? (
            <EmptyState
              icon={History}
              title="No payments recorded"
              description="Payment history will appear here once payments are logged."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase text-slate-500">
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 text-slate-600">
                        {new Date(p.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-emerald-600">
                          Rs. {p.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {p.recordedBy?.name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Add/Edit Form View
  if (showForm) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Customers
        </button>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {editingCustomer ? "Edit Customer" : "New Customer"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingCustomer
                ? "Update customer information"
                : "Add a new customer to the system"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer Name
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Business Name
              </label>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Area
              </label>
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" variant="primary" icon={editingCustomer ? Edit : UserPlus}>
                {editingCustomer ? "Update Customer" : "Save Customer"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Main List View
  return (
    <div className="flex flex-col gap-6">
      <PageHero
        eyebrow={today}
        title="Customers"
        subtitle="Manage customer accounts and payments"
        stats={[
          { label: "Total Customers", value: stats.totalCustomers },
          {
            label: "With Balance",
            value: stats.withBalance,
            highlight: stats.withBalance > 0,
          },
          {
            label: "Outstanding",
            value: `Rs. ${stats.totalOutstanding.toLocaleString()}`,
          },
          { label: "Cleared", value: stats.noBalance },
        ]}
        actions={
          <Button
            variant="primary"
            icon={UserPlus}
            size="lg"
            onClick={() => setShowForm(true)}
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            Add Customer
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search customers..."
        />
        <FilterBar
          filters={filterOptions}
          activeFilter={balanceFilter}
          onChange={setBalanceFilter}
          label="Filter by balance status"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        loading={loading}
        error={error}
        onRetry={fetchCustomers}
        rowActions={renderActions}
        zebraStripes={true}
        emptyState={{
          icon: PackageSearch,
          title:
            searchTerm || balanceFilter !== "all"
              ? "No matching customers found"
              : "No customers yet",
          description:
            searchTerm || balanceFilter !== "all"
              ? "Try adjusting your search terms or filters."
              : "Add your first customer to get started.",
          action:
            searchTerm || balanceFilter !== "all" ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setBalanceFilter("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={UserPlus}
                onClick={() => setShowForm(true)}
              >
                Add Customer
              </Button>
            ),
        }}
      />

      {deleteId && (
        <ConfirmDialog
          title="Delete Customer"
          message="Are you sure you want to delete this customer? This action cannot be undone."
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
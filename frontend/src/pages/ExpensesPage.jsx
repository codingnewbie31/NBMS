// src/pages/ExpensesPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  AlertTriangle,
  PackageSearch,
  Receipt,
  TrendingDown,
  Calendar,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Badge,
  Card,
  EmptyState,
  PageHero,
  SearchBar,
  FilterBar,
  DataTable,
} from "../components/ui";

export default function ExpensesPage() {
  const { user } = useAuth();
  
  // Data state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  
  // Form state - preserved field names
  const [form, setForm] = useState({
    expenseName: "",
    category: "Staff Food/Allowances",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Preserved API calls
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Form handlers - preserved business logic
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/expenses", form);
      setShowForm(false);
      setForm({
        expenseName: "",
        category: "Staff Food/Allowances",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        !searchTerm ||
        expense.expenseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const thisMonth = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    }).reduce((sum, e) => sum + (e.amount || 0), 0);
    const uniqueCategories = [...new Set(expenses.map((e) => e.category))];

    return { totalExpenses, thisMonth, uniqueCategories };
  }, [expenses]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Category colors - preserved from original
  const categoryColors = {
    "Raw Materials": "info",
    "Transport & Fuel": "warning",
    "Factory Maintenance": "danger",
    Utilities: "neutral",
    "Staff Food/Allowances": "success",
    Miscellaneous: "neutral",
  };

  // Table columns
  const columns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-slate-600 whitespace-nowrap">
          {new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "expenseName",
      label: "Description",
      render: (value) => (
        <span className="font-medium text-slate-800">{value}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      hideOnMobile: true,
      render: (value) => (
        <Badge
          variant={categoryColors[value] || "neutral"}
          size="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-red-600 whitespace-nowrap">
          Rs. {value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      hideOnMobile: true,
      render: (value) => (
        <span className="text-xs text-slate-400">
          {value || "—"}
        </span>
      ),
    },
  ];

  // Category filter options
  const categoryOptions = [
    { value: "all", label: "All" },
    { value: "Raw Materials", label: "Raw Materials" },
    { value: "Transport & Fuel", label: "Transport" },
    { value: "Factory Maintenance", label: "Maintenance" },
    { value: "Utilities", label: "Utilities" },
    { value: "Staff Food/Allowances", label: "Staff" },
    { value: "Miscellaneous", label: "Misc" },
  ];

  // If showing form
  if (showForm) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => setShowForm(false)}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Expenses
        </button>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">New Expense</h2>
            <p className="mt-1 text-sm text-slate-500">
              Record a new operating expense
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </label>
              <input
                name="expenseName"
                value={form.expenseName}
                onChange={handleChange}
                placeholder="e.g. Lunch allowance for factory workers"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option>Raw Materials</option>
                <option>Transport & Fuel</option>
                <option>Factory Maintenance</option>
                <option>Utilities</option>
                <option>Staff Food/Allowances</option>
                <option>Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount (Rs.)
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Notes (optional)
              </label>
              <input
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" variant="primary" icon={Plus}>
                Save Expense
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Main list view
  return (
    <div className="flex flex-col gap-6">
      <PageHero
        eyebrow={today}
        title="Expenses"
        subtitle="Track operating costs and expenditures"
        stats={[
          {
            label: "Total Expenses",
            value: `Rs. ${stats.totalExpenses.toLocaleString()}`,
          },
          {
            label: "This Month",
            value: `Rs. ${stats.thisMonth.toLocaleString()}`,
          },
          {
            label: "Categories",
            value: stats.uniqueCategories.length,
          },
        ]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            onClick={() => setShowForm(true)}
            className="border-white bg-transparent text-white hover:bg-white hover:text-emerald-700 hover:border-white transition-all duration-300 ease-in-out"
          >
            Log Expense
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search expenses..."
        />
        <FilterBar
          filters={categoryOptions}
          activeFilter={categoryFilter}
          onChange={setCategoryFilter}
          label="Filter by category"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredExpenses}
        loading={loading}
        error={error}
        onRetry={fetchExpenses}
        zebraStripes={true}
        emptyState={{
          icon: Receipt,
          title:
            searchTerm || categoryFilter !== "all"
              ? "No matching expenses"
              : "No expenses recorded yet",
          description:
            searchTerm || categoryFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Log your first expense to start tracking costs.",
          action:
            searchTerm || categoryFilter !== "all" ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowForm(true)}
              >
                Log Expense
              </Button>
            ),
        }}
      />
    </div>
  );
}
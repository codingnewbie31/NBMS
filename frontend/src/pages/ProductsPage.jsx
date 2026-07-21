// src/pages/ProductsPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Package,
  AlertTriangle,
  PackageSearch,
  Box,
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
  Input,
} from "../components/ui";

export default function ProductsPage() {
  const { user } = useAuth();
  
  // Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state - preserved field names
  const [form, setForm] = useState({
    name: "",
    category: "Water",
    caseCapacity: "",
    pricePerCase: "",
    pricePerBottle: "",
    costPrice: "",
    stockBottles: "",
    lowStockLimit: "",
  });

  // Preserved API calls
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form handlers - preserved business logic
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      caseCapacity: product.caseCapacity,
      pricePerCase: product.pricePerCase,
      pricePerBottle: product.pricePerBottle,
      costPrice: product.costPrice,
      stockBottles: product.stockBottles,
      lowStockLimit: product.lowStockLimit,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, form);
      } else {
        await api.post("/products", form);
      }
      setShowForm(false);
      setEditingProduct(null);
      setForm({
        name: "",
        category: "Water",
        caseCapacity: "",
        pricePerCase: "",
        pricePerBottle: "",
        costPrice: "",
        stockBottles: "",
        lowStockLimit: "",
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm({
      name: "",
      category: "Water",
      caseCapacity: "",
      pricePerCase: "",
      pricePerBottle: "",
      costPrice: "",
      stockBottles: "",
      lowStockLimit: "",
    });
  };

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.stockBottles <= p.lowStockLimit).length;
    const totalStock = products.reduce((sum, p) => sum + (p.stockBottles || 0), 0);
    const categories = [...new Set(products.map((p) => p.category))];

    return { totalProducts, lowStock, totalStock, categories };
  }, [products]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Table columns
  const columns = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <Box className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{value}</p>
            <p className="text-xs text-slate-400">{item.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      hideOnMobile: true,
      render: (value) => (
        <Badge variant="info" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: "caseCapacity",
      label: "Case Size",
      align: "center",
      hideOnMobile: true,
      render: (value) => (
        <span className="text-slate-600">{value} bottles</span>
      ),
    },
    {
      key: "pricePerCase",
      label: "Price/Case",
      align: "right",
      hideOnMobile: true,
      render: (value) => (
        <span className="font-medium text-slate-700">
          Rs. {value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "costPrice",
      label: "Cost/Case",
      align: "right",
      hideOnMobile: true,
      render: (value) => (
        <span className="text-slate-500">Rs. {value?.toLocaleString()}</span>
      ),
    },
    {
      key: "stockBottles",
      label: "Stock",
      align: "right",
      render: (value, item) => {
        const isLow = value <= item.lowStockLimit;
        return (
          <div className="text-right">
            <span
              className={`font-semibold ${isLow ? "text-amber-600" : "text-slate-700"}`}
            >
              {value} bottles
            </span>
            <span className="block text-xs text-slate-400">
              ({Math.floor(value / item.caseCapacity)} cases)
            </span>
          </div>
        );
      },
    },
  ];

  // Row actions
  const renderActions = (product) => (
    <button
      onClick={() => handleEdit(product)}
      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      aria-label={`Edit ${product.name}`}
    >
      <Edit className="h-4 w-4" />
    </button>
  );

  // Category filter options
  const categoryOptions = [
    { value: "all", label: "All" },
    ...stats.categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // If showing form
  if (showForm) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Products
        </button>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {editingProduct ? "Edit Product" : "New Product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingProduct
                ? "Update product information"
                : "Add a new product to inventory"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Product Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
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
                <option>Water</option>
                <option>Juice</option>
                <option>Soft Drinks</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bottles per Case
              </label>
              <input
                name="caseCapacity"
                type="number"
                value={form.caseCapacity}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price per Case (Rs.)
              </label>
              <input
                name="pricePerCase"
                type="number"
                value={form.pricePerCase}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price per Bottle (Rs.)
              </label>
              <input
                name="pricePerBottle"
                type="number"
                value={form.pricePerBottle}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cost Price per Case (Rs.)
              </label>
              <input
                name="costPrice"
                type="number"
                value={form.costPrice}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Stock (Bottles)
              </label>
              <input
                name="stockBottles"
                type="number"
                value={form.stockBottles}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Low Stock Alert (Bottles)
              </label>
              <input
                name="lowStockLimit"
                type="number"
                value={form.lowStockLimit}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" variant="primary" icon={editingProduct ? Edit : Plus}>
                {editingProduct ? "Update Product" : "Save Product"}
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

  // Main list view
  return (
    <div className="flex flex-col gap-6">
      <PageHero
        eyebrow={today}
        title="Products"
        subtitle="Manage beverage products and inventory"
        stats={[
          { label: "Total Products", value: stats.totalProducts },
          { label: "Low Stock", value: stats.lowStock, highlight: stats.lowStock > 0 },
          { label: "Total Stock", value: `${stats.totalStock.toLocaleString()} bottles` },
          { label: "Categories", value: stats.categories.length },
        ]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            onClick={() => setShowForm(true)}
            className="border-white bg-transparent text-white hover:bg-white hover:text-emerald-700 hover:border-white transition-all duration-300 ease-in-out"
          >
            Add Product
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products..."
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
        data={filteredProducts}
        loading={loading}
        error={error}
        onRetry={fetchProducts}
        rowActions={renderActions}
        zebraStripes={true}
        emptyState={{
          icon: PackageSearch,
          title: searchTerm || categoryFilter !== "all" ? "No matching products" : "No products yet",
          description: searchTerm || categoryFilter !== "all"
            ? "Try adjusting your search or filters."
            : "Add your first product to get started.",
          action: searchTerm || categoryFilter !== "all" ? (
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
            <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>
              Add Product
            </Button>
          ),
        }}
      />
    </div>
  );
}
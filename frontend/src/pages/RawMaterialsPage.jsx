// src/pages/RawMaterialsPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  AlertTriangle,
  PackageSearch,
  Beaker,
  Scale,
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
  DataTable,
} from "../components/ui";

export default function RawMaterialsPage() {
  const { user } = useAuth();
  
  // Data state
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formError, setFormError] = useState("");
  
  // Form state - preserved field names
  const [form, setForm] = useState({
    materialName: "",
    unitType: "Kg",
    currentQuantity: "",
    lowStockLimit: "",
  });

  // Preserved API calls
  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/raw-materials");
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load raw materials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Form handlers - preserved business logic
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setForm({
      materialName: material.materialName,
      unitType: material.unitType,
      currentQuantity: material.currentQuantity,
      lowStockLimit: material.lowStockLimit,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      if (editingMaterial) {
        await api.put(`/raw-materials/${editingMaterial._id}`, form);
      } else {
        await api.post("/raw-materials", form);
      }
      setShowForm(false);
      setEditingMaterial(null);
      setForm({
        materialName: "",
        unitType: "Kg",
        currentQuantity: "",
        lowStockLimit: "",
      });
      fetchMaterials();
    } catch (err) {
      setFormError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMaterial(null);
    setForm({
      materialName: "",
      unitType: "Kg",
      currentQuantity: "",
      lowStockLimit: "",
    });
    setFormError("");
  };

  // Filtering logic
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        !searchTerm ||
        material.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.unitType?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [materials, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const totalMaterials = materials.length;
    const lowStock = materials.filter(
      (m) => m.currentQuantity <= m.lowStockLimit
    ).length;
    const inStock = materials.filter(
      (m) => m.currentQuantity > m.lowStockLimit
    ).length;

    return { totalMaterials, lowStock, inStock };
  }, [materials]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Table columns
  const columns = [
    {
      key: "materialName",
      label: "Material",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Beaker className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-800">{value}</span>
        </div>
      ),
    },
    {
      key: "unitType",
      label: "Unit",
      hideOnMobile: true,
      render: (value) => (
        <Badge variant="neutral" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: "currentQuantity",
      label: "Current Stock",
      align: "right",
      render: (value, item) => {
        const isLow = value <= item.lowStockLimit;
        return (
          <span className={`font-semibold ${isLow ? "text-amber-600" : "text-slate-700"}`}>
            {value} {item.unitType}
          </span>
        );
      },
    },
    {
      key: "lowStockLimit",
      label: "Low Stock Limit",
      align: "right",
      hideOnMobile: true,
      render: (value, item) => (
        <span className="text-slate-500">
          {value} {item.unitType}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, item) => {
        const isLow = item.currentQuantity <= item.lowStockLimit;
        return (
          <Badge
            variant={isLow ? "danger" : "success"}
            size="sm"
            dot={true}
          >
            {isLow ? "Low Stock" : "In Stock"}
          </Badge>
        );
      },
    },
  ];

  // Row actions
  const renderActions = (material) => (
    <button
      onClick={() => handleEdit(material)}
      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      aria-label={`Edit ${material.materialName}`}
    >
      <Edit className="h-4 w-4" />
    </button>
  );

  // If showing form
  if (showForm) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Materials
        </button>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {editingMaterial ? "Edit Material" : "New Raw Material"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingMaterial
                ? "Update material information"
                : "Add a new raw material to inventory"}
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Material Name
              </label>
              <input
                name="materialName"
                value={form.materialName}
                onChange={handleChange}
                placeholder="e.g. Stevia, Citrus Flavoring"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Unit Type
              </label>
              <select
                name="unitType"
                value={form.unitType}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option>Kg</option>
                <option>Liters</option>
                <option>Pcs</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Quantity
              </label>
              <input
                name="currentQuantity"
                type="number"
                value={form.currentQuantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Low Stock Alert
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
              <Button type="submit" variant="primary" icon={editingMaterial ? Edit : Plus}>
                {editingMaterial ? "Update Material" : "Save Material"}
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
        title="Raw Materials"
        subtitle="Manage production ingredients and supplies"
        stats={[
          { label: "Total Materials", value: stats.totalMaterials },
          { label: "Low Stock", value: stats.lowStock, highlight: stats.lowStock > 0 },
          { label: "In Stock", value: stats.inStock },
        ]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            onClick={() => setShowForm(true)}
            className="border-white bg-transparent text-white hover:bg-white hover:text-emerald-700 hover:border-white transition-all duration-300 ease-in-out"
          >
            Add Material
          </Button>
        }
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search materials..."
      />

      <DataTable
        columns={columns}
        data={filteredMaterials}
        loading={loading}
        error={error}
        onRetry={fetchMaterials}
        rowActions={renderActions}
        zebraStripes={true}
        emptyState={{
          icon: PackageSearch,
          title: searchTerm ? "No matching materials" : "No raw materials yet",
          description: searchTerm
            ? "Try adjusting your search."
            : "Add your first raw material to get started.",
          action: searchTerm ? (
            <Button variant="secondary" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>
              Add Material
            </Button>
          ),
        }}
      />
    </div>
  );
}
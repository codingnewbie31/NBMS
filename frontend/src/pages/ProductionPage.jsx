// src/pages/ProductionPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Factory,
  AlertTriangle,
  PackageSearch,
  Calendar,
  Box,
  Beaker,
  X,
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

export default function ProductionPage() {
  const { user } = useAuth();
  
  // Data state
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Form state - preserved field names
  const [form, setForm] = useState({
    batchNumber: "",
    productId: "",
    outputBottles: "",
    notes: "",
  });
  const [consumed, setConsumed] = useState([
    { materialId: "", quantityUsed: "" },
  ]);

  // Preserved API calls
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [batchRes, productRes, materialRes] = await Promise.all([
        api.get("/production-batches"),
        api.get("/products"),
        api.get("/raw-materials"),
      ]);
      setBatches(batchRes.data);
      setProducts(productRes.data);
      setMaterials(materialRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load production data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setForm((f) => ({ ...f, batchNumber: "BATCH-" + Date.now() }));
  }, []);

  // Form handlers - preserved business logic
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConsumedChange = (index, field, value) => {
    const updated = [...consumed];
    updated[index][field] = value;
    setConsumed(updated);
  };

  const addMaterial = () => {
    setConsumed([...consumed, { materialId: "", quantityUsed: "" }]);
  };

  const removeMaterial = (index) => {
    setConsumed(consumed.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      await api.post("/production-batches", {
        ...form,
        outputBottles: Number(form.outputBottles),
        rawMaterialsConsumed: consumed.map((c) => ({
          materialId: c.materialId,
          quantityUsed: Number(c.quantityUsed),
        })),
      });
      setShowForm(false);
      setForm({
        batchNumber: "BATCH-" + Date.now(),
        productId: "",
        outputBottles: "",
        notes: "",
      });
      setConsumed([{ materialId: "", quantityUsed: "" }]);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({
      batchNumber: "BATCH-" + Date.now(),
      productId: "",
      outputBottles: "",
      notes: "",
    });
    setConsumed([{ materialId: "", quantityUsed: "" }]);
    setFormError("");
  };

  // Filtering
  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const matchesSearch =
        !searchTerm ||
        batch.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [batches, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const totalBatches = batches.length;
    const totalOutput = batches.reduce((sum, b) => sum + (b.outputBottles || 0), 0);
    const recentBatches = batches.filter((b) => {
      const batchDate = new Date(b.manufacturingDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return batchDate >= weekAgo;
    }).length;

    return { totalBatches, totalOutput, recentBatches };
  }, [batches]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // If showing form
  if (showForm) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Batches
        </button>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              New Production Batch
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Record a new production run
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Batch Number
                </label>
                <input
                  name="batchNumber"
                  value={form.batchNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product
                </label>
                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">-- Select product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Output (Bottles)
                </label>
                <input
                  name="outputBottles"
                  type="number"
                  value={form.outputBottles}
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
            </div>

            {/* Raw Materials Consumed */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">
                  Raw Materials Consumed
                </h4>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  + Add Material
                </button>
              </div>
              <div className="space-y-2">
                {consumed.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center rounded-lg bg-slate-50 p-3"
                  >
                    <div className="col-span-5 sm:col-span-6">
                      <select
                        value={item.materialId}
                        onChange={(e) =>
                          handleConsumedChange(index, "materialId", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        required
                      >
                        <option value="">-- Select material --</option>
                        {materials.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.materialName} ({m.currentQuantity} {m.unitType})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-4 sm:col-span-4">
                      <input
                        type="number"
                        value={item.quantityUsed}
                        onChange={(e) =>
                          handleConsumedChange(index, "quantityUsed", e.target.value)
                        }
                        placeholder="Qty"
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        required
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex justify-center">
                      {consumed.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMaterial(index)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" icon={Factory}>
                Commit Batch
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

  // Main list view - Batch cards
  return (
    <div className="flex flex-col gap-6">
      <PageHero
        eyebrow={today}
        title="Production Batches"
        subtitle="Track manufacturing runs and material consumption"
        stats={[
          { label: "Total Batches", value: stats.totalBatches },
          { label: "Total Output", value: `${stats.totalOutput.toLocaleString()} bottles` },
          { label: "This Week", value: stats.recentBatches },
        ]}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            onClick={() => setShowForm(true)}
            className="border-white bg-transparent text-white hover:bg-white hover:text-emerald-700 hover:border-white transition-all duration-300 ease-in-out"
          >
            Log Batch
          </Button>
        }
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by batch number or product..."
      />

      {/* Batch Cards Grid */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-24 rounded-full bg-slate-100" />
                <div className="h-6 w-24 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-semibold text-red-800">Error</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Button variant="secondary" onClick={fetchData} className="mt-6">
            Try Again
          </Button>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12">
          <EmptyState
            icon={PackageSearch}
            title={searchTerm ? "No matching batches" : "No production batches yet"}
            description={
              searchTerm
                ? "Try adjusting your search."
                : "Log your first production batch to get started."
            }
            action={
              searchTerm ? (
                <Button variant="secondary" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              ) : (
                <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>
                  Log Batch
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBatches.map((batch) => (
            <Card key={batch._id} padding="lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                      <Factory className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {batch.batchNumber}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Product: {batch.productId?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Box className="h-3.5 w-3.5" />
                      {batch.outputBottles} bottles
                      {batch.productId && (
                        <span className="text-slate-400">
                          ({Math.floor(batch.outputBottles / batch.productId.caseCapacity)} cases)
                        </span>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(batch.manufacturingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {batch.notes && (
                  <p className="text-xs text-slate-400 italic">{batch.notes}</p>
                )}
              </div>

              {/* Materials consumed */}
              {batch.rawMaterialsConsumed?.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Materials consumed:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {batch.rawMaterialsConsumed.map((m, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                      >
                        <Beaker className="h-3 w-3" />
                        {m.materialId?.materialName || "N/A"}: {m.quantityUsed}{" "}
                        {m.materialId?.unitType}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
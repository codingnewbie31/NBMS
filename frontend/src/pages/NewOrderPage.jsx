// src/pages/NewOrderPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  ShoppingCart,
  User,
  Package,
  DollarSign,
  AlertTriangle,
  Receipt,
  Building2,
  Phone,
  MapPin,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button, Badge, Card } from "../components/ui";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data state
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([{ productId: "", qtyBottles: "" }]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    businessName: "",
    phoneNumber: "",
    area: "",
  });

  // Preserved API calls
  useEffect(() => {
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/products").then((res) => setProducts(res.data));
    api
      .get("/orders/next-number")
      .then((res) => setOrderNumber(res.data.orderNumber));
  }, []);

  // Customer handlers - preserved business logic
  const handleCustomerChange = (e) => {
    const customer = customers.find((c) => c._id === e.target.value);
    setSelectedCustomer(customer || null);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productId: "", qtyBottles: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getProduct = (productId) => {
    return products.find((p) => p._id === productId);
  };

  const calculateSubtotal = (item) => {
    const product = getProduct(item.productId);
    if (!product || !item.qtyBottles) return 0;
    const pricePerBottle = product.pricePerCase / product.caseCapacity;
    return pricePerBottle * Number(item.qtyBottles);
  };

  const grandTotal = items.reduce(
    (sum, item) => sum + calculateSubtotal(item),
    0
  );
  const outstandingBalance = grandTotal - Number(amountPaid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/orders", {
        orderNumber,
        customerId: selectedCustomer._id,
        items: items.map((item) => ({
          productId: item.productId,
          qtyBottles: Number(item.qtyBottles),
        })),
        amountPaid: Number(amountPaid),
      });
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNewCustomer = async () => {
    if (
      !newCustomer.customerName ||
      !newCustomer.businessName ||
      !newCustomer.phoneNumber
    ) {
      setError("Please fill in customer name, business name and phone number");
      return;
    }
    try {
      const res = await api.post("/customers", newCustomer);
      const created = res.data;
      setCustomers([...customers, created]);
      setSelectedCustomer(created);
      setShowNewCustomer(false);
      setNewCustomer({
        customerName: "",
        businessName: "",
        phoneNumber: "",
        area: "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create customer");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back button and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Orders
        </button>
        <h1 className="text-xl font-bold text-slate-900">New Order</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Order Number */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Receipt className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Order Number
                <span className="ml-1 font-normal text-slate-400">(auto-suggested)</span>
              </label>
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-mono font-semibold text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
          </div>
        </Card>

        {/* Customer Selection */}
        <Card title="Customer" icon={User}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Select or add a customer</p>
              <button
                type="button"
                onClick={() => setShowNewCustomer(!showNewCustomer)}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                {showNewCustomer ? "Cancel" : "+ Add New Customer"}
              </button>
            </div>

            {/* Inline new customer form */}
            {showNewCustomer && (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  New Customer Details
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Customer Name"
                    value={newCustomer.customerName}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, customerName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <input
                    placeholder="Business Name"
                    value={newCustomer.businessName}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, businessName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <input
                    placeholder="Phone Number"
                    value={newCustomer.phoneNumber}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <input
                    placeholder="Area (optional)"
                    value={newCustomer.area}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, area: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  icon={Plus}
                  size="sm"
                  onClick={handleAddNewCustomer}
                  className="mt-3"
                >
                  Save & Select Customer
                </Button>
              </div>
            )}

            {/* Customer dropdown */}
            {!showNewCustomer && (
              <select
                onChange={handleCustomerChange}
                value={selectedCustomer?._id || ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              >
                <option value="">-- Select a customer --</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.businessName} ({c.customerName})
                  </option>
                ))}
              </select>
            )}

            {/* Selected customer display */}
            {selectedCustomer && !showNewCustomer && (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {selectedCustomer.businessName}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedCustomer.customerName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedCustomer.phoneNumber}
                      </span>
                      {selectedCustomer.area && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedCustomer.area}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Outstanding balance warning */}
            {selectedCustomer?.currentBalance > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Outstanding balance: Rs. {selectedCustomer.currentBalance.toLocaleString()}
              </div>
            )}
          </div>
        </Card>

        {/* Order Items */}
        <Card title="Order Items" icon={Package}>
          <div className="space-y-3">
            {items.map((item, index) => {
              const product = getProduct(item.productId);
              const subtotal = calculateSubtotal(item);
              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end rounded-lg bg-slate-50 p-4"
                >
                  <div className="col-span-5 sm:col-span-5">
                    {index === 0 && (
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Product
                      </label>
                    )}
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
                  <div className="col-span-3 sm:col-span-3">
                    {index === 0 && (
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Qty (Bottles)
                      </label>
                    )}
                    <input
                      type="number"
                      value={item.qtyBottles}
                      onChange={(e) =>
                        handleItemChange(index, "qtyBottles", e.target.value)
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      required
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    {index === 0 && (
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Subtotal
                      </label>
                    )}
                    <div className="rounded-lg border border-slate-100 bg-white px-2 py-2.5 text-sm font-medium text-slate-700">
                      Rs. {subtotal.toFixed(0)}
                      {product && item.qtyBottles && (
                        <span className="block text-xs font-normal text-slate-400">
                          {Math.floor(Number(item.qtyBottles) / product.caseCapacity)} cases +{" "}
                          {Number(item.qtyBottles) % product.caseCapacity} bottles
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Another Product
          </button>
        </Card>

        {/* Payment Summary */}
        <Card title="Payment" icon={DollarSign}>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-500">Grand Total</span>
              <span className="text-xl font-bold text-slate-900">
                Rs. {grandTotal.toFixed(0)}
              </span>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Amount Paid Now
              </label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-medium text-slate-500">
                Outstanding Balance
              </span>
              <span
                className={`text-lg font-bold ${
                  outstandingBalance > 0 ? "text-amber-600" : "text-emerald-600"
                }`}
              >
                Rs. {outstandingBalance.toFixed(0)}
              </span>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={submitting}
          disabled={submitting || !selectedCustomer}
          icon={ShoppingCart}
        >
          {submitting ? "Creating Order..." : "Confirm Order"}
        </Button>
      </form>
    </div>
  );
}
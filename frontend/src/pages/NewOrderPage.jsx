import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function NewOrderPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/products").then((res) => setProducts(res.data));
    api
      .get("/orders/next-number")
      .then((res) => setOrderNumber(res.data.orderNumber));
  }, []);

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
    0,
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Orders
          </button>
          <h2 className="text-xl font-bold text-gray-700">New Order</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* order number field */}
          <div className="bg-white rounded-xl shadow p-5">
            <label className="block text-sm text-gray-600 mb-1">
              Order Number{" "}
              <span className="text-gray-400 text-xs">
                (auto-suggested, editable)
              </span>
            </label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Customer
              </label>
              <button
                type="button"
                onClick={() => setShowNewCustomer(!showNewCustomer)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                {showNewCustomer ? "— Cancel" : "+ Add New Customer"}
              </button>
            </div>

            {/* Inline new customer form */}
            {showNewCustomer && (
              <div className="bg-gray-50 rounded-lg p-4 mb-3 space-y-3">
                <p className="text-xs text-gray-500 font-medium">
                  New Customer Details
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="Customer Name"
                    value={newCustomer.customerName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        customerName: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    placeholder="Business Name"
                    value={newCustomer.businessName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    placeholder="Phone Number"
                    value={newCustomer.phoneNumber}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    placeholder="Area (optional)"
                    value={newCustomer.area}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, area: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddNewCustomer}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
                >
                  Save & Select Customer
                </button>
              </div>
            )}

            {/* Existing customer dropdown */}
            {!showNewCustomer && (
              <select
                onChange={handleCustomerChange}
                value={selectedCustomer?._id || ""}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Selected customer confirmation */}
            {selectedCustomer && !showNewCustomer && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                ✓ {selectedCustomer.businessName} selected
              </div>
            )}

            {/* Outstanding balance warning */}
            {selectedCustomer?.currentBalance > 0 && (
              <div className="mt-3 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded text-sm">
                ⚠️ This customer has an outstanding balance of Rs.{" "}
                {selectedCustomer.currentBalance.toLocaleString()}
              </div>
            )}
          </div>

          {/* Product Line Items */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Order Items
            </h3>
            <div className="space-y-3">
              {items.map((item, index) => {
                const product = getProduct(item.productId);
                const subtotal = calculateSubtotal(item);
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    <div className="col-span-5">
                      {index === 0 && (
                        <label className="block text-xs text-gray-500 mb-1">
                          Product
                        </label>
                      )}
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          handleItemChange(index, "productId", e.target.value)
                        }
                        className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="col-span-3">
                      {index === 0 && (
                        <label className="block text-xs text-gray-500 mb-1">
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
                        className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      {index === 0 && (
                        <label className="block text-xs text-gray-500 mb-1">
                          Subtotal
                        </label>
                      )}
                      <div className="border border-gray-100 bg-gray-50 rounded-lg px-2 py-2 text-sm text-gray-600">
                        Rs. {subtotal.toFixed(0)}
                        {product && (
                          <span className="text-xs text-gray-400 block">
                            {item.qtyBottles
                              ? Math.floor(
                                  Number(item.qtyBottles) /
                                    product.caseCapacity,
                                )
                              : 0}{" "}
                            cases +{" "}
                            {item.qtyBottles
                              ? Number(item.qtyBottles) % product.caseCapacity
                              : 0}{" "}
                            bottles
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-600 text-lg font-bold"
                        >
                          ×
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
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Another Product
            </button>
          </div>
          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Payment</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Grand Total</span>
                <span className="font-semibold text-gray-700">
                  Rs. {grandTotal.toFixed(0)}
                </span>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Amount Paid Now
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between text-sm border-t pt-3">
                <span className="text-gray-500">Outstanding Balance</span>
                <span
                  className={`font-semibold ${outstandingBalance > 0 ? "text-red-500" : "text-green-500"}`}
                >
                  Rs. {outstandingBalance.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || !selectedCustomer}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {submitting ? "Creating Order..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

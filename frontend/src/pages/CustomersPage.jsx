import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [form, setForm] = useState({
    customerName: '', businessName: '',
    phoneNumber: '', area: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (customerId) => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data.filter(p => p.customerId?._id === customerId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      customerName: customer.customerName,
      businessName: customer.businessName,
      phoneNumber: customer.phoneNumber,
      area: customer.area || ''
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
        await api.post('/customers', form);
      }
      setShowForm(false);
      setEditingCustomer(null);
      setForm({ customerName: '', businessName: '', phoneNumber: '', area: '' });
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
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
      await api.post('/payments', {
        customerId: selectedCustomer._id,
        amount: Number(paymentAmount)
      });
      setPaymentAmount('');
      fetchCustomers();
      fetchPayments(selectedCustomer._id);
      // update selected customer balance locally
      const res = await api.get('/customers');
      setCustomers(res.data);
      const updated = res.data.find(c => c._id === selectedCustomer._id);
      setSelectedCustomer(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setForm({ customerName: '', businessName: '', phoneNumber: '', area: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Customers</h2>
          {!showForm && !selectedCustomer && (
            <button onClick={() => setShowForm(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
              + Add Customer
            </button>
          )}
          {selectedCustomer && (
            <button onClick={() => setSelectedCustomer(null)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
              ← Back to Customers
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              {editingCustomer ? 'Edit Customer' : 'New Customer'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
                <input name="customerName" value={form.customerName} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Business Name</label>
                <input name="businessName" value={form.businessName} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Area</label>
                <input name="area" value={form.area} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
                <button type="button" onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Customer Ledger View */}
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">
                    {selectedCustomer.businessName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.phoneNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Outstanding Balance</p>
                  <p className={`text-2xl font-bold ${selectedCustomer.currentBalance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    Rs. {selectedCustomer.currentBalance?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Log Payment */}
              {selectedCustomer.currentBalance > 0 && (
                <form onSubmit={handleLogPayment} className="mt-4 flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Record Payment</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount received"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                    Log Payment
                  </button>
                </form>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="font-semibold text-gray-700 mb-3">Payment History</h4>
              {payments.length === 0 ? (
                <p className="text-gray-400 text-sm">No payments recorded yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-gray-500 text-xs uppercase border-b">
                    <tr>
                      <th className="pb-2 text-left">Date</th>
                      <th className="pb-2 text-left">Amount</th>
                      <th className="pb-2 text-left">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td className="py-2 text-gray-600">
                          {new Date(p.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 text-green-600 font-medium">
                          Rs. {p.amount?.toLocaleString()}
                        </td>
                        <td className="py-2 text-gray-500">
                          {p.recordedBy?.name || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Customers List */}
        {!selectedCustomer && !showForm && (
          loading ? (
            <p className="text-gray-400">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="text-gray-400">No customers yet.</p>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Business</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Area</th>
                    <th className="px-4 py-3 text-left">Balance</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-700">{c.businessName}</p>
                        <p className="text-gray-400 text-xs">{c.customerName}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.phoneNumber}</td>
                      <td className="px-4 py-3 text-gray-500">{c.area}</td>
                      <td className="px-4 py-3">
                        <span className={c.currentBalance > 0 ? 'text-red-500 font-semibold' : 'text-green-500'}>
                          Rs. {c.currentBalance?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-3">
                        <button onClick={() => handleSelectCustomer(c)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Ledger
                        </button>
                        <button onClick={() => handleEdit(c)}
                          className="text-gray-500 hover:text-gray-700 text-xs font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
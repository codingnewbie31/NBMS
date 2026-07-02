import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    expenseName: '',
    category: 'Staff Food/Allowances',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', form);
      setShowForm(false);
      setForm({
        expenseName: '',
        category: 'Staff Food/Allowances',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColors = {
    'Raw Materials': 'bg-blue-100 text-blue-700',
    'Transport & Fuel': 'bg-yellow-100 text-yellow-700',
    'Factory Maintenance': 'bg-orange-100 text-orange-700',
    'Utilities': 'bg-purple-100 text-purple-700',
    'Staff Food/Allowances': 'bg-green-100 text-green-700',
    'Miscellaneous': 'bg-gray-100 text-gray-700'
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-700">Expenses</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total logged: Rs. {totalExpenses.toLocaleString()}
            </p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
              + Log Expense
            </button>
          )}
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">New Expense</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input name="expenseName" value={form.expenseName} onChange={handleChange}
                  placeholder="e.g. Lunch allowance for 6 factory workers"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Raw Materials</option>
                  <option>Transport & Fuel</option>
                  <option>Factory Maintenance</option>
                  <option>Utilities</option>
                  <option>Staff Food/Allowances</option>
                  <option>Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Amount (Rs.)</label>
                <input name="amount" type="number" value={form.amount} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                <input name="notes" value={form.notes} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
                  Save Expense
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        {loading ? (
          <p className="text-gray-400">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-400">No expenses logged yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map(e => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {e.expenseName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[e.category]}`}>
                        {e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-600 font-semibold">
                      Rs. {e.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {e.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
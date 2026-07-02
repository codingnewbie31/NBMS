import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [form, setForm] = useState({
    materialName: '',
    unitType: 'Kg',
    currentQuantity: '',
    lowStockLimit: ''
  });
  const [error, setError] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/raw-materials');
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setForm({
      materialName: material.materialName,
      unitType: material.unitType,
      currentQuantity: material.currentQuantity,
      lowStockLimit: material.lowStockLimit
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingMaterial) {
        await api.put(`/raw-materials/${editingMaterial._id}`, form);
      } else {
        await api.post('/raw-materials', form);
      }
      setShowForm(false);
      setEditingMaterial(null);
      setForm({ materialName: '', unitType: 'Kg', currentQuantity: '', lowStockLimit: '' });
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMaterial(null);
    setForm({ materialName: '', unitType: 'Kg', currentQuantity: '', lowStockLimit: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Raw Materials</h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
              + Add Material
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              {editingMaterial ? 'Edit Material' : 'New Raw Material'}
            </h3>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Material Name</label>
                <input name="materialName" value={form.materialName} onChange={handleChange}
                  placeholder="e.g. Stevia, Citrus Flavoring"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Unit Type</label>
                <select name="unitType" value={form.unitType} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Kg</option>
                  <option>Liters</option>
                  <option>Pcs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Quantity</label>
                <input name="currentQuantity" type="number" value={form.currentQuantity}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Low Stock Alert</label>
                <input name="lowStockLimit" type="number" value={form.lowStockLimit}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
                  {editingMaterial ? 'Update Material' : 'Save Material'}
                </button>
                <button type="button" onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Materials List */}
        {loading ? (
          <p className="text-gray-400">Loading materials...</p>
        ) : materials.length === 0 ? (
          <p className="text-gray-400">No raw materials added yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Material</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Current Stock</th>
                  <th className="px-4 py-3 text-left">Low Stock Limit</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {materials.map(m => {
                  const isLow = m.currentQuantity <= m.lowStockLimit;
                  return (
                    <tr key={m._id} className={isLow ? 'bg-red-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {m.materialName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{m.unitType}</td>
                      <td className="px-4 py-3">
                        <span className={isLow ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                          {m.currentQuantity} {m.unitType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {m.lowStockLimit} {m.unitType}
                      </td>
                      <td className="px-4 py-3">
                        {isLow ? (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            ⚠️ Low Stock
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleEdit(m)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
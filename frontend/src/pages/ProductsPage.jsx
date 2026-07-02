import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', category: 'Water', caseCapacity: '',
    pricePerCase: '', pricePerBottle: '', costPrice: '',
    stockBottles: '', lowStockLimit: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

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
      lowStockLimit: product.lowStockLimit
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, form);
      } else {
        await api.post('/products', form);
      }
      setShowForm(false);
      setEditingProduct(null);
      setForm({
        name: '', category: 'Water', caseCapacity: '',
        pricePerCase: '', pricePerBottle: '', costPrice: '',
        stockBottles: '', lowStockLimit: ''
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
      name: '', category: 'Water', caseCapacity: '',
      pricePerCase: '', pricePerBottle: '', costPrice: '',
      stockBottles: '', lowStockLimit: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Products</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm"
            >
              + Add Product
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Water</option>
                  <option>Juice</option>
                  <option>Soft Drinks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Bottles per Case</label>
                <input name="caseCapacity" type="number" value={form.caseCapacity} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price per Case (Rs.)</label>
                <input name="pricePerCase" type="number" value={form.pricePerCase} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price per Bottle (Rs.)</label>
                <input name="pricePerBottle" type="number" value={form.pricePerBottle} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cost Price per Case (Rs.)</label>
                <input name="costPrice" type="number" value={form.costPrice} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Stock (Bottles)</label>
                <input name="stockBottles" type="number" value={form.stockBottles} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Low Stock Alert (Bottles)</label>
                <input name="lowStockLimit" type="number" value={form.lowStockLimit} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
                <button type="button" onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400">No products yet. Add your first product above.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Case Size</th>
                  <th className="px-4 py-3 text-left">Price/Case</th>
                  <th className="px-4 py-3 text-left">Cost/Case</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p._id} className={p.stockBottles <= p.lowStockLimit ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 font-medium text-gray-700">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3 text-gray-500">{p.caseCapacity} bottles</td>
                    <td className="px-4 py-3 text-gray-500">Rs. {p.pricePerCase}</td>
                    <td className="px-4 py-3 text-gray-500">Rs. {p.costPrice}</td>
                    <td className="px-4 py-3">
                      <span className={p.stockBottles <= p.lowStockLimit ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                        {p.stockBottles} bottles
                        ({Math.floor(p.stockBottles / p.caseCapacity)} cases)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        Edit
                      </button>
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
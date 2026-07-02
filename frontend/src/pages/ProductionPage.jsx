import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function ProductionPage() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    batchNumber: '',
    productId: '',
    outputBottles: '',
    notes: ''
  });
  const [consumed, setConsumed] = useState([
    { materialId: '', quantityUsed: '' }
  ]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [batchRes, productRes, materialRes] = await Promise.all([
        api.get('/production-batches'),
        api.get('/products'),
        api.get('/raw-materials')
      ]);
      setBatches(batchRes.data);
      setProducts(productRes.data);
      setMaterials(materialRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-generate batch number
    setForm(f => ({ ...f, batchNumber: 'BATCH-' + Date.now() }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConsumedChange = (index, field, value) => {
    const updated = [...consumed];
    updated[index][field] = value;
    setConsumed(updated);
  };

  const addMaterial = () => {
    setConsumed([...consumed, { materialId: '', quantityUsed: '' }]);
  };

  const removeMaterial = (index) => {
    setConsumed(consumed.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/production-batches', {
        ...form,
        outputBottles: Number(form.outputBottles),
        rawMaterialsConsumed: consumed.map(c => ({
          materialId: c.materialId,
          quantityUsed: Number(c.quantityUsed)
        }))
      });
      setShowForm(false);
      setForm({ batchNumber: 'BATCH-' + Date.now(), productId: '', outputBottles: '', notes: '' });
      setConsumed([{ materialId: '', quantityUsed: '' }]);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Production Batches</h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
              + Log Batch
            </button>
          )}
        </div>

        {/* Batch Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">New Production Batch</h3>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Batch Number</label>
                  <input name="batchNumber" value={form.batchNumber} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Product</label>
                  <select name="productId" value={form.productId} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required>
                    <option value="">-- Select product --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Output (Bottles)</label>
                  <input name="outputBottles" type="number" value={form.outputBottles}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                  <input name="notes" value={form.notes} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Raw Materials Consumed */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Raw Materials Consumed
                </h4>
                <div className="space-y-2">
                  {consumed.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <select value={item.materialId}
                          onChange={e => handleConsumedChange(index, 'materialId', e.target.value)}
                          className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required>
                          <option value="">-- Select material --</option>
                          {materials.map(m => (
                            <option key={m._id} value={m._id}>
                              {m.materialName} ({m.currentQuantity} {m.unitType} left)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <input type="number" value={item.quantityUsed}
                          onChange={e => handleConsumedChange(index, 'quantityUsed', e.target.value)}
                          placeholder="Qty used"
                          className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        {consumed.length > 1 && (
                          <button type="button" onClick={() => removeMaterial(index)}
                            className="text-red-400 hover:text-red-600 text-lg font-bold">
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addMaterial}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  + Add Material
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
                  Commit Batch
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Batches List */}
        {loading ? (
          <p className="text-gray-400">Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="text-gray-400">No production batches logged yet.</p>
        ) : (
          <div className="space-y-3">
            {batches.map(batch => (
              <div key={batch._id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-700">{batch.batchNumber}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Product: {batch.productId?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Output: {batch.outputBottles} bottles
                      ({batch.productId ? Math.floor(batch.outputBottles / batch.productId.caseCapacity) : 0} cases)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(batch.manufacturingDate).toLocaleDateString()}
                    </p>
                    {batch.notes && (
                      <p className="text-xs text-gray-400 mt-1">{batch.notes}</p>
                    )}
                  </div>
                </div>
                {batch.rawMaterialsConsumed?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 font-medium mb-1">Materials consumed:</p>
                    <div className="flex flex-wrap gap-2">
                      {batch.rawMaterialsConsumed.map((m, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {m.materialId?.materialName || 'N/A'}: {m.quantityUsed} {m.materialId?.unitType}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
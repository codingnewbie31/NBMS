import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Orders</h2>
          <button
            onClick={() => navigate('/orders/new')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm"
          >
            + New Order
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Order #</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Paid</th>
                  <th className="px-4 py-3 text-left">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.customerId?.businessName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      Rs. {order.grandTotal?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-green-600">
                      Rs. {order.amountPaid?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={order.outstandingBalance > 0 ? 'text-red-500 font-semibold' : 'text-green-500'}>
                        Rs. {order.outstandingBalance?.toLocaleString()}
                      </span>
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
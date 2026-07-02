import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">Today's Revenue</p>
            <p className="text-2xl font-bold text-blue-700">
              Rs. {data?.todayRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">Total Receivables</p>
            <p className="text-2xl font-bold text-orange-500">
              Rs. {data?.totalReceivables?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500 mb-1">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-red-500">
              {data?.lowStockProducts?.length || 0} Products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Stock Warnings */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-700 mb-3">
              ⚠️ Low Stock Warnings
            </h2>
            {data?.lowStockProducts?.length === 0 ? (
              <p className="text-gray-400 text-sm">All products are sufficiently stocked</p>
            ) : (
              <ul className="space-y-2">
                {data?.lowStockProducts?.map(p => (
                  <li key={p._id} className="text-sm text-red-600 flex justify-between">
                    <span>{p.name}</span>
                    <span>{p.stockBottles} bottles remaining</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-700 mb-3">Recent Orders</h2>
            {data?.recentOrders?.length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet</p>
            ) : (
              <ul className="space-y-2">
                {data?.recentOrders?.map(order => (
                  <li key={order._id} className="flex justify-between text-sm border-b pb-2">
                    <div>
                      <p className="font-medium text-gray-700">
                        {order.customerId?.businessName}
                      </p>
                      <p className="text-gray-400">{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-700">
                        Rs. {order.grandTotal?.toLocaleString()}
                      </p>
                      <p className={order.outstandingBalance > 0 ? 'text-red-500 text-xs' : 'text-green-500 text-xs'}>
                        {order.outstandingBalance > 0 ? `Rs. ${order.outstandingBalance} due` : 'Paid'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
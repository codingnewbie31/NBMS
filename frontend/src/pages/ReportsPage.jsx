import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function ReportsPage() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/reports/summary?startDate=${startDate}&endDate=${endDate}`);
      setReport(res.data);
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const MetricRow = ({ label, value, highlight, border }) => (
    <div className={`flex justify-between items-center py-3 ${border ? 'border-t-2 border-gray-200 mt-2' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
        {label}
      </span>
      <span className={`font-semibold ${highlight ? 'text-lg text-blue-700' : 'text-gray-700'}`}>
        Rs. {value?.toLocaleString() || 0}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Reports & Analytics</h2>

        {/* Date Range Selector */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Date Range</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input type="date" value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input type="date" value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Quick range buttons */}
          <div className="flex gap-2 mb-4">
            {[
              { label: 'Today', days: 0 },
              { label: 'This Week', days: 7 },
              { label: 'This Month', days: 30 },
            ].map(({ label, days }) => (
              <button key={label}
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - days);
                  setEndDate(end.toISOString().split('T')[0]);
                  setStartDate(start.toISOString().split('T')[0]);
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition">
                {label}
              </button>
            ))}
          </div>

          <button onClick={fetchReport} disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition text-sm font-medium disabled:opacity-50">
            {loading ? 'Generating Report...' : 'Generate Report'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Report Results */}
        {report && (
          <div className="space-y-4">
            {/* Summary Header */}
            <div className="bg-blue-700 text-white rounded-xl p-5">
              <p className="text-blue-200 text-sm mb-1">
                {new Date(report.dateRange.startDate).toLocaleDateString()} —{' '}
                {new Date(report.dateRange.endDate).toLocaleDateString()}
              </p>
              <p className="text-3xl font-bold">
                Rs. {report.netProfit?.toLocaleString()}
              </p>
              <p className="text-blue-200 text-sm mt-1">Net Operating Profit</p>
              <p className="text-blue-200 text-xs mt-2">
                {report.orderCount} orders in this period
              </p>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="font-semibold text-gray-700 mb-2">Profit Breakdown</h3>
              <MetricRow label="Gross Revenue" value={report.grossRevenue} />
              <MetricRow label="(-) Cost of Goods" value={report.totalCostOfGoods} />
              <MetricRow label="Gross Margin" value={report.grossMargin} border />
              <MetricRow label="(-) Operating Expenses" value={report.totalExpenses} />
              <MetricRow label="★ Net Profit" value={report.netProfit} highlight border />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// src/pages/ReportsPage.jsx
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  Receipt,
  Package,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button, Card, PageHero, Badge } from "../components/ui";

export default function ReportsPage() {
  const { user } = useAuth();
  
  const today = new Date().toISOString().split("T")[0];
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];

  // Preserved state
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preserved API call
  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/reports/summary?startDate=${startDate}&endDate=${endDate}`
      );
      setReport(res.data);
    } catch (err) {
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  // Metric row component
  const MetricRow = ({ label, value, highlight, border, icon: Icon }) => (
    <div
      className={`flex items-center justify-between py-3 ${
        border ? "border-t-2 border-slate-200 mt-2 pt-4" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <span
          className={`text-sm ${
            highlight ? "font-bold text-slate-900" : "text-slate-500"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`font-semibold ${
          highlight ? "text-lg text-emerald-700" : "text-slate-700"
        }`}
      >
        Rs. {value?.toLocaleString() || 0}
      </span>
    </div>
  );

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHero
        eyebrow={todayDate}
        title="Reports & Analytics"
        subtitle="Generate financial summaries and analyze performance"
        variant="emerald"
      />

      {/* Date Range Selector */}
      <Card
        title="Select Date Range"
        icon={Calendar}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Quick range buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "Today", days: 0 },
            { label: "This Week", days: 7 },
            { label: "This Month", days: 30 },
            { label: "Last Month", days: 60 },
          ].map(({ label, days }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - days);
                if (days === 0) {
                  setEndDate(end.toISOString().split("T")[0]);
                  setStartDate(end.toISOString().split("T")[0]);
                } else if (days === 60) {
                  const lastMonthEnd = new Date(
                    end.getFullYear(),
                    end.getMonth(),
                    0
                  );
                  const lastMonthStart = new Date(
                    end.getFullYear(),
                    end.getMonth() - 1,
                    1
                  );
                  setEndDate(lastMonthEnd.toISOString().split("T")[0]);
                  setStartDate(lastMonthStart.toISOString().split("T")[0]);
                } else {
                  setEndDate(end.toISOString().split("T")[0]);
                  setStartDate(start.toISOString().split("T")[0]);
                }
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {label}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          icon={BarChart3}
          fullWidth
          loading={loading}
          onClick={fetchReport}
          className="mt-4"
        >
          {loading ? "Generating Report..." : "Generate Report"}
        </Button>
      </Card>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Report Results */}
      {report && (
        <div className="space-y-5">
          {/* Summary Card */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-700 p-6 sm:p-8 shadow-lg shadow-emerald-900/5">
            <div className="relative">
              <p className="text-sm font-medium text-emerald-100/80">
                {new Date(report.dateRange.startDate).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}{" "}
                —{" "}
                {new Date(report.dateRange.endDate).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  Rs. {report.netProfit?.toLocaleString()}
                </p>
                <Badge variant="success" size="md" className="mb-1">
                  Net Profit
                </Badge>
              </div>
              <p className="mt-2 text-sm text-emerald-100/70">
                {report.orderCount} orders processed in this period
              </p>
            </div>
          </div>

          {/* Profit Breakdown */}
          <Card
            title="Profit Breakdown"
            icon={TrendingUp}
          >
            <MetricRow
              label="Gross Revenue"
              value={report.grossRevenue}
              icon={DollarSign}
            />
            <MetricRow
              label="(-) Cost of Goods"
              value={report.totalCostOfGoods}
              icon={Package}
            />
            <MetricRow
              label="Gross Margin"
              value={report.grossMargin}
              icon={TrendingUp}
              border
            />
            <MetricRow
              label="(-) Operating Expenses"
              value={report.totalExpenses}
              icon={Receipt}
            />
            <MetricRow
              label="Net Profit"
              value={report.netProfit}
              highlight
              border
              icon={DollarSign}
            />
          </Card>

          {/* Additional metrics if available */}
          {report.orderCount > 0 && (
            <Card
              title="Period Summary"
              icon={BarChart3}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium uppercase text-slate-500">
                    Orders
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {report.orderCount}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-xs font-medium uppercase text-emerald-600">
                    Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    Rs. {report.grossRevenue?.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 text-center">
                  <p className="text-xs font-medium uppercase text-amber-600">
                    Expenses
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-700">
                    Rs. {report.totalExpenses?.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty state */}
      {!report && !loading && !error && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-700">
            No Report Generated
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Select a date range and click "Generate Report" to view financial
            analytics.
          </p>
        </div>
      )}
    </div>
  );
}
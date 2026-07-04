import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Clock,
  Factory,
  AlertTriangle,
  ClipboardList,
  Zap,
  PlusCircle,
  Boxes,
  BarChart3,
  Activity,
  PackageSearch,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  PageHeader,
  StatCard,
  Card,
  Button,
  Badge,
  EmptyState,
  LoadingSpinner,
} from "../components/ui";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unchanged data fetch: same endpoint, same shape
  useEffect(() => {
    api
      .get("/reports/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner fullScreen label="Loading dashboard..." />;

  const lowStockCount =
    (data?.lowStockProducts?.length || 0) + (data?.lowStockMaterials?.length || 0);
  const recentOrders = data?.recentOrders || [];

  // Formatted date for the page header eyebrow
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page header: date, greeting, subtitle */}
      <PageHeader
        eyebrow={today}
        title={`Welcome back, ${user?.name || user?.username || "Operator"}`}
        subtitle="Here's what's happening across the plant today."
      />

      {/* Row 1: key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Sales"
          value={`Rs. ${(data?.todayRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          label="Pending Orders"
          value="—"
          icon={Clock}
          accent="amber"
          trend={{ direction: "flat", value: "No data source yet" }}
        />
        <StatCard
          label="Current Production"
          value="—"
          icon={Factory}
          accent="sky"
          trend={{ direction: "flat", value: "No data source yet" }}
        />
        <StatCard
          label="Inventory Alerts"
          value={`${lowStockCount} Items`}
          icon={AlertTriangle}
          accent="rose"
        />
      </div>

      {/* Row 2: recent orders (70%) + quick actions (30%) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[7fr_3fr]">
        {/* Recent orders table */}
        <Card title="Recent Orders" icon={ClipboardList} padding="none">
          {recentOrders.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={PackageSearch}
                title="No orders yet"
                description="New orders will appear here as they come in."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Order #</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-700">
                        {order.customerId?.businessName || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-400">{order.orderNumber}</td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-900">
                        Rs. {order.grandTotal?.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {order.outstandingBalance > 0 ? (
                          <Badge variant="danger">Rs. {order.outstandingBalance} Due</Badge>
                        ) : (
                          <Badge variant="success">Paid</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick action shortcuts, stacked for one-glance scanning */}
        <Card title="Quick Actions" icon={Zap}>
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              icon={PlusCircle}
              size="lg"
              fullWidth
              onClick={() => navigate("/orders/new")}
            >
              New Order
            </Button>
            <Button
              variant="secondary"
              icon={Factory}
              size="lg"
              fullWidth
              onClick={() => navigate("/production")}
            >
              Production
            </Button>
            <Button
              variant="secondary"
              icon={Boxes}
              size="lg"
              fullWidth
              onClick={() => navigate("/inventory")}
            >
              Inventory
            </Button>
            <Button
              variant="secondary"
              icon={BarChart3}
              size="lg"
              fullWidth
              onClick={() => navigate("/reports")}
            >
              Reports
            </Button>
          </div>
        </Card>
      </div>

      {/* Row 3: recent activity timeline */}
      <Card title="Recent Activity" icon={Activity}>
        <EmptyState
          icon={Activity}
          title="No activity feed available"
          description="This will populate once an activity-log endpoint is added to the backend."
        />
      </Card>
    </div>
  );
}
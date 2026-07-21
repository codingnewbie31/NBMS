// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  PlusCircle,
  Factory,
  Boxes,
  BarChart3,  
  DollarSign,
  ClipboardList,
  Package,
  Users,
  AlertTriangle,
  PackageSearch,
  TrendingUp,
  ArrowRight,
  ShoppingCart,
  FileText,
  Activity,
} from "lucide-react";
import { StatCard, Card, Badge, EmptyState, LoadingSpinner, PageHero } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading)
    return <LoadingSpinner fullScreen label="Loading dashboard..." />;

  const recentOrders = data?.recentOrders || [];
  const lowStockProducts = data?.lowStockProducts || [];
  const lowStockMaterials = data?.lowStockMaterials || [];
  const hasAlerts = lowStockProducts.length + lowStockMaterials.length > 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Quick action cards configuration
  const quickActions = [
    {
      title: "New Order",
      description: "Create a customer order",
      icon: ShoppingCart,
      iconColor: "text-emerald-600",
      path: "/orders/new",
    },
    {
      title: "Add Product",
      description: "Register new beverage",
      icon: Package,
      iconColor: "text-blue-600",
      path: "/products/new",
    },
    {
      title: "Production",
      description: "Manage production runs",
      icon: Factory,
      iconColor: "text-amber-600",
      path: "/production",
    },
    {
      title: "Reports",
      description: "View analytics & insights",
      icon: FileText,
      iconColor: "text-violet-600",
      path: "/reports",
    },
  ];

  // Recent activity feed derived from actual data
  const activityFeed = recentOrders.slice(0, 5).map((order) => ({
    id: order._id,
    type: "order",
    title: `Order #${order.orderNumber}`,
    description: `${order.customerId?.businessName || "Customer"} — Rs. ${order.grandTotal?.toLocaleString()}`,
    status: order.outstandingBalance > 0 ? "pending" : "completed",
    time: order.createdAt || order.updatedAt,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Hero */}
      <PageHero
        eyebrow={today}
        title={`Welcome back, ${user?.name || user?.username || "Operator"}`}
        subtitle="Here's your plant overview for today. Stay on top of operations."
        className="from-emerald-600 via-emerald-700 to-teal-800 shadow-emerald-900/10"
      />

      {/* KPI Cards using StatCard component */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value="—"
          icon={ClipboardList}
          accent="slate"
          trend={{ direction: "flat", value: "No data source yet" }}
        />
        <StatCard
          label="Today's Revenue"
          value={`Rs. ${(data?.todayRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          accent="emerald"
          trend={{ direction: "up", value: "Revenue collected today" }}
        />
        <StatCard
          label="Products"
          value="—"
          icon={Package}
          accent="slate"
          trend={{ direction: "flat", value: "No data source yet" }}
        />
        <StatCard
          label="Customers"
          value="—"
          icon={Users}
          accent="slate"
          trend={{ direction: "flat", value: "No data source yet" }}
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <span className="text-xs text-slate-400">Frequently used shortcuts</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 transition-colors group-hover:bg-slate-100">
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <h3 className="font-semibold text-slate-900">{action.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{action.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3 w-3" />
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-transparent to-transparent transition-all duration-300 group-hover:from-emerald-400 group-hover:via-emerald-500 group-hover:to-emerald-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Recent Orders + Sidebar */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_3fr]">
        {/* Recent Orders using Card component */}
        <Card
          title="Recent Orders"
          subtitle="Latest customer transactions"
          icon={ClipboardList}
          padding="none"
          actions={
            recentOrders.length > 0 && (
              <button
                onClick={() => navigate("/orders")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                View all
              </button>
            )
          }
        >
          {recentOrders.length === 0 ? (
            <div className="p-8">
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
                  <tr className="bg-slate-50/50 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Order #</th>
                    <th className="px-6 py-3.5 text-right">Amount</th>
                    <th className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="transition-colors hover:bg-emerald-50/30">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {order.customerId?.businessName || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-slate-500">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-900">
                          Rs. {order.grandTotal?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge
                          variant={order.outstandingBalance > 0 ? "warning" : "success"}
                          size="md"
                        >
                          {order.outstandingBalance > 0
                            ? `Rs. ${order.outstandingBalance} Due`
                            : "Paid"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-5 h-full">

          {/* Inventory Alerts */}
          <Card
            title="Inventory Alerts"
            subtitle={hasAlerts ? `${lowStockProducts.length + lowStockMaterials.length} items low` : undefined}
            icon={AlertTriangle}
            padding="none"
            className="flex-1 flex flex-col"
          >
            <div className="p-4">
              {!hasAlerts ? (
                <EmptyState
                  icon={PackageSearch}
                  title="All stock levels are healthy"
                  description="No low stock alerts at this time."
                />
              ) : (
                <ul className="space-y-3">
                  {lowStockProducts.map((p) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50/50 px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">Product</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                        {p.stockBottles} left
                      </span>
                    </li>
                  ))}
                  {lowStockMaterials.map((m) => (
                    <li
                      key={m._id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{m.materialName}</p>
                        <p className="text-xs text-slate-400">Material</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                        {m.currentQuantity} {m.unitType}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card
        title="Recent Activity"
        subtitle="Latest updates from your plant"
        icon={Activity}
        padding="none"
      >
        {activityFeed.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Activity will appear here as orders are created."
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {activityFeed.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    activity.status === "completed" ? "bg-emerald-100" : "bg-amber-100"
                  }`}
                >
                  {activity.status === "completed" ? (
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-400">{activity.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === "completed" ? "success" : "warning"} size="sm">
                    {activity.status === "completed" ? "Completed" : "Pending"}
                  </Badge>
                  {activity.time && (
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(activity.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
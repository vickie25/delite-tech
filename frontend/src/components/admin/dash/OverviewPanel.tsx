import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Eye } from "lucide-react";
import { Button } from "../../ui/Button";

type OverviewTotals = {
  customers: number;
  orders: number;
  products: number;
  revenue: number;
  revenueToday?: number;
  revenueWeek?: number;
  revenueMonth?: number;
  lowStockAlerts?: number;
};

type Props = {
  isDarkMode: boolean;
  revenuePeriod: "today" | "week" | "month" | "all";
  setRevenuePeriod: (p: "today" | "week" | "month" | "all") => void;
  chartGranularity: "daily" | "weekly" | "monthly";
  setChartGranularity: (g: "daily" | "weekly" | "monthly") => void;
  overview: { totals: OverviewTotals; orderStatus: Record<string, number>; badges?: { pendingReviews?: number } } | null;
  analytics: {
    revenueByDay?: { date: string; revenue: number }[];
    categoryPerformance?: { name: string; revenue: number }[];
    bestSellers?: { productId: number; name: string; qty: number; revenue: number }[];
    orderStatusBreakdown?: Record<string, number>;
  } | null;
  orders: any[];
  customers: any[];
  onViewOrder: (id: number) => void;
};

const COLORS = ["#CA8A04", "#18181B", "#71717A", "#A16207", "#D4D4D8"];

export default function OverviewPanel({
  isDarkMode,
  revenuePeriod,
  setRevenuePeriod,
  chartGranularity,
  setChartGranularity,
  overview,
  analytics,
  orders,
  customers,
  onViewOrder,
}: Props) {
  const totals = overview?.totals;
  const rev =
    revenuePeriod === "today"
      ? totals?.revenueToday ?? 0
      : revenuePeriod === "week"
        ? totals?.revenueWeek ?? 0
        : revenuePeriod === "month"
          ? totals?.revenueMonth ?? 0
          : totals?.revenue ?? 0;

  const lineData = (() => {
    const raw = analytics?.revenueByDay || [];
    if (chartGranularity === "daily") return raw.map((d) => ({ label: d.date.slice(5), revenue: d.revenue }));
    if (chartGranularity === "weekly") {
      const buckets = new Map<string, number>();
      for (const d of raw) {
        const dt = new Date(d.date);
        const wk = `${dt.getFullYear()}-W${Math.ceil((dt.getDate() + 6 - dt.getDay()) / 7)}`;
        buckets.set(wk, (buckets.get(wk) || 0) + d.revenue);
      }
      return [...buckets.entries()].map(([label, revenue]) => ({ label, revenue }));
    }
    const mb = new Map<string, number>();
    for (const d of raw) {
      const m = d.date.slice(0, 7);
      mb.set(m, (mb.get(m) || 0) + d.revenue);
    }
    return [...mb.entries()].map(([label, revenue]) => ({ label, revenue }));
  })();

  const pieData = (analytics?.categoryPerformance || []).map((c) => ({
    name: c.name,
    value: Math.round(c.revenue),
  }));

  const barTop = [...(analytics?.bestSellers || [])]
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
    .map((b) => ({ name: b.name.length > 22 ? `${b.name.slice(0, 22)}…` : b.name, sold: b.qty }));

  const status = analytics?.orderStatusBreakdown || overview?.orderStatus || {};
  const stackedStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  const stackedRow = {
    name: "Orders",
    ...Object.fromEntries(stackedStatuses.map((s) => [s, Number((status as any)[s] || 0)])),
  };

  const topCustomers = [...customers]
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, 5);

  const cardCls = `p-5 rounded-xl border shadow-sm ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Overview</h2>
          <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">Electronics store performance</p>
        </div>
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 bg-zinc-50 dark:bg-zinc-900">
          {(["today", "week", "month", "all"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRevenuePeriod(p)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md capitalize ${
                revenuePeriod === p
                  ? "bg-black text-white dark:bg-cta dark:text-black"
                  : "text-zinc-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {p === "all" ? "All time" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
        {[
          { label: "Total revenue", value: `KSh ${Math.round(rev).toLocaleString()}`, sub: revenuePeriod },
          { label: "Total orders", value: String(totals?.orders ?? 0), sub: "All statuses" },
          { label: "Total products", value: String(totals?.products ?? 0), sub: "Catalog" },
          { label: "Total customers", value: String(totals?.customers ?? 0), sub: "Registered" },
          { label: "Pending orders", value: String(overview?.orderStatus?.pending ?? 0), sub: "Action needed" },
          { label: "Low stock alerts", value: String(totals?.lowStockAlerts ?? 0), sub: "At or below reorder" },
        ].map((k) => (
          <div key={k.label} className={cardCls}>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{k.label}</p>
            <p className={`text-xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>{k.value}</p>
            <p className="text-[10px] text-zinc-500 mt-1 capitalize">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={cardCls}>
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            <h3 className={`text-lg font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Revenue over time</h3>
            <div className="flex gap-1">
              {(["daily", "weekly", "monthly"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setChartGranularity(g)}
                  className={`text-[10px] font-bold px-2 py-1 rounded capitalize ${
                    chartGranularity === g ? "bg-cta/20 text-cta" : "text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData.length ? lineData : [{ label: "-", revenue: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272A" : "#F4F4F5"} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#71717A" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#71717A" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: isDarkMode ? "#09090B" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#CA8A04" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className={`text-lg font-bodoni font-bold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>Sales by category</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length ? pieData : [{ name: "None", value: 1 }]}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {(pieData.length ? pieData : [{ name: "None", value: 1 }]).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={cardCls}>
          <h3 className={`text-lg font-bodoni font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>Top selling products</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={barTop.length ? barTop : [{ name: "-", sold: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? "#27272A" : "#F4F4F5"} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#71717A" }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10, fill: "#71717A" }} />
                <Tooltip />
                <Bar dataKey="sold" fill="#CA8A04" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className={`text-lg font-bodoni font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>Order status breakdown</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[stackedRow]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272A" : "#F4F4F5"} />
                <XAxis dataKey="name" hide />
                <YAxis tick={{ fontSize: 10, fill: "#71717A" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {stackedStatuses.map((s, i) => (
                  <Bar key={s} dataKey={s} stackId="a" fill={COLORS[i % COLORS.length]} name={s} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 ${cardCls} overflow-hidden p-0`}>
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className={`text-lg font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Recent orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id} className={isDarkMode ? "text-zinc-200" : "text-zinc-800"}>
                    <td className="px-5 py-3 font-bold">#{o.orderNumber}</td>
                    <td className="px-5 py-3">{o.customer?.name || o.customerName}</td>
                    <td className="px-5 py-3">{o.items?.length ?? 0}</td>
                    <td className="px-5 py-3 font-bold">KSh {Number(o.totalAmount).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cta/10 text-cta">{o.status}</span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-[12px]">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <Button type="button" variant="outline" className="!h-8 !px-3 !text-[11px]" onClick={() => onViewOrder(o.id)}>
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className={`text-lg font-bodoni font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>Top customers</h3>
          <div className="space-y-4">
            {topCustomers.length === 0 && <p className="text-sm text-zinc-500">No customer data yet.</p>}
            {topCustomers.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-[13px]">{c.name}</p>
                  <p className="text-[11px] text-zinc-500">{c._count?.orders ?? 0} orders</p>
                </div>
                <p className="text-sm font-bold text-cta">KSh {Math.round(c.totalSpent || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

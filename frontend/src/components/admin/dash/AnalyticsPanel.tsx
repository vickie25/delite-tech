import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { adminGet } from "../../../lib/adminAuth";
import { Button } from "../../ui/Button";

type Props = { isDarkMode: boolean };

export default function AnalyticsPanel({ isDarkMode }: Props) {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await adminGet<any>(`/api/admin/analytics?range=${range}`);
        if (!cancelled) setData(d);
      } catch {
        if (!cancelled) setData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";
  const series = (data?.revenueByDay || []).map((x: any) => ({ label: x.date?.slice(5) || x.date, revenue: x.revenue }));
  const best = (data?.bestSellers || []).slice(0, 8);
  const cat = (data?.categoryPerformance || []).map((c: any) => ({ name: c.name, revenue: Math.round(c.revenue) }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Analytics</h2>
        <div className="flex gap-1">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <Button key={r} type="button" variant={range === r ? "default" : "outline"} className="!text-xs !px-3" onClick={() => setRange(r)}>
              Last {r === "7d" ? "7" : r === "30d" ? "30" : "90"} days
            </Button>
          ))}
        </div>
      </div>

      <div className={`grid md:grid-cols-3 gap-3 ${card} rounded-xl border p-4`}>
        <div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Total revenue</p>
          <p className="text-xl font-bold">KSh {Math.round(data?.summary?.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Avg order value</p>
          <p className="text-xl font-bold">KSh {Math.round(data?.summary?.aov || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Orders (range)</p>
          <p className="text-xl font-bold">{data?.summary?.orderCount ?? 0}</p>
        </div>
      </div>

      <div className={`rounded-xl border p-4 ${card}`}>
        <h3 className={`font-bodoni font-bold text-lg mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>Revenue</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series.length ? series : [{ label: "-", revenue: 0 }]}>
              <defs>
                <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CA8A04" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#CA8A04" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#27272A" : "#eee"} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#CA8A04" fill="url(#a)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`rounded-xl border p-4 ${card}`}>
          <h3 className="font-bodoni font-bold text-lg mb-2">Best sellers</h3>
          <ul className="text-[13px] space-y-2">
            {best.map((b: any) => (
              <li key={b.productId} className="flex justify-between">
                <span>{b.name}</span>
                <span className="font-bold">{b.qty} sold</span>
              </li>
            ))}
            {!best.length && <li className="text-zinc-500">No sales in this range.</li>}
          </ul>
        </div>
        <div className={`rounded-xl border p-4 ${card}`}>
          <h3 className="font-bodoni font-bold text-lg mb-4">Category performance</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cat.length ? cat : [{ name: "-", revenue: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#CA8A04" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-4 ${card}`}>
        <h3 className="font-bodoni font-bold text-lg mb-2">Conversion funnel</h3>
        <div className="grid sm:grid-cols-4 gap-3 text-center text-[13px]">
          <div>
            <p className="text-2xl font-bold">{data?.funnel?.placed ?? 0}</p>
            <p className="text-zinc-500 text-[11px]">Placed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{data?.funnel?.confirmed ?? 0}</p>
            <p className="text-zinc-500 text-[11px]">Confirmed+</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{data?.funnel?.shipped ?? 0}</p>
            <p className="text-zinc-500 text-[11px]">Shipped+</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{data?.funnel?.delivered ?? 0}</p>
            <p className="text-zinc-500 text-[11px]">Delivered</p>
          </div>
        </div>
        <p className="text-[11px] text-zinc-500 mt-4">Traffic sources can be connected when marketing pixels are integrated.</p>
      </div>
    </div>
  );
}

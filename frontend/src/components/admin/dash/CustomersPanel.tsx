import { useState } from "react";
import { Button } from "../../ui/Button";
import { adminGet, adminPatch } from "../../../lib/adminAuth";

type Props = { isDarkMode: boolean; customers: any[]; setCustomers: (c: any[]) => void };

export default function CustomersPanel({ isDarkMode, customers, setCustomers }: Props) {
  const [active, setActive] = useState<"" | "yes" | "no">("");
  const [minSpend, setMinSpend] = useState("");
  const [detail, setDetail] = useState<any | null>(null);

  const filtered = customers.filter((c) => {
    if (active === "yes" && c.isActive === false) return false;
    if (active === "no" && c.isActive !== false) return false;
    const m = Number(minSpend);
    if (Number.isFinite(m) && (c.totalSpent || 0) < m) return false;
    return true;
  });

  const open = async (id: number) => {
    const d = await adminGet<any>(`/api/admin/customers/${id}`);
    setDetail(d);
  };

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  return (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Customers</h2>
      <div className={`flex flex-wrap gap-2 p-4 rounded-xl border ${card}`}>
        <select
          value={active}
          onChange={(e) => setActive(e.target.value as any)}
          className="text-[12px] font-bold rounded-lg border px-3 py-2"
        >
          <option value="">Active: All</option>
          <option value="yes">Active</option>
          <option value="no">Inactive</option>
        </select>
        <input
          type="number"
          placeholder="Min spent (KSh)"
          value={minSpend}
          onChange={(e) => setMinSpend(e.target.value)}
          className="text-[12px] font-bold rounded-lg border px-3 py-2 w-36"
        />
      </div>

      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Spent</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-bold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[10px] flex items-center justify-center font-bold">
                    {c.name?.slice(0, 2)?.toUpperCase()}
                  </div>
                  {c.name}
                </td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone || "—"}</td>
                <td className="px-4 py-3">{c._count?.orders ?? 0}</td>
                <td className="px-4 py-3 font-bold text-cta">KSh {Math.round(c.totalSpent || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-zinc-500 text-[12px]">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{c.isActive === false ? "Inactive" : "Active"}</td>
                <td className="px-4 py-3 text-right">
                  <Button type="button" variant="outline" className="!h-8 !text-[11px]" onClick={() => open(c.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50" onClick={() => setDetail(null)}>
          <div className={`max-w-lg w-full rounded-2xl border p-6 ${card}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-xl font-bodoni font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>{detail.name}</h3>
            <p className="text-sm text-zinc-500 mb-1">{detail.email}</p>
            <p className="text-sm mb-4">Lifetime value: KSh {Math.round(detail.lifetimeValue || 0).toLocaleString()}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Notes</p>
            <textarea
              defaultValue={detail.notes || ""}
              id="cust-notes"
              rows={4}
              className="w-full text-[13px] rounded-lg border p-2 mb-2"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                className="!text-xs"
                onClick={async () => {
                  const el = document.getElementById("cust-notes") as HTMLTextAreaElement;
                  await adminPatch(`/api/admin/customers/${detail.id}`, { notes: el?.value || "" });
                  setDetail(null);
                  const list = await adminGet<{ items: any[] }>("/api/admin/customers?page=1&pageSize=100");
                  setCustomers(list.items || []);
                }}
              >
                Save notes
              </Button>
              <Button type="button" variant="outline" className="!text-xs" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase mt-6 mb-2">Order history</p>
            <div className="max-h-48 overflow-y-auto space-y-2 text-[12px]">
              {(detail.orders || []).map((o: any) => (
                <div key={o.id} className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 py-1">
                  <span>#{o.orderNumber}</span>
                  <span className="font-bold">KSh {Number(o.totalAmount).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 mt-4 italic">Wishlist / saved items can be wired when storefront APIs exist.</p>
          </div>
        </div>
      )}
    </div>
  );
}

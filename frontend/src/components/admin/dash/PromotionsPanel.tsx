import { useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminAuth";
import { Button } from "../../ui/Button";

type Props = { isDarkMode: boolean };

export default function PromotionsPanel({ isDarkMode }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    discountType: "PERCENT",
    value: "10",
    code: "",
    usageLimit: "",
    minOrderValue: "",
    startsAt: "",
    endsAt: "",
    flashProductId: "",
    flashEndsAt: "",
  });

  const load = async () => {
    const d = await adminGet<{ items: any[] }>("/api/admin/promotions");
    setItems(d.items || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const genCode = () => {
    const c = `SAVE${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setForm((f) => ({ ...f, code: c }));
  };

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Promotions</h2>

      <div className={`rounded-xl border p-6 space-y-4 ${card}`}>
        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Create promotion</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-[13px] font-bold"
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="border rounded-lg px-3 py-2 text-[13px] font-bold"
          >
            <option value="PERCENT">% off</option>
            <option value="FIXED">Fixed amount</option>
            <option value="FREE_SHIPPING">Free shipping</option>
          </select>
          <input
            placeholder="Value (amount or %)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="border rounded-lg px-3 py-2 text-[13px] font-bold"
          />
          <div className="flex gap-2">
            <input
              placeholder="Coupon code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="flex-grow border rounded-lg px-3 py-2 text-[13px] font-bold"
            />
            <Button type="button" variant="outline" className="!text-xs" onClick={genCode}>
              Generate
            </Button>
          </div>
          <input
            placeholder="Usage limit"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            className="border rounded-lg px-3 py-2 text-[13px] font-bold"
          />
          <input
            placeholder="Min order value"
            value={form.minOrderValue}
            onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
            className="border rounded-lg px-3 py-2 text-[13px] font-bold"
          />
          <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="border rounded-lg px-3 py-2 text-[12px]" />
          <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="border rounded-lg px-3 py-2 text-[12px]" />
        </div>
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 grid md:grid-cols-2 gap-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase md:col-span-2">Flash sale (optional)</p>
          <input
            placeholder="Product ID"
            value={form.flashProductId}
            onChange={(e) => setForm({ ...form, flashProductId: e.target.value })}
            className="border rounded-lg px-3 py-2 text-[13px] font-bold"
          />
          <input type="datetime-local" value={form.flashEndsAt} onChange={(e) => setForm({ ...form, flashEndsAt: e.target.value })} className="border rounded-lg px-3 py-2 text-[12px]" />
        </div>
        <Button
          type="button"
          onClick={async () => {
            await adminPost("/api/admin/promotions", {
              name: form.name,
              discountType: form.discountType,
              value: form.discountType === "FREE_SHIPPING" ? null : Number(form.value),
              code: form.code,
              usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
              minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
              startsAt: form.startsAt || null,
              endsAt: form.endsAt || null,
              flashProductId: form.flashProductId ? Number(form.flashProductId) : null,
              flashEndsAt: form.flashEndsAt || null,
            });
            setForm({ name: "", discountType: "PERCENT", value: "10", code: "", usageLimit: "", minOrderValue: "", startsAt: "", endsAt: "", flashProductId: "", flashEndsAt: "" });
            await load();
          }}
        >
          Save promotion
        </Button>
      </div>

      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Ends</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-bold">{p.name}</td>
                <td className="px-4 py-3">{p.discountType}</td>
                <td className="px-4 py-3 font-mono text-[12px]">{p.code}</td>
                <td className="px-4 py-3">
                  {p.usageCount}
                  {p.usageLimit != null ? ` / ${p.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3 text-[12px] text-zinc-500">{p.endsAt ? new Date(p.endsAt).toLocaleString() : "—"}</td>
                <td className="px-4 py-3">{p.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="!h-8 !text-[10px]"
                    onClick={async () => {
                      await adminPatch(`/api/admin/promotions/${p.id}`, { active: !p.active });
                      await load();
                    }}
                  >
                    Toggle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="!h-8 !text-[10px] text-red-600"
                    onClick={async () => {
                      if (!confirm("Delete promotion?")) return;
                      await adminDelete(`/api/admin/promotions/${p.id}`);
                      await load();
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { adminGet, adminPatch } from "../../../lib/adminAuth";
import { Button } from "../../ui/Button";

type Props = { isDarkMode: boolean };

export default function ReviewsPanel({ isDarkMode }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");

  const load = async () => {
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    if (rating) qs.set("rating", rating);
    const d = await adminGet<{ items: any[] }>(`/api/admin/reviews?${qs}`);
    setItems(d.items || []);
  };

  useEffect(() => {
    void load();
  }, [status, rating]);

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  const byProduct = items.reduce<Record<string, { sum: number; n: number }>>((acc, r) => {
    const k = r.product?.name || "Unknown";
    if (!acc[k]) acc[k] = { sum: 0, n: 0 };
    acc[k].sum += r.rating;
    acc[k].n += 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Reviews</h2>
      <div className={`flex flex-wrap gap-2 p-4 rounded-xl border ${card}`}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-[12px] font-bold border rounded-lg px-3 py-2">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="text-[12px] font-bold border rounded-lg px-3 py-2">
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={String(n)}>
              {n} stars
            </option>
          ))}
        </select>
      </div>

      <div className={`rounded-xl border p-4 ${card}`}>
        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Avg rating by product (loaded set)</p>
        <ul className="text-[12px] space-y-1">
          {Object.entries(byProduct).map(([name, v]) => (
            <li key={name}>
              {name}: {(v.sum / v.n).toFixed(1)} ★ ({v.n})
            </li>
          ))}
          {!items.length && <li className="text-zinc-500">No reviews.</li>}
        </ul>
      </div>

      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-bold max-w-[140px] truncate">{r.product?.name}</td>
                <td className="px-4 py-3">{r.customer?.name || r.authorName}</td>
                <td className="px-4 py-3">{"★".repeat(r.rating)}</td>
                <td className="px-4 py-3 max-w-xs truncate">{r.body}</td>
                <td className="px-4 py-3 text-[11px]">{r.status}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="!h-8 !text-[10px]"
                    onClick={async () => {
                      await adminPatch(`/api/admin/reviews/${r.id}`, { status: "APPROVED" });
                      await load();
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="!h-8 !text-[10px]"
                    onClick={async () => {
                      await adminPatch(`/api/admin/reviews/${r.id}`, { status: "REJECTED" });
                      await load();
                    }}
                  >
                    Reject
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

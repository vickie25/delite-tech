import { useMemo, useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { Button } from "../../ui/Button";
import { adminGet, adminPut } from "../../../lib/adminAuth";

type Props = { isDarkMode: boolean; products: any[]; setProducts: (p: any[]) => void };

export default function InventoryPanel({ isDarkMode, products, setProducts }: Props) {
  const [logs, setLogs] = useState<any[] | null>(null);
  const [bulkId, setBulkId] = useState("");
  const [bulkQty, setBulkQty] = useState("");

  const rows = useMemo(
    () =>
      products.map((p) => {
        const rl = p.reorderLevel ?? 5;
        let status = "In Stock";
        if (p.stockQuantity <= 0) status = "Out of Stock";
        else if (p.stockQuantity <= rl) status = "Low Stock";
        return { ...p, rl, status };
      }),
    [products],
  );

  const low = rows.filter((r) => r.status !== "In Stock");

  const exportCsv = () => {
    const header = "id,name,sku,category,stock,reorder,status";
    const body = rows
      .map((r) =>
        [r.id, `"${(r.name || "").replace(/"/g, '""')}"`, r.sku || "", r.category?.name, r.stockQuantity, r.rl, r.status].join(","),
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inventory.csv";
    a.click();
  };

  const loadLogs = async (productId?: number) => {
    const qs = productId ? `?productId=${productId}` : "";
    const data = await adminGet<{ items: any[] }>(`/api/admin/inventory/logs${qs}`);
    setLogs(data.items || []);
  };

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Inventory</h2>
        <Button type="button" variant="outline" className="!text-xs gap-1" onClick={exportCsv}>
          <Download className="w-3.5 h-3.5" /> Export report
        </Button>
      </div>

      {low.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {low.slice(0, 6).map((p) => (
            <div key={p.id} className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-[13px]">{p.name}</p>
                <p className="text-[11px] text-zinc-500">
                  Stock {p.stockQuantity} · Reorder {p.rl}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`rounded-xl border p-4 ${card}`}>
        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Bulk stock update</p>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Product ID"
            value={bulkId}
            onChange={(e) => setBulkId(e.target.value)}
            className="text-[12px] font-bold border rounded-lg px-3 py-2 w-28"
          />
          <input
            placeholder="New quantity"
            value={bulkQty}
            onChange={(e) => setBulkQty(e.target.value)}
            className="text-[12px] font-bold border rounded-lg px-3 py-2 w-28"
          />
          <Button
            type="button"
            className="!text-xs"
            onClick={async () => {
              const id = Number(bulkId);
              const q = Number(bulkQty);
              if (!Number.isFinite(id) || !Number.isFinite(q)) return;
              await adminPut(`/api/admin/products/${id}`, { stockQuantity: q, stockChangeReason: "bulk_inventory_update" });
              const data = await adminGet<{ items: any[] }>("/api/admin/products?page=1&pageSize=200");
              setProducts(data.items || []);
              setBulkId("");
              setBulkQty("");
            }}
          >
            Apply
          </Button>
          <Button type="button" variant="outline" className="!text-xs" onClick={() => loadLogs()}>
            View audit log
          </Button>
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Reorder</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-bold">{r.name}</td>
                <td className="px-4 py-3 text-zinc-500">{r.sku || "—"}</td>
                <td className="px-4 py-3">{r.category?.name}</td>
                <td className="px-4 py-3">{r.stockQuantity}</td>
                <td className="px-4 py-3">{r.rl}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3 text-right">
                  <Button type="button" variant="outline" className="!h-7 !text-[10px]" onClick={() => loadLogs(r.id)}>
                    History
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs && (
        <div className={`rounded-xl border p-4 ${card}`}>
          <div className="flex justify-between mb-2">
            <p className="font-bold">Stock history</p>
            <button type="button" className="text-[11px] text-zinc-500" onClick={() => setLogs(null)}>
              Close
            </button>
          </div>
          <ul className="text-[12px] space-y-1 max-h-56 overflow-y-auto">
            {logs.map((l) => (
              <li key={l.id}>
                {new Date(l.createdAt).toLocaleString()} — {l.product?.name}: {l.previousQty} → {l.newQty} ({l.delta > 0 ? "+" : ""}
                {l.delta}) {l.reason ? `· ${l.reason}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Printer, RefreshCw } from "lucide-react";
import { Button } from "../../ui/Button";
import { adminGet, adminPatch } from "../../../lib/adminAuth";

type Props = {
  isDarkMode: boolean;
  orders: any[];
  setOrders: (o: any[]) => void;
  initialDetailId: number | null;
  onClearInitialDetail: () => void;
};

export default function OrdersPanel({ isDarkMode, orders, setOrders, initialDetailId, onClearInitialDetail }: Props) {
  const [statusF, setStatusF] = useState("");
  const [payF, setPayF] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [detail, setDetail] = useState<any | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const reload = async () => {
    const qs = new URLSearchParams({ page: "1", pageSize: "100" });
    if (statusF) qs.set("status", statusF);
    if (payF) qs.set("paymentMethod", payF);
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    const data = await adminGet<{ items: any[] }>(`/api/admin/orders?${qs}`);
    setOrders(data.items || []);
  };

  const openDetail = async (id: number) => {
    try {
      const o = await adminGet<any>(`/api/admin/orders/${id}`);
      setDetail(o);
      setNoteDraft(o.internalNotes || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!initialDetailId) return;
    void (async () => {
      try {
        const o = await adminGet<any>(`/api/admin/orders/${initialDetailId}`);
        setDetail(o);
        setNoteDraft(o.internalNotes || "");
      } catch(err) {
        console.error(err);
      }
    })();
    onClearInitialDetail();
  }, [initialDetailId, onClearInitialDetail]);

  const patchOrder = async (body: any) => {
    if (!detail) return;
    const updated = await adminPatch<any>(`/api/admin/orders/${detail.id}`, body);
    setDetail(updated);
    await reload();
  };

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Orders</h2>
          <p className="text-[11px] text-zinc-500 uppercase font-semibold">Fulfillment & payments</p>
        </div>
        <Button type="button" variant="outline" className="!text-xs gap-1" onClick={reload}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <div className={`flex flex-wrap gap-2 p-4 rounded-xl border ${card}`}>
        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2"
        >
          <option value="">All statuses</option>
          {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="Payment method"
          value={payF}
          onChange={(e) => setPayF(e.target.value)}
          className="text-[12px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 w-36"
        />
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-[12px] font-bold rounded-lg border px-2 py-2" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-[12px] font-bold rounded-lg border px-2 py-2" />
        <Button type="button" className="!text-xs" onClick={reload}>
          Apply filters
        </Button>
      </div>

      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Fulfillment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-bold">#{o.orderNumber}</td>
                <td className="px-4 py-3">{o.customer?.name || o.customerName}</td>
                <td className="px-4 py-3">{o.items?.length ?? 0}</td>
                <td className="px-4 py-3 font-bold">KSh {Number(o.totalAmount).toLocaleString()}</td>
                <td className="px-4 py-3 text-[11px]">
                  <div>{o.paymentStatus || "—"}</div>
                  <div className="text-zinc-500">{o.paymentMethod}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cta/10 text-cta">{o.status}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-[12px]">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <Button type="button" variant="outline" className="!h-8 !text-[11px]" onClick={() => openDetail(o.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className={`fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 bg-black/50`} onClick={() => setDetail(null)}>
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 ${card}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Order #{detail.orderNumber}</h3>
                <p className="text-[11px] text-zinc-500">{new Date(detail.createdAt).toLocaleString()}</p>
              </div>
              <Button type="button" variant="outline" className="!text-xs" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-[13px] mb-6">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Customer</p>
                <p className="font-bold">{detail.customerName}</p>
                <p className="text-zinc-500">{detail.customerEmail}</p>
                <p className="text-zinc-500">{detail.customerPhone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Ship to</p>
                <p>{detail.deliveryAddress}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Items</p>
              {(detail.items || []).map((it: any) => (
                <div key={it.id} className="flex gap-3 items-center border border-zinc-100 dark:border-zinc-800 rounded-lg p-2">
                  <img src={it.product?.imageUrls?.[0]} alt="" className="w-12 h-12 object-contain rounded bg-zinc-50 dark:bg-zinc-900" />
                  <div className="flex-grow">
                    <p className="font-bold text-[13px]">{it.productName}</p>
                    <p className="text-[11px] text-zinc-500">
                      {it.quantity} × KSh {Number(it.unitPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Timeline</p>
              <ol className="text-[12px] space-y-1 list-decimal pl-4">
                <li>Placed — {new Date(detail.createdAt).toLocaleString()}</li>
                <li>Current status: {detail.status}</li>
              </ol>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Payment</p>
              <p>
                {detail.paymentMethod} · {detail.paymentStatus || "UNPAID"}
              </p>
              <p className="font-bold mt-1">Total KSh {Number(detail.totalAmount).toLocaleString()}</p>
            </div>

            <div className="mb-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Internal notes</label>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                className="w-full mt-1 text-[13px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent p-2"
              />
              <Button type="button" className="!text-xs mt-2" onClick={() => patchOrder({ internalNotes: noteDraft })}>
                Save notes
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={detail.status}
                onChange={(e) => patchOrder({ status: e.target.value })}
                className="text-[12px] font-bold rounded-lg border px-2 py-2"
              >
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" className="!text-xs gap-1" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print invoice
              </Button>
              <Button type="button" variant="outline" className="!text-xs" onClick={() => patchOrder({ status: "REFUNDED", paymentStatus: "REFUNDED" })}>
                Issue refund
              </Button>
              <Button type="button" variant="outline" className="!text-xs" onClick={() => patchOrder({ status: "CANCELLED" })}>
                Cancel order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

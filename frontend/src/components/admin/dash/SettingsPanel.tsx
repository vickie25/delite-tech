import { useEffect, useState } from "react";
import { adminGet, adminPut } from "../../../lib/adminAuth";
import { Button } from "../../ui/Button";

type Props = { isDarkMode: boolean };

const tabs = ["store", "payment", "shipping", "tax", "notifications"] as const;

export default function SettingsPanel({ isDarkMode }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("store");
  const [s, setS] = useState<any>(null);

  const load = async () => {
    const row = await adminGet<any>("/api/admin/store-settings");
    setS(row);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    await adminPut("/api/admin/store-settings", s);
    await load();
  };

  if (!s) return <p className="text-zinc-500">Loading settings…</p>;

  const pay = (s.paymentConfig && typeof s.paymentConfig === "object" ? s.paymentConfig : {}) as Record<string, boolean>;
  const setPay = (k: string, v: boolean) => setS({ ...s, paymentConfig: { ...pay, [k]: v } });

  const notif = (s.notificationSettings && typeof s.notificationSettings === "object" ? s.notificationSettings : {}) as Record<string, boolean>;
  const setNotif = (k: string, v: boolean) => setS({ ...s, notificationSettings: { ...notif, [k]: v } });

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-100";

  return (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Settings</h2>
      <div className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[12px] font-bold rounded-lg capitalize ${
              tab === t ? "bg-black text-white dark:bg-cta dark:text-black" : "text-zinc-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border p-6 space-y-4 ${card}`}>
        {tab === "store" && (
          <>
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Store name</label>
            <input className="w-full border rounded-lg px-3 py-2 font-bold" value={s.storeName} onChange={(e) => setS({ ...s, storeName: e.target.value })} />
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Logo URL</label>
            <input className="w-full border rounded-lg px-3 py-2 font-bold" value={s.logoUrl || ""} onChange={(e) => setS({ ...s, logoUrl: e.target.value })} />
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Currency</label>
            <input className="w-full border rounded-lg px-3 py-2 font-bold" value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value })} />
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Timezone</label>
            <input className="w-full border rounded-lg px-3 py-2 font-bold" value={s.timezone} onChange={(e) => setS({ ...s, timezone: e.target.value })} />
          </>
        )}
        {tab === "payment" && (
          <div className="space-y-3">
            {[
              ["mpesa", "M-Pesa"],
              ["card", "Card"],
              ["cod", "Cash on Delivery"],
              ["paypal", "PayPal"],
            ].map(([k, label]) => (
              <label key={k} className="flex items-center justify-between gap-4 border rounded-lg px-4 py-3">
                <span className="font-bold text-[13px]">{label}</span>
                <input type="checkbox" checked={!!pay[k]} onChange={(e) => setPay(k, e.target.checked)} />
              </label>
            ))}
          </div>
        )}
        {tab === "shipping" && (
          <>
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Default delivery fee (KSh)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 font-bold"
              value={s.deliveryFee}
              onChange={(e) => setS({ ...s, deliveryFee: Number(e.target.value) })}
            />
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Free shipping threshold (KSh)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 font-bold"
              value={s.freeShippingThreshold ?? ""}
              onChange={(e) => setS({ ...s, freeShippingThreshold: e.target.value === "" ? null : Number(e.target.value) })}
            />
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Zones (JSON)</label>
            <textarea
              rows={6}
              className="w-full border rounded-lg px-3 py-2 font-mono text-[12px]"
              value={JSON.stringify(s.shippingZones || [], null, 2)}
              onChange={(e) => {
                try {
                  setS({ ...s, shippingZones: JSON.parse(e.target.value) });
                } catch {
                  /* ignore */
                }
              }}
            />
          </>
        )}
        {tab === "tax" && (
          <>
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Tax label</label>
            <input className="w-full border rounded-lg px-3 py-2 font-bold" value={s.taxLabel} onChange={(e) => setS({ ...s, taxLabel: e.target.value })} />
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Tax rate (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded-lg px-3 py-2 font-bold"
              value={s.taxRate}
              onChange={(e) => setS({ ...s, taxRate: Number(e.target.value) })}
            />
          </>
        )}
        {tab === "notifications" && (
          <div className="space-y-3">
            {[
              ["newOrders", "Email: new orders"],
              ["lowStock", "Email: low stock"],
              ["newReviews", "Email: new reviews"],
            ].map(([k, label]) => (
              <label key={k} className="flex items-center justify-between gap-4 border rounded-lg px-4 py-3">
                <span className="font-bold text-[13px]">{label}</span>
                <input type="checkbox" checked={!!notif[k]} onChange={(e) => setNotif(k, e.target.checked)} />
              </label>
            ))}
          </div>
        )}
        <Button type="button" onClick={save}>
          Save changes
        </Button>
      </div>
    </div>
  );
}

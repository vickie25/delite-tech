import { useEffect, useState } from "react";
import { adminGet, adminPatch } from "../../../lib/adminAuth";
import { Button } from "../../ui/Button";

type Props = { isDarkMode: boolean };

export default function StaffPanel({ isDarkMode }: Props) {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const d = await adminGet<{ items: any[] }>("/api/admin/admins");
    setItems(d.items || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const card = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-100";

  return (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bodoni font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Staff / Admins</h2>
      <p className="text-[13px] text-zinc-500">Assign roles for dashboard access. Add new admins via bootstrap script or database.</p>
      <div className={`rounded-xl border overflow-hidden ${card}`}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className={`text-[10px] uppercase font-bold text-zinc-400 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-bold">{a.name}</td>
                <td className="px-4 py-3">{a.email}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={a.role || "MANAGER"}
                    className="text-[12px] font-bold border rounded-lg px-2 py-1"
                    onChange={async (e) => {
                      await adminPatch(`/api/admin/admins/${a.id}`, { role: e.target.value });
                      await load();
                    }}
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button type="button" variant="outline" className="!h-8 !text-[10px]" disabled>
                    Reset invite
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

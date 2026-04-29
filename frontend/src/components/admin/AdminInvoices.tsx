import React from 'react';
import { FileText, Download, Printer, Mail, Search, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminInvoicesProps {
  darkMode?: boolean;
  orders: any[];
}

const AdminInvoices: React.FC<AdminInvoicesProps> = ({ darkMode, orders }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bodoni font-bold uppercase tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>Financial Documents</h3>
          <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Generate and archive system invoices</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Ref number..." 
              className={`pl-9 pr-4 py-2 rounded-lg text-xs font-bold outline-none border w-48 ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'}`} 
            />
          </div>
          <Button variant="outline" className={`!rounded-lg border-zinc-200 text-zinc-400 bg-white !px-4 !py-2 text-[11px] ${darkMode ? '!bg-zinc-900 border-zinc-800' : ''}`}>
            <Filter className="w-3.5 h-3.5 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`border-b ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Document Ref</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client Entity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date Issued</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Valuation</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Commands</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-zinc-900 text-cta' : 'bg-zinc-50 text-zinc-400'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <p className={`text-[13px] font-bold ${darkMode ? 'text-white' : 'text-black'}`}>INV-{order.orderNumber}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-[13px] font-bold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{order.customer?.name || "Guest Entity"}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">{order.customer?.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-[12px] font-bold ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[13px] font-bold text-cta">KSh {Number(order.totalAmount).toLocaleString()}</p>
                  <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Verified</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-all"><Printer className="w-3.5 h-3.5" /></button>
                    <button className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-all"><Mail className="w-3.5 h-3.5" /></button>
                    <button className="w-8 h-8 rounded-lg bg-black dark:bg-cta flex items-center justify-center text-white shadow-lg transition-all active:scale-90"><Download className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInvoices;

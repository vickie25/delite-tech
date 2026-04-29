import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, Settings2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminAttributesProps {
  darkMode?: boolean;
}

const AdminAttributes: React.FC<AdminAttributesProps> = ({ darkMode }) => {
  const [attributes] = useState([
    { id: '1', name: 'Size', type: 'Dropdown', values: ['S', 'M', 'L', 'XL'] },
    { id: '2', name: 'Color', type: 'Visual', values: ['Black', 'White', 'Chrome'] },
    { id: '3', name: 'Material', type: 'Text', values: ['Aluminum', 'Carbon', 'Glass'] },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAttr, setNewAttr] = useState({ name: '', type: 'Dropdown' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bodoni font-bold uppercase ${darkMode ? 'text-white' : 'text-black'}`}>Product Attributes</h3>
          <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Define variations and specific parameters</p>
        </div>
        <Button 
          variant="default" 
          onClick={() => setIsAdding(true)}
          className="!rounded-lg shadow-md !px-6 !py-2 text-xs"
        >
          <Plus className="w-4 h-4 mr-2" /> New Attribute
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-5 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 shadow-sm ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-black dark:text-white uppercase tracking-widest">Protocol Creation</span>
                <button onClick={() => setIsAdding(false)} className="text-zinc-300 hover:text-black dark:hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <input 
                autoFocus
                placeholder="Attribute Name (e.g. Size)"
                className={`w-full border rounded-lg px-3 py-2 text-[13px] font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-black' : 'bg-zinc-50 border-zinc-200 text-black focus:bg-white'}`}
                onChange={(e) => setNewAttr({...newAttr, name: e.target.value})}
              />
              <select className={`w-full border rounded-lg px-3 py-2 text-[13px] font-bold outline-none ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                <option>Dropdown</option>
                <option>Visual Selector</option>
                <option>Text Input</option>
                <option>Numerical Range</option>
              </select>
              <Button className="!rounded-lg w-full text-[11px] !py-2">Commit Attribute</Button>
            </motion.div>
          )}

          {attributes.map((attr) => (
            <motion.div 
              layout
              key={attr.id}
              className={`p-5 rounded-lg border transition-all relative overflow-hidden group ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100 hover:shadow-md'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-zinc-900 text-black' : 'bg-zinc-50 text-zinc-400 group-hover:text-black'}`}>
                  <Settings2 className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <p className={`text-[14px] font-bold leading-tight uppercase ${darkMode ? 'text-white' : 'text-black'}`}>{attr.name}</p>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{attr.type}</p>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {attr.values.map((val, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-100 text-zinc-600'}`}>
                    {val}
                  </span>
                ))}
                <button className={`w-6 h-6 rounded-lg border border-dashed flex items-center justify-center text-zinc-400 hover:border-black hover:text-black transition-colors ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminAttributes;
